"""
    Modulo de python para verificacion de existencia de usuario y verificacion de usuario existente al crear usuario
"""
from login.models import Login
from django.contrib.auth.hashers import make_password

def check_user_exists(username) -> bool:
    """
    Verifica si un usuario existe en la base de datos.
    """
    return Login.objects.filter(username=username).exists()

def create_user(username, password) -> bool:
    """
    Crea un nuevo usuario si no existe ya en la base de datos
    """
    if not check_user_exists(username):
        user = Login(username=username, password=hash_password(password))
        user.save()
        return True
    return False

def hash_password(password: str) -> str:
    """
    Encripta la contrasena usando el sistema de hash de Django.
    """
    return str(make_password(password))
