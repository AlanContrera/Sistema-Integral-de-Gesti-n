from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoriaPreguntasViewSet, PlantillaPreguntaViewSet, VacanteViewSet, 
    CandidatoViewSet, EntrevistaInicialViewSet, EntrevistaProfundaViewSet, ReporteClienteViewSet, EstadoViewSet,
    MunicipioViewSet, PropuestaClienteViewSet
)

router = DefaultRouter()
router.register(r'categorias', CategoriaPreguntasViewSet)
router.register(r'preguntas', PlantillaPreguntaViewSet)
router.register(r'vacantes', VacanteViewSet)
router.register(r'candidatos', CandidatoViewSet)
router.register(r'entrevistas-iniciales', EntrevistaInicialViewSet)
router.register(r'entrevistas-profundas', EntrevistaProfundaViewSet)
router.register(r'estados', EstadoViewSet)
router.register(r'municipios', MunicipioViewSet)
router.register(r'propuestas', PropuestaClienteViewSet)



router.register(r'reportes', ReporteClienteViewSet)


urlpatterns = [
    path('', include(router.urls)),
]
