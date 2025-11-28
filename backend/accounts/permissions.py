from rest_framework import permissions

class IsAdminUserType(permissions.BasePermission):
    """
    Allows access only to users with user_type='admin'.
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.user_type == "admin")
