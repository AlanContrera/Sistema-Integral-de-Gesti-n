from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    GenerarCotizacionView,
    GestorMembretadasView,
    EmpresaEmisoraViewSet,
    ClienteViewSet,
    enviar_cotizacion_email,
    AnalizarExcelView,
    descargar_excel_prefactura_view,
    enviar_prefactura_web_view,
    preview_cotizacion_pdf_view,
    solicitar_factura_monterrey_view, 
    generar_cotizacion_view,
    operaciones_pendientes_view,
    aprobar_operacion_view           
)

router = DefaultRouter()
router.register(r'empresas-emisoras', EmpresaEmisoraViewSet)
router.register(r'clientes', ClienteViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('generar/', GenerarCotizacionView.as_view()),
    path('membretadas/', GestorMembretadasView.as_view()),
    path('enviar-cotizacion/', enviar_cotizacion_email),
    path('analizar-excel/', AnalizarExcelView.as_view()),
    path('descargar-excel-prefactura/', descargar_excel_prefactura_view),
    path('enviar-prefactura-web/', enviar_prefactura_web_view),
    path('preview-cotizacion-pdf/', preview_cotizacion_pdf_view), 
    path('solicitar-factura-monterrey/', solicitar_factura_monterrey_view), 
    path('generar-cotizacion/', generar_cotizacion_view),
    path('operaciones-pendientes/', operaciones_pendientes_view),
    path('aprobar-operacion/<int:operacion_id>/', aprobar_operacion_view),                   
]
