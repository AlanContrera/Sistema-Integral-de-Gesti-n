from django.urls import path, include
from rest_framework.routers import DefaultRouter
# IMPORTAR AnalizarExcelView
from .views import GenerarCotizacionView, GestorMembretadasView, EmpresaEmisoraViewSet, ClienteViewSet, enviar_cotizacion_email, AnalizarExcelView

router = DefaultRouter()
router.register(r'empresas-emisoras', EmpresaEmisoraViewSet)
router.register(r'clientes', ClienteViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('generar/', GenerarCotizacionView.as_view()),
    path('membretadas/', GestorMembretadasView.as_view()),
    path('enviar-cotizacion/', enviar_cotizacion_email),
    # RUTA PARA EXTRAER DATOS
    path('analizar-excel/', AnalizarExcelView.as_view()),
]
