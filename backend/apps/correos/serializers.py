from dataclasses import fields
from rest_framework import serializers
from .models import CorreoProcesado, Comprobante, Factura, Liquidacion




class ComprobanteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comprobante
        fields = '__all__'

class FacturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Factura
        fields = '__all__'

class FacturaSerializer(serializers.ModelSerializer):
    # Traemos el nombre del cliente desde el correo padre
    cliente_nombre = serializers.CharField(source='correo.cliente_nombre', read_only=True)

    # Mandar el historial de pagos (abonos) al frontend
    abonos = ComprobanteSerializer(many=True, read_only=True)
    
    class Meta:
        model = Factura
        fields = '__all__'


class CorreoRespuestaSerializer(serializers.ModelSerializer):
    comprobantes = ComprobanteSerializer(many=True, read_only=True)
    class Meta:
        model = CorreoProcesado
        fields = ['id', 'remitente', 'fecha_recibido', 'cuerpo', 'cuerpo_limpio', 'comprobantes']

class LiquidacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Liquidacion
        fields = '__all__'

class CorreoProcesadoSerializer(serializers.ModelSerializer):

    liquidacion = LiquidacionSerializer(read_only=True)

    comprobantes = ComprobanteSerializer(many=True, read_only=True)
    respuestas = CorreoRespuestaSerializer(many=True, read_only=True)

    class Meta:
        model = CorreoProcesado
        fields = [
            'id', 'uid', 'message_id', 'parent', 'remitente', 'asunto',
            'fecha_recibido', 'estado', 'tipo_ingreso', 'fecha_procesado',
            'cuerpo', 'cuerpo_limpio', 'comprobantes', 'respuestas', 'liquidacion', 'cliente_nombre'
        ]

