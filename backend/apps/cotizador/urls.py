from django.urls import path
from .views import GenerarCotizacionView, GestorMembretadasView

urlpatterns = [
    path('generar/', GenerarCotizacionView.as_view()),
    path('membretadas/', GestorMembretadasView.as_view()),
]