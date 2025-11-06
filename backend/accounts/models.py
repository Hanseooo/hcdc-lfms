import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    id_number = models.CharField(max_length=50, blank=True, null=True)
    user_type = models.CharField(
        max_length=20,
        choices=[
            ('student', 'Student'),
            ('admin', 'Admin'),
        ],
        default='student',
    )
    contact_number = models.CharField(max_length=20, blank=True, null=True)
    profile_avatar_url = models.CharField(max_length=100, default="https://api.dicebear.com/9.x/adventurer/svg?seed=Easton", null=True)

    def __str__(self):  
        return self.username
