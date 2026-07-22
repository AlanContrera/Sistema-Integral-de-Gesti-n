from rest_framework.routers import DefaultRouter
from .views import CorreoProcesadoViewSet, ComprobanteViewSet, FacturaViewSet, CatalogosViewSet

router = DefaultRouter()
router.register(r'correos', CorreoProcesadoViewSet, basename='correo')
router.register(r'comprobantes', ComprobanteViewSet, basename='comprobante')
router.register(r'facturas', FacturaViewSet, basename='factura')
router.register(r'catalogos', CatalogosViewSet, basename='catalogo')

urlpatterns = router.urls
