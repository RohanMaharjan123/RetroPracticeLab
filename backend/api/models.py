from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from django.utils import timezone

# Custom User model
class User(AbstractUser):
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    
    groups = models.ManyToManyField(Group, related_name='custom_user_set', blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name='custom_user_set', blank=True)
    
    REQUIRED_FIELDS = []


# class Note(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notes')
#     date = models.DateTimeField(default=timezone.now)
#     task = models.CharField(max_length=255)
#     description = models.TextField()

#     def __str__(self):
#         return self.task 






