from django import forms


class createNewTask(forms.Form):
    title = forms.CharField(label="Titulo de tarea", max_length=200)
    description = forms.CharField(label="Descripcion de tarea", widget=forms.Textarea, max_length=500)

class createNewProject(forms.Form):
    title = forms.CharField(label="Nombre de proyecto", max_length=200)
    description = forms.CharField(label="Descripcion de proyecto", widget=forms.Textarea, max_length=500)
