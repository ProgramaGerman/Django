from django.test import TestCase
from login.models import Login
from login.checkLogin import create_user
from django.contrib.auth.hashers import make_password, check_password

class UserCreationTest(TestCase):
    def test_create_users_and_prevent_duplicates(self):
        """
        Verifica que se puedan crear usuarios y que no se permitan duplicados.
        """
        # Crear un primer usuario
        user1_created = create_user('usuario1', 'clave123')
        self.assertTrue(user1_created)

        # Crear un segundo usuario con un nombre de usuario diferente
        user2_created = create_user('usuario2', 'clave456')
        self.assertTrue(user2_created)

        # Intentar crear un usuario con el mismo nombre que el primero
        duplicate_user_created = create_user('usuario1', 'otra_clave')
        self.assertFalse(duplicate_user_created)

        # Verificar que solo se hayan creado 2 usuarios en la base de datos
        self.assertEqual(Login.objects.count(), 2)

class PasswordHashingTest(TestCase):
    def test_password_hashing(self):
        """
        Verifica que las contrasenas se encripten correctamente.
        """
        password = "clave123"
        hashed_password = make_password(password)
        self.assertNotEqual(hashed_password, password)
        self.assertTrue(check_password(password, hashed_password))
