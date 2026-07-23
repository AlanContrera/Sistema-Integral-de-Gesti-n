from rest_framework import serializers
from .models import (
    CategoriaPreguntas, PlantillaPregunta, Vacante, 
    Candidato, EntrevistaInicial, EntrevistaProfunda, ReporteCliente, Estado, Municipio, PropuestaCliente
)

class PlantillaPreguntaSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlantillaPregunta
        fields = '__all__'

class CategoriaPreguntasSerializer(serializers.ModelSerializer):
    preguntas = PlantillaPreguntaSerializer(many=True, read_only=True)

    class Meta:
        model = CategoriaPreguntas
        fields = '__all__'

class VacanteSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.CharField(source='categoria_puesto.nombre', read_only=True)
    consultor_nombre = serializers.CharField(source='consultor.get_full_name', read_only=True)

    class Meta:
        model = Vacante
        fields = '__all__'

class CandidatoSerializer(serializers.ModelSerializer):
    vacante_nombre = serializers.CharField(source='vacante.nombre_puesto', read_only=True)
    cliente_nombre = serializers.CharField(source='vacante.cliente', read_only=True)

    class Meta:
        model = Candidato
        fields = '__all__'

class EntrevistaInicialSerializer(serializers.ModelSerializer):
    class Meta:
        model = EntrevistaInicial
        fields = '__all__'

class EntrevistaProfundaSerializer(serializers.ModelSerializer):
    class Meta:
        model = EntrevistaProfunda
        fields = '__all__'

# Asegúrate de agregar ReporteCliente en los imports de arriba:
# from .models import (... ReporteCliente)

class ReporteClienteSerializer(serializers.ModelSerializer):
    candidato_nombre = serializers.CharField(source='candidato.nombre_completo', read_only=True)
    vacante_nombre = serializers.CharField(source='vacante.nombre_puesto', read_only=True)

    class Meta:
        model = ReporteCliente
        fields = '__all__'

class EstadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estado
        fields = '__all__'

class MunicipioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Municipio
        fields = '__all__'

class PropuestaClienteSerializer(serializers.ModelSerializer):
    vacante_nombre = serializers.CharField(source='vacante.nombre_puesto', read_only=True)
    cliente_nombre = serializers.CharField(source='vacante.cliente', read_only=True)

    class Meta:
        model = PropuestaCliente
        fields = '__all__'
