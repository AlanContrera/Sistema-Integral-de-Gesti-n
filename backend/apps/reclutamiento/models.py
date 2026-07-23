from django.db import models
from django.conf import settings


# ==========================================
# 0. CATÁLOGOS GEOGRÁFICOS
# ==========================================

class Estado(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    
    class Meta:
        verbose_name = 'Estado'
        verbose_name_plural = 'Estados'
        ordering = ['nombre']

    def __str__(self):
        return self.nombre

class Municipio(models.Model):
    estado = models.ForeignKey(Estado, on_delete=models.CASCADE, related_name='municipios')
    nombre = models.CharField(max_length=100)

    class Meta:
        verbose_name = 'Municipio'
        verbose_name_plural = 'Municipios'
        ordering = ['estado__nombre', 'nombre']

    def __str__(self):
        return f"{self.nombre}, {self.estado.nombre}"

# ==========================================
# 1. CATÁLOGOS Y PREGUNTAS DINÁMICAS
# ==========================================

class CategoriaPreguntas(models.Model):
    """Representa un puesto del catálogo (ej. 'Ingeniero de Implementación')"""
    nombre = models.CharField(max_length=200, unique=True)
    descripcion = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = 'Categoría de Puesto'
        verbose_name_plural = 'Categorías de Puestos'
        ordering = ['nombre']

    def __str__(self):
        return self.nombre


class PlantillaPregunta(models.Model):
    """Preguntas y rubros auto-cargados para cada categoría"""
    categoria = models.ForeignKey(CategoriaPreguntas, on_delete=models.CASCADE, related_name='preguntas')
    rubro = models.CharField(max_length=150, help_text="Ej: 'Herramientas / software', 'Competencias blandas'")
    pregunta = models.TextField()
    criterio_evaluacion = models.TextField(help_text="Lo que el entrevistador debe esperar en la respuesta")
    orden = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = 'Pregunta de Plantilla'
        verbose_name_plural = 'Preguntas de Plantillas'
        ordering = ['categoria', 'orden']

    def __str__(self):
        return f"[{self.categoria.nombre}] {self.rubro}"


# ==========================================
# 2. VACANTES
# ==========================================

class Vacante(models.Model):
    class Modalidad(models.TextChoices):
        PRESENCIAL = 'presencial', 'Presencial'
        HIBRIDO = 'hibrido', 'Híbrido'
        HOME_OFFICE = 'home_office', 'Home Office'

    class Estatus(models.TextChoices):
        BORRADOR = 'borrador', 'Borrador'
        ACTIVA = 'activa', 'Activa'
        CERRADA = 'cerrada', 'Cerrada'
        CANCELADA = 'cancelada', 'Cancelada'

    cliente = models.CharField(max_length=200)
    nombre_puesto = models.CharField(max_length=200)
    categoria_puesto = models.ForeignKey(CategoriaPreguntas, on_delete=models.SET_NULL, null=True, blank=True)
    
    sueldo_ofertado = models.DecimalField(max_digits=12, decimal_places=2)
    sueldo_mercado = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    
    estado_republica = models.ForeignKey(Estado, on_delete=models.SET_NULL, null=True, blank=True)
    municipio = models.ForeignKey(Municipio, on_delete=models.SET_NULL, null=True, blank=True)

    modalidad = models.CharField(max_length=20, choices=Modalidad.choices, default=Modalidad.PRESENCIAL)
    
    experiencia_minima = models.PositiveIntegerField(help_text="Años de experiencia requeridos")
    escolaridad_requerida = models.CharField(max_length=200)
    
    # Se usan JSONFields porque pueden ser varios elementos
    herramientas = models.JSONField(default=list, blank=True, help_text="Lista de herramientas requeridas")
    competencias_blandas = models.JSONField(default=list, blank=True)
    factores_exito = models.JSONField(default=list, blank=True)
    
    consultor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='vacantes_asignadas')
    estatus = models.CharField(max_length=20, choices=Estatus.choices, default=Estatus.BORRADOR)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Vacante'
        verbose_name_plural = 'Vacantes'
        ordering = ['-fecha_creacion']

    def __str__(self):
        return f"{self.nombre_puesto} - {self.cliente}"


# ==========================================
# 3. CANDIDATOS
# ==========================================

class Candidato(models.Model):
    class Estatus(models.TextChoices):
        NUEVO = 'nuevo', 'Nuevo'
        EN_PROCESO = 'en_proceso', 'En Proceso'
        VIABLE = 'viable', 'Viable'
        NO_VIABLE = 'no_viable', 'No Viable'
        ENVIADO_CLIENTE = 'enviado_cliente', 'Enviado al Cliente'

    vacante = models.ForeignKey(Vacante, on_delete=models.CASCADE, related_name='candidatos')
    nombre_completo = models.CharField(max_length=200)
    correo = models.EmailField()
    telefono = models.CharField(max_length=20)
    zona_ubicacion = models.CharField(max_length=200, help_text="Ej: Norte de la ciudad, a 30 mins")
    
    plataforma_origen = models.CharField(max_length=100, blank=True, null=True, help_text="Ej: LinkedIn, OCC, Referido")
    consultor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='candidatos_gestionados')
    
    estatus = models.CharField(max_length=20, choices=Estatus.choices, default=Estatus.NUEVO)
    fecha_registro = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Candidato'
        verbose_name_plural = 'Candidatos'
        ordering = ['-fecha_registro']

    def __str__(self):
        return f"{self.nombre_completo} ({self.vacante.nombre_puesto})"


# ==========================================
# 4. EVALUACIONES
# ==========================================

class EntrevistaInicial(models.Model):
    class Resultado(models.TextChoices):
        VIABLE = 'viable', 'Viable'
        NO_VIABLE = 'no_viable', 'No Viable'
        OBSERVACION = 'observacion', 'En Observación'

    candidato = models.OneToOneField(Candidato, on_delete=models.CASCADE, related_name='entrevista_inicial')
    
    respuestas = models.JSONField(default=dict, help_text="Respuestas del filtro inicial")
    resultado = models.CharField(max_length=20, choices=Resultado.choices)
    semaforo = models.CharField(max_length=20, choices=[('verde', 'Verde'), ('amarillo', 'Amarillo'), ('rojo', 'Rojo')], blank=True)
    
    agenda_entrevista_profunda = models.BooleanField(default=False)
    fecha_agenda = models.DateTimeField(null=True, blank=True)
    notas = models.TextField(blank=True, null=True)
    fecha = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Entrevista Inicial'
        verbose_name_plural = 'Entrevistas Iniciales'

    def __str__(self):
        return f"Inicial - {self.candidato.nombre_completo}"

class EntrevistaProfunda(models.Model):
    candidato = models.OneToOneField(Candidato, on_delete=models.CASCADE, related_name='entrevista_profunda')
    
    rubros = models.JSONField(default=list, help_text="JSON con rubros evaluados (nivel, puntaje, notas)")
    puntaje_total = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    porcentaje = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    semaforo = models.CharField(max_length=20, choices=[('verde', 'Verde'), ('amarillo', 'Amarillo'), ('rojo', 'Rojo')], blank=True)
    
    analisis_ejecutivo = models.TextField(blank=True, null=True)
    fortalezas = models.TextField(blank=True, null=True)
    brechas = models.TextField(blank=True, null=True)
    
    resultado_sugerido = models.CharField(max_length=200, blank=True, null=True)
    fecha = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Entrevista Profunda'
        verbose_name_plural = 'Entrevistas Profundas'

    def __str__(self):
        return f"Profunda - {self.candidato.nombre_completo}"

    def save(self, *args, **kwargs):
        # 1. Diccionario de valor por cada nivel
        valores_nivel = {
            'nulo': 0,
            'basico': 1,
            'intermedio': 2,
            'experto': 3
        }

        # 2. Inicializar contadores
        puntaje_actual = 0
        total_evaluados = 0
        tiene_nulos = False
        fortalezas_temp = []
        brechas_temp = []

        # 3. Recorrer las respuestas guardadas en el JSON
        if isinstance(self.rubros, list):
            for item in self.rubros:
                nivel = item.get('nivel', '').lower()
                rubro = item.get('rubro', 'Rubro no especificado')

                if nivel in valores_nivel:
                    puntaje = valores_nivel[nivel]
                    puntaje_actual += puntaje
                    total_evaluados += 1

                    if nivel == 'nulo':
                        tiene_nulos = True
                        brechas_temp.append(f"• Riesgo crítico en: {rubro} (Evaluación Nula)")
                    elif nivel == 'basico':
                        brechas_temp.append(f"• Brecha a desarrollar en: {rubro} (Nivel básico)")
                    elif nivel == 'experto':
                        fortalezas_temp.append(f"• Fuerte dominio en: {rubro}")

        # 4. Calcular porcentaje y semáforo (igualito que en el Excel)
        puntaje_maximo_posible = total_evaluados * 3

        if puntaje_maximo_posible > 0:
            self.puntaje_total = puntaje_actual
            self.porcentaje = (puntaje_actual / puntaje_maximo_posible) * 100
            
            if tiene_nulos or self.porcentaje < 65:
                self.semaforo = 'rojo'
                self.resultado_sugerido = "No enviar al cliente. Riesgos detectados."
            elif self.porcentaje >= 70:
                self.semaforo = 'verde'
                self.resultado_sugerido = "Viable para entrevista con el cliente."
            else:
                self.semaforo = 'amarillo'
                self.resultado_sugerido = "Viable con reservas. Validar brechas antes de enviar."
                
            if not self.fortalezas:
                self.fortalezas = "\n".join(fortalezas_temp) if fortalezas_temp else "• Sin fortalezas sobresalientes registradas."
            if not self.brechas:
                self.brechas = "\n".join(brechas_temp) if brechas_temp else "• Sin brechas críticas detectadas."

        super().save(*args, **kwargs)

# ==========================================
# 5. REPORTES
# ==========================================

class ReporteCliente(models.Model):
    candidato = models.ForeignKey(Candidato, on_delete=models.CASCADE, related_name='reportes_cliente')
    vacante = models.ForeignKey('Vacante', on_delete=models.CASCADE, related_name='reportes_enviados')
    
    fortalezas = models.TextField(help_text="Resumen ejecutivo de fortalezas")
    brechas = models.TextField(help_text="Resumen ejecutivo de brechas/riesgos")
    conclusion = models.TextField(help_text="Conclusión final para el cliente")
    siguiente_paso = models.CharField(max_length=200)
    
    pdf_generado = models.FileField(upload_to='reportes_candidatos/', blank=True, null=True)
    fecha_envio = models.DateTimeField(auto_now_add=True)
    enviado_por = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)

    class Meta:
        verbose_name = 'Reporte Cliente'
        verbose_name_plural = 'Reportes Cliente'

    def __str__(self):
        return f"Reporte: {self.candidato.nombre_completo} - {self.vacante.cliente}"

class PropuestaCliente(models.Model):
    vacante = models.OneToOneField('Vacante', on_delete=models.CASCADE, related_name='propuesta')
    objetivo_puesto = models.TextField()
    entregables_esperados = models.TextField()
    tiempo_estimado_cobertura = models.CharField(max_length=100, help_text="Ej: 2 a 3 semanas")
    
    pdf_generado = models.FileField(upload_to='propuestas_clientes/', blank=True, null=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Propuesta al Cliente'
        verbose_name_plural = 'Propuestas al Cliente'

    def __str__(self):
        return f"Propuesta Comercial: {self.vacante.nombre_puesto}"
