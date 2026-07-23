import os
import openpyxl
from django.core.management.base import BaseCommand
from apps.reclutamiento.models import CategoriaPreguntas, PlantillaPregunta
from django.conf import settings

class Command(BaseCommand):
    help = 'Importa el catálogo de puestos desde el Excel a la base de datos'

    def handle(self, *args, **kwargs):
        # Ruta donde está tu Excel
        ruta_excel = os.path.join(settings.BASE_DIR, 'media', 'IACI INGENIERO DE IMPLEMENTACION Y PROYECTO RECLUTAMIENTO BUENO edITABLE.xlsx')
        
        if not os.path.exists(ruta_excel):
            self.stdout.write(self.style.ERROR(f'No se encontró el archivo en: {ruta_excel}'))
            return

        self.stdout.write('Leyendo el Excel (esto puede tardar unos segundos)...')
        wb = openpyxl.load_workbook(ruta_excel, data_only=True)
        
        if 'Catálogos' not in wb.sheetnames:
            self.stdout.write(self.style.ERROR('No se encontró la pestaña "Catálogos" en el Excel.'))
            return
            
        ws = wb['Catálogos']
        
        categorias_creadas = 0
        preguntas_creadas = 0

        # Recorremos la hoja desde la fila 2 (la 1 son los encabezados)
        for row in ws.iter_rows(min_row=2, max_col=10, values_only=True):
            nombre_puesto = row[0]  # Columna A (Nombre del puesto)
            if not nombre_puesto:
                continue
                
            nombre_puesto = str(nombre_puesto).strip()
            
            # Extraemos la información de las demás columnas
            funciones = row[2]           # Columna C
            responsabilidades = row[3]   # Columna D
            comp_tecnicas = row[4]       # Columna E
            comp_blandas = row[5]        # Columna F
            kpis = row[6]                # Columna G

            # 1. Crear o buscar la categoría en la base de datos
            categoria, created = CategoriaPreguntas.objects.get_or_create(
                nombre=nombre_puesto,
                defaults={'descripcion': 'Importado automáticamente desde Excel'}
            )
            
            if created:
                categorias_creadas += 1
            else:
                # Si el puesto ya existía, borramos sus preguntas para actualizarlas sin duplicar
                categoria.preguntas.all().delete()
                
            # 2. Armar los 5 rubros base como si fueran "preguntas" a evaluar
            rubros_a_crear = []
            
            if funciones:
                rubros_a_crear.append(('Funciones principales', funciones, 'Debe explicar experiencia práctica en estas funciones.', 1))
            if responsabilidades:
                rubros_a_crear.append(('Responsabilidades críticas', responsabilidades, 'Debe demostrar capacidad de hacerse cargo y dar resultados.', 2))
            if comp_tecnicas:
                rubros_a_crear.append(('Competencias técnicas', comp_tecnicas, 'Debe explicar uso práctico, nivel de dominio y casos reales.', 3))
            if comp_blandas:
                rubros_a_crear.append(('Competencias blandas', comp_blandas, 'Debe dar un ejemplo tipo STAR: situación, acción y resultado.', 4))
            if kpis:
                rubros_a_crear.append(('Factores clave de éxito / KPIs', kpis, 'Debe mostrar evidencia previa e indicadores de éxito.', 5))
                
            # 3. Guardar las preguntas en la base de datos
            for rubro, pregunta, criterio, orden in rubros_a_crear:
                PlantillaPregunta.objects.create(
                    categoria=categoria,
                    rubro=rubro,
                    pregunta=str(pregunta).strip(),
                    criterio_evaluacion=criterio,
                    orden=orden
                )
                preguntas_creadas += 1
                
        self.stdout.write(self.style.SUCCESS(f'¡Éxito! Se importaron {categorias_creadas} puestos y se generaron {preguntas_creadas} preguntas dinámicas.'))
