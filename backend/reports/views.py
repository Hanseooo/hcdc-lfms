from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
import cloudinary.uploader

from .models import Report, LostItem, FoundItem, Comment, Claim, Notification
from .serializers import *
from .permissions import IsOwnerOrReadOnly, IsCommentOwnerOrReportOwnerOrReadOnly, IsAdminOrOwnerOrReadOnly
from django.contrib.auth import get_user_model
from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import viewsets, permissions, status
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q

class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all().order_by("-date_time")  # Keep this for the router
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAdminOrOwnerOrReadOnly ]
    
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["type", "status"]
    
    def get_queryset(self):
        # Start with the base queryset
        queryset = Report.objects.all().order_by("-date_time")
        
        # Handle search manually
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(lost_item__item_name__icontains=search) |
                Q(found_item__item_name__icontains=search) |
                Q(lost_item__description__icontains=search) |
                Q(found_item__description__icontains=search)
            )
        
        return queryset

    def perform_create(self, serializer):
        file = self.request.data.get("photo")
        photo_url = None
        if file:
            upload_result = cloudinary.uploader.upload(file)
            photo_url = upload_result.get("secure_url")

        report = serializer.save(reported_by=self.request.user)

        if report.type == "lost":
            LostItem.objects.create(
                report=report,
                item_name=self.request.data.get("item_name"),
                description=self.request.data.get("description"),
                category=self.request.data.get("category"),
                location_last_seen=self.request.data.get("location_last_seen"),
                photo_url=photo_url,
                date_lost=self.request.data.get("date_lost"),
            )
        else:
            FoundItem.objects.create(
                report=report,
                item_name=self.request.data.get("item_name"),
                description=self.request.data.get("description"),
                category=self.request.data.get("category"),
                location_found=self.request.data.get("location_found"),
                photo_url=photo_url,
                date_found=self.request.data.get("date_found"),
            )
            
    @action(detail=True, methods=["patch"], permission_classes=[permissions.IsAdminUser])
    def approve(self, request, pk=None):
        report = self.get_object()
        report.status = "approved"
        report.save(update_fields=["status"])
        return Response({"status": "approved"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["patch"], permission_classes=[permissions.IsAdminUser])
    def reject(self, request, pk=None):
        report = self.get_object()
        report.status = "rejected"
        report.save(update_fields=["status"])
        return Response({"status": "rejected"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def claim_item(self, request, pk=None):
        report = self.get_object()
        message = request.data.get("message", "")

        if report.type != "found":
            return Response({"error": "Only found reports can be claimed."}, status=400)

        claim = Claim.objects.create(
            report=report,
            claimed_by=request.user,
            message=message,
        )

        Notification.objects.create(
            user=report.reported_by,
            message=f"{request.user.username} wants to claim your found item.",
            detailed_message=message,
            related_report=report
        )

        return Response(
            {"status": "claim created", "claim_id": claim.id},
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=["post"])
    def item_found(self, request, pk=None):
        report = self.get_object()
        message = request.data.get("message", "")

        if report.type != "lost":
            return Response({"error": "Only lost reports can be marked found."}, status=400)

        Notification.objects.create(
            user=report.reported_by,
            message=f"{request.user.username} reported finding your lost item.",
            detailed_message=message,
            related_report=report
        )

        report.status = "resolved"
        report.save(update_fields=["status"])

        return Response({"status": "item found notification sent"})


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by("-created_at")
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated, IsCommentOwnerOrReportOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ClaimViewSet(viewsets.ModelViewSet):
    serializer_class = ClaimSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        # Admins see all claims, others only their own
        if user.is_staff:
            return Claim.objects.all().order_by("-date_claimed")
        return Claim.objects.filter(claimed_by=user).order_by("-date_claimed")

    def perform_create(self, serializer):
        serializer.save(claimed_by=self.request.user)

    @action(detail=False, methods=["get"], url_path="my-claims")
    def my_claims(self, request):
        claims = Claim.objects.filter(claimed_by=request.user).order_by("-date_claimed")
        serializer = self.get_serializer(claims, many=True)
        return Response(serializer.data)



class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all().order_by("-created_at")
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users should only see their own notifications
        return Notification.objects.filter(user=self.request.user)
