from rest_framework import serializers
from .models import EmpresaEmisora, Cliente

class EmpresaEmisoraSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmpresaEmisora
        fields = '__all__'
        extra_kwargs = {'password': {'write_only': True}} # Ocultamos el password en las respuestas

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'
