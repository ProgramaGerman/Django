from rest_framework import serializers
from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    """
    This file contains serializers for the Task model.
    Serializers are used to convert complex data types, such as querysets and model instances,
    into native Python datatypes that can then be easily rendered into JSON, XML or other content types.
    """

    class Meta:
        model = Task
        fields = "__all__"

    class TaskSerializer(serializers.ModelSerializer):
        class Meta:
            model = Task
            fields = "__all__"
