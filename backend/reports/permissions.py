# reports/permissions.py
from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit or delete it.
    """

    def has_object_permission(self, request, view, obj):
        # SAFE_METHODS = GET, HEAD, OPTIONS → always allowed
        if request.method in permissions.SAFE_METHODS:
            return True

        # For other methods, only the owner is allowed
        return obj.reported_by == request.user


# reports/permissions.py
from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Allows object owners (reported_by) to edit/delete their reports or related models.
    """

    def has_object_permission(self, request, view, obj):
        # Allow safe methods for all
        if request.method in permissions.SAFE_METHODS:
            return True

        # Check ownership for reports
        if hasattr(obj, "reported_by"):
            return obj.reported_by == request.user

        # For LostItem or FoundItem, link through the report
        if hasattr(obj, "report"):
            return obj.report.reported_by == request.user

        return False


class IsClaimerOrReadOnly(permissions.BasePermission):
    """
    Allows only the user who made a claim to edit or delete it.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.claimed_by == request.user


class IsCommentOwnerOrReportOwnerOrReadOnly(permissions.BasePermission):
    """
    Allows the comment author or the report owner to edit/delete a comment.
    Everyone else can only read.
    """

    def has_object_permission(self, request, view, obj):
        # Safe methods (GET, HEAD, OPTIONS) are always allowed
        if request.method in permissions.SAFE_METHODS:
            return True

        user = request.user

        # Allow if the user is the comment author
        if obj.user == user:
            return True

        # Allow if the user owns the related report
        if obj.report.reported_by == user:
            return True

        return False

class IsAdminOrOwnerOrReadOnly(permissions.BasePermission):
    """
    Allows admins (user_type='admin') or owners (reported_by=user) 
    to edit/delete reports. Others have read-only access.
    """

    def has_object_permission(self, request, view, obj):
        # Allow all safe methods (GET, HEAD, OPTIONS)
        if request.method in permissions.SAFE_METHODS:
            return True

        user = request.user

        # Allow admins full control
        if getattr(user, "user_type", None) == "admin":
            return True

        # Allow owners to edit/delete their own report
        if hasattr(obj, "reported_by") and obj.reported_by == user:
            return True

        # Allow ownership via linked models (LostItem or FoundItem)
        if hasattr(obj, "report") and obj.report.reported_by == user:
            return True

        return False