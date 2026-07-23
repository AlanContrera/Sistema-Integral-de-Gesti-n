from django.contrib import admin
from .models import (
    CategoriaPreguntas, PlantillaPregunta, Vacante, Candidato, 
    EntrevistaInicial, EntrevistaProfunda, ReporteCliente,
    Estado, Municipio, PropuestaCliente
)


class PlantillaPreguntaInline(admin.TabularInline):
    model = PlantillaPregunta
    extra = 1

@admin.register(CategoriaPreguntas)
class CategoriaPreguntasAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'descripcion')
    search_fields = ('nombre',)
    inlines = [PlantillaPreguntaInline]  # Esto te permite agregar las preguntas en la misma pantalla del Puesto

@admin.register(Vacante)
class VacanteAdmin(admin.ModelAdmin):
    list_display = ('nombre_puesto', 'cliente', 'categoria_puesto', 'estatus', 'fecha_creacion')
    list_filter = ('estatus', 'modalidad', 'estado_republica', 'cliente')
    search_fields = ('nombre_puesto', 'cliente')
    list_editable = ('estatus',)  # Permite cambiar el estatus rápido desde la lista

@admin.register(Candidato)
class CandidatoAdmin(admin.ModelAdmin):
    list_display = ('nombre_completo', 'vacante', 'estatus', 'fecha_registro')
    list_filter = ('estatus', 'vacante__cliente')
    search_fields = ('nombre_completo', 'correo')

@admin.register(EntrevistaInicial)
class EntrevistaInicialAdmin(admin.ModelAdmin):
    list_display = ('candidato', 'resultado', 'semaforo', 'agenda_entrevista_profunda')
    list_filter = ('resultado', 'semaforo', 'agenda_entrevista_profunda')

@admin.register(EntrevistaProfunda)
class EntrevistaProfundaAdmin(admin.ModelAdmin):
    list_display = ('candidato', 'porcentaje', 'semaforo')
    list_filter = ('semaforo',)

@admin.register(ReporteCliente)
class ReporteClienteAdmin(admin.ModelAdmin):
    list_display = ('candidato', 'vacante', 'fecha_envio')
    list_filter = ('vacante__cliente',)

@admin.register(Estado)
class EstadoAdmin(admin.ModelAdmin):
    search_fields = ('nombre',)

@admin.register(Municipio)
class MunicipioAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'estado')
    list_filter = ('estado',)
    search_fields = ('nombre',)

@admin.register(PropuestaCliente)
class PropuestaClienteAdmin(admin.ModelAdmin):
    list_display = ('vacante', 'tiempo_estimado_cobertura', 'fecha_creacion')
