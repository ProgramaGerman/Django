"This file is part of a Django application that manages tasks."
from django.db import models


# Create your models here.
class Task(models.Model):
    """Model representing a task in the application."""

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    done = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        """String representation of the Task model."""
        return str(self.title)
