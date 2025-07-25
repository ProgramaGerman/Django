"""myapp/models.py"""
from django.db import models

# Create your models here.
class Project(models.Model):
    """Model representing a project in the application."""
    name = models.CharField(max_length=100)

    def __str__(self) -> str:
        return self.name

class Task(models.Model):
    """Model representing a task associated with a project."""
    title = models.CharField(max_length=100)
    description = models.TextField()
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    done = models.BooleanField(default=False)


    def __str__(self):
        return f"{self.title} - {self.project.name}"
