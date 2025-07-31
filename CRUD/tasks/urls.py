from django.urls import path, include
from .views import TaskViewSet
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'tasks', TaskViewSet, 'tasks')

urlpatterns = [
    path('api/v1/', include(router.urls)),
]