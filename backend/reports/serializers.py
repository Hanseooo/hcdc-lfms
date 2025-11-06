from rest_framework import serializers
from .models import Report, LostItem, FoundItem, Comment, Claim, Notification
from django.contrib.auth import get_user_model

User = get_user_model()  # This will get the correct User model

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User 
        fields =  ["id", "username", "email", "first_name", "last_name", "profile_avatar_url"]

class LostItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = LostItem
        exclude = ["report"] 


class FoundItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoundItem
        exclude = ["report"]  


class ReportSerializer(serializers.ModelSerializer):
    reported_by = UserSerializer(read_only=True)
    lost_item = serializers.SerializerMethodField()
    found_item = serializers.SerializerMethodField()

    class Meta:
        model = Report
        fields = "__all__"

    def get_lost_item(self, obj):
        if obj.type == "lost" and hasattr(obj, 'lost_item'):
            return LostItemSerializer(obj.lost_item).data
        return None

    def get_found_item(self, obj):
        if obj.type == "found" and hasattr(obj, 'found_item'):
            return FoundItemSerializer(obj.found_item).data
        return None


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = "__all__"

class ClaimSerializer(serializers.ModelSerializer):
    claimed_by = UserSerializer(read_only=True)
    received_from = UserSerializer(read_only=True)
    supervised_by = UserSerializer(read_only=True)
    verified_by = UserSerializer(read_only=True)

    class Meta:
        model = Claim
        fields = "__all__"

class SimpleReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ["id", "type", "status", "date_time"]


class NotificationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    related_report = SimpleReportSerializer(read_only=True)

    class Meta:
        model = Notification
        fields = "__all__"

