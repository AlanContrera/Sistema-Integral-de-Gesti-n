from django.http import HttpResponse
from rest_framework.decorators import action
from .utils_pdf import generar_pdf_reporte_cliente
from .utils_pdf import generar_pdf_propuesta_cliente
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import (
    CategoriaPreguntas, PlantillaPregunta, Vacante, 
    Candidato, EntrevistaInicial, EntrevistaProfunda, ReporteCliente, Estado, Municipio, PropuestaCliente
)
from .serializers import (
    CategoriaPreguntasSerializer, PlantillaPreguntaSerializer, VacanteSerializer, 
    CandidatoSerializer, EntrevistaInicialSerializer, EntrevistaProfundaSerializer, ReporteClienteSerializer, EstadoSerializer, MunicipioSerializer,
    PropuestaClienteSerializer,
)

class CategoriaPreguntasViewSet(viewsets.ModelViewSet):
    queryset = CategoriaPreguntas.objects.all()
    serializer_class = CategoriaPreguntasSerializer
    permission_classes = [IsAuthenticated]

class PlantillaPreguntaViewSet(viewsets.ModelViewSet):
    queryset = PlantillaPregunta.objects.all()
    serializer_class = PlantillaPreguntaSerializer
    permission_classes = [IsAuthenticated]

class VacanteViewSet(viewsets.ModelViewSet):
    queryset = Vacante.objects.all()
    serializer_class = VacanteSerializer
    permission_classes = [IsAuthenticated]

class CandidatoViewSet(viewsets.ModelViewSet):
    queryset = Candidato.objects.all()
    serializer_class = CandidatoSerializer
    permission_classes = [IsAuthenticated]
    
    # Filtrar candidatos por vacante si React lo pide: /api/candidatos/?vacante=1
    def get_queryset(self):
        queryset = Candidato.objects.all()
        vacante_id = self.request.query_params.get('vacante', None)
        if vacante_id is not None:
            queryset = queryset.filter(vacante_id=vacante_id)
        return queryset

class EntrevistaInicialViewSet(viewsets.ModelViewSet):
    queryset = EntrevistaInicial.objects.all()
    serializer_class = EntrevistaInicialSerializer
    permission_classes = [IsAuthenticated]

class EntrevistaProfundaViewSet(viewsets.ModelViewSet):
    queryset = EntrevistaProfunda.objects.all()
    serializer_class = EntrevistaProfundaSerializer
    permission_classes = [IsAuthenticated]

class ReporteClienteViewSet(viewsets.ModelViewSet):
    queryset = ReporteCliente.objects.all()
    serializer_class = ReporteClienteSerializer
    permission_classes = [IsAuthenticated]

    # ¡Esta es la magia! Crea la ruta /api/reclutamiento/reportes/1/descargar_pdf/
    @action(detail=True, methods=['get'])
    def descargar_pdf(self, request, pk=None):
        reporte = self.get_object()
        buffer = generar_pdf_reporte_cliente(reporte)
        
        # Le decimos al navegador que esto es un archivo PDF descargable
        response = HttpResponse(buffer, content_type='application/pdf')
        nombre_archivo = f"Reporte_{reporte.candidato.nombre_completo.replace(' ', '_')}.pdf"
        response['Content-Disposition'] = f'attachment; filename="{nombre_archivo}"'
        
        return response

class EstadoViewSet(viewsets.ModelViewSet):
    queryset = Estado.objects.all()
    serializer_class = EstadoSerializer
    permission_classes = [IsAuthenticated]

class MunicipioViewSet(viewsets.ModelViewSet):
    queryset = Municipio.objects.all()
    serializer_class = MunicipioSerializer
    permission_classes = [IsAuthenticated]
    
    # Esto servirá para que React filtre los municipios por estado (ej: /api/municipios/?estado=5)
    def get_queryset(self):
        queryset = Municipio.objects.all()
        estado_id = self.request.query_params.get('estado', None)
        if estado_id is not None:
            queryset = queryset.filter(estado_id=estado_id)
        return queryset

class PropuestaClienteViewSet(viewsets.ModelViewSet):
    queryset = PropuestaCliente.objects.all()
    serializer_class = PropuestaClienteSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['get'])
    def descargar_pdf(self, request, pk=None):
        propuesta = self.get_object()
        buffer = generar_pdf_propuesta_cliente(propuesta)
        
        response = HttpResponse(buffer, content_type='application/pdf')
        nombre_archivo = f"Propuesta_{propuesta.vacante.cliente.replace(' ', '_')}.pdf"
        response['Content-Disposition'] = f'attachment; filename="{nombre_archivo}"'
        return response
