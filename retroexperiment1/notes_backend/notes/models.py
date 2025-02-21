# Create your models here.
import uuid
from django.db import models

class Note(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    date = models.DateField()
    task = models.CharField(max_length=255)
    description = models.TextField()

    def __str__(self):
        return self.task