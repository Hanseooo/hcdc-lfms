from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ReportViewSet, CommentViewSet, ClaimViewSet, NotificationViewSet

router = DefaultRouter()
router.register("reports", ReportViewSet)
router.register("comments", CommentViewSet)
router.register("notifications", NotificationViewSet)
router.register("claims", ClaimViewSet, basename="claim")


urlpatterns = [
    path("", include(router.urls)),
]
    