from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import CorreoProcesado, Comprobante, Factura
from .serializers import CorreoProcesadoSerializer, ComprobanteSerializer, FacturaSerializer

class ComprobanteViewSet(viewsets.ModelViewSet):
    queryset = Comprobante.objects.all()
    serializer_class = ComprobanteSerializer
    filter_backends = [filters.OrderingFilter]
    ordering = ['-id']

class FacturaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Factura.objects.all()
    serializer_class = FacturaSerializer
    filter_backends =[filters.OrderingFilter]
    ordering = ['-id']

class CorreoProcesadoViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = CorreoProcesado.objects.filter(parent__isnull=True)
    serializer_class = CorreoProcesadoSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['remitente', 'asunto']
    ordering_fields = ['fecha_recibido', 'estado']
    ordering = ['-fecha_recibido']

    @action(detail=False, methods=['get'], url_path='por-estado/(?P<estado>[^/.]+)')
    def por_estado(self, request, estado=None):
        correos = self.queryset.filter(estado=estado)
        serializer = self.get_serializer(correos, many=True)
        return Response(serializer.data)

import csv
import os

class CatalogosViewSet(viewsets.ViewSet):
    def list(self, request):
        empresas = set()
        bancos = set()
        catalogo_path = os.path.join(os.path.dirname(__file__), 'catalogo.csv')
        if os.path.exists(catalogo_path):
            with open(catalogo_path, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    if row.get('razon_social'):
                        empresas.add(row['razon_social'].strip())
                    if row.get('banco'):
                        bancos.add(row['banco'].strip())
        return Response({
            'empresas': sorted(list(empresas)),
            'bancos': sorted(list(bancos))
        })
