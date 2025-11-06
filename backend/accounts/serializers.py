from rest_framework import serializers
from dj_rest_auth.registration.serializers import RegisterSerializer
from .models import User


class UserSerializer(serializers.ModelSerializer):
    # ensure ID appears as `id` in output (UUID Field)
    id = serializers.UUIDField(source="pk", read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "user_type",
            "id_number",
            "contact_number",
            "profile_avatar_url",
        ]



class CustomRegisterSerializer(RegisterSerializer):
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    id_number = serializers.CharField(required=False, allow_blank=True)
    contact_number = serializers.CharField(required=False, allow_blank=True)
    profile_avatar_url = serializers.URLField(required=False, allow_blank=True)

    def get_cleaned_data(self):
        data = super().get_cleaned_data()
        data.update({
            'first_name': self.validated_data.get('first_name', ''),
            'last_name': self.validated_data.get('last_name', ''),
            'id_number': self.validated_data.get('id_number', ''),
            'contact_number': self.validated_data.get('contact_number', ''),
            'profile_avatar_url': self.validated_data.get('profile_avatar_url', ''),
        })
        return data

    def save(self, request):
        user = super().save(request)
        cleaned = self.get_cleaned_data()

        user.first_name = cleaned.get('first_name', '')
        user.last_name = cleaned.get('last_name', '')
        user.id_number = cleaned.get('id_number', '')
        user.contact_number = cleaned.get('contact_number', '')
        avatar = cleaned.get('profile_avatar_url', '').strip()
        if avatar:
            user.profile_avatar_url = avatar
        else:
            user.profile_avatar_url = f"https://api.dicebear.com/9.x/adventurer/svg?seed={user.username}"
        user.save()

        return user
