from rest_framework import serializers
from .models import Usuario

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        # Exponemos los campos más importantes para el frontend
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'rol', 'is_active', 'password',
            'acceso_pagos', 'acceso_cotizador', 'acceso_reclutamiento', 'acceso_comercial'
        ]
        # La contraseña solo se puede escribir, nunca se envía en una respuesta (GET)
        extra_kwargs = {
            'password': {'write_only': True, 'required': False}
        }

    def create(self, validated_data):
        # Extraemos la contraseña si viene en la petición
        password = validated_data.pop('password', None)
        # Creamos el usuario sin contraseña primero
        usuario = super().create(validated_data)
        # Si había contraseña, la encriptamos correctamente
        if password:
            usuario.set_password(password)
            usuario.save()
        return usuario
        
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        usuario = super().update(instance, validated_data)
        if password:
            usuario.set_password(password)
            usuario.save()
        return usuario
