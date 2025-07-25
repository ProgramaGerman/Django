from django.http import HttpResponse
from django.shortcuts import render, redirect

from myapp.models import Project, Task
from .forms import createNewTask, createNewProject

# Create your views here.


def index(request):
    tittle = "Django Course!!"
    return render(request, "index.html", {"tittle": tittle})


def about(request):
    username = "KratosG2025"
    return render(request, "about.html", {"username": username})


def hello(request, username):
    return HttpResponse(f"<h2>Hola, {username}!</h2>")


def projects(request):
    projects: list = list(Project.objects.all())
    return render(request, "projects/projects.html", {"projects": projects})


def tasks(request):
    # task = Task.objects.get(id = 1)
    tasks = Task.objects.all()
    return render(request, "tasks/task.html", {"tasks": tasks})


def create_task(request):
    if request.method == "GET":
        return render(request, "tasks/create_task.html", {"form": createNewTask()})
    else:
        Task.objects.create(
            title=request.POST["title"],
            description=request.POST["description"],
            project_id=2,
            done=False,
        )
        return redirect("/tasks/")


def create_project(request):
    if request.method == "GET":
        return render(
            request, "projects/create_project.html", {"form": createNewProject()}
        )
    else:
        Project.objects.create(
            name=request.POST["name"],
        )
        return redirect("projects")