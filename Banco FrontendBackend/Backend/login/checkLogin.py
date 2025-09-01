"""
    Modulo de python para verificacion de existencia de usuario y verificacion de usuario existente al crear usuario
"""
from login.models import Login

def check_user_exists(username) -> bool:
    """
    Verifica si un usuario existe en la base de datos.
    """
    return Login.objects.filter(username=username).exists()

def create_user(username, password) -> bool:
    """
    Crea un nuevo usuario en la base de datos si no existe.
    """
    if not check_user_exists(username):
        user = Login(username=username, password=password)
        user.save()
        return True
    return False
