from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password
from .models import Login
from .checkLogin import check_user_exists, create_user

@api_view(['POST'])
def login_user(request):
    """
    API endpoint para login de usuarios
    """
    try:
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response(
                {'error': 'Username y password son requeridos'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verificar si el usuario existe
        if not check_user_exists(username):
            return Response(
                {'error': 'Usuario no encontrado'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Obtener el usuario y verificar la contraseña
        user = Login.objects.get(username=username)
        if check_password(password, user.password):
            return Response(
                {
                    'message': 'Login exitoso', 
                    'username': username
                }, 
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {'error': 'Credenciales incorrectas'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
    
    except Exception as e:
        return Response(
            {'error': f'Error interno del servidor: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def register_user(request):
    """
    API endpoint para registro de usuarios
    """
    try:
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response(
                {'error': 'Username y password son requeridos'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Crear el usuario
        if create_user(username, password):
            return Response(
                {'message': 'Usuario creado exitosamente'}, 
                status=status.HTTP_201_CREATED
            )
        else:
            return Response(
                {'error': 'El usuario ya existe'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    except Exception as e:
        return Response(
            {'error': f'Error interno del servidor: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
