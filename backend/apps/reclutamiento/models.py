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
    factor_ubicacion = models.DecimalField(max_digits=5, decimal_places=3, default=1.000, help_text="Multiplicador salarial por zona")

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
    sueldo_promedio_base = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    giro_industria = models.CharField(max_length=150, blank=True, null=True, help_text="Giro o industria (ej. Industrial, Construcción, TI)")


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

    # === SECCIÓN 1: DATOS DEL CLIENTE ===
    cliente = models.CharField(max_length=200)
    giro_industria = models.CharField(max_length=200, blank=True)
    contacto_responsable = models.CharField(max_length=200, blank=True)
    puesto_contacto = models.CharField(max_length=200, blank=True)
    telefono_contacto = models.CharField(max_length=50, blank=True)
    correo_contacto = models.EmailField(blank=True)
    razon_social = models.CharField(max_length=200, blank=True)
    sitio_web = models.URLField(blank=True)
    estado_republica = models.ForeignKey(Estado, on_delete=models.SET_NULL, null=True, blank=True)
    municipio = models.ForeignKey(Municipio, on_delete=models.SET_NULL, null=True, blank=True)

    # === SECCIÓN 2: DATOS GENERALES DEL PUESTO ===
    nombre_puesto = models.CharField(max_length=200)
    categoria_puesto = models.ForeignKey(CategoriaPreguntas, on_delete=models.SET_NULL, null=True, blank=True)
    area_departamento = models.CharField(max_length=200, blank=True)
    jefe_directo = models.CharField(max_length=200, blank=True)
    numero_vacantes = models.PositiveIntegerField(default=1)

    class Motivo(models.TextChoices):
        NUEVA = 'nueva', 'Nueva'
        REEMPLAZO = 'reemplazo', 'Reemplazo'
        TEMPORAL = 'temporal', 'Temporal'
    motivo_vacante = models.CharField(max_length=20, choices=Motivo.choices, default=Motivo.NUEVA)
    fecha_ideal_ingreso = models.DateField(null=True, blank=True)
    
    class Nivel(models.TextChoices):
        OPERATIVO = 'operativo', 'Operativo'
        ADMINISTRATIVO = 'administrativo', 'Administrativo'
        MANDO_MEDIO = 'mando_medio', 'Mando Medio'
        DIRECTIVO = 'directivo', 'Directivo'
    nivel_puesto = models.CharField(max_length=30, choices=Nivel.choices, default=Nivel.OPERATIVO)
    
    class TipoContratacion(models.TextChoices):
        PLANTA = 'planta', 'Planta'
        TEMPORAL = 'temporal', 'Temporal'
        PROYECTO = 'proyecto', 'Proyecto'
    tipo_contratacion = models.CharField(max_length=30, choices=TipoContratacion.choices, default=TipoContratacion.PLANTA)
    
    sueldo_ofertado = models.DecimalField(max_digits=12, decimal_places=2)
    sueldo_mercado = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    
    class Periodicidad(models.TextChoices):
        MENSUAL = 'mensual', 'Mensual'
        SEMANAL = 'semanal', 'Semanal'
        QUINCENAL = 'quincenal', 'Quincenal'
    periodicidad_pago = models.CharField(max_length=20, choices=Periodicidad.choices, default=Periodicidad.MENSUAL)
    
    class Jornada(models.TextChoices):
        COMPLETA = 'completa', 'Completa'
        MEDIO_TIEMPO = 'medio_tiempo', 'Medio Tiempo'
        FIN_SEMANA = 'fin_semana', 'Fin de Semana'
    jornada = models.CharField(max_length=30, choices=Jornada.choices, default=Jornada.COMPLETA)
    
    class Prestaciones(models.TextChoices):
        LEY = 'ley', 'Ley'
        SUPERIORES = 'superiores', 'Superiores a las de la ley'
        HONORARIOS = 'honorarios', 'Honorarios'
        SERVICIOS = 'servicios_profesionales', 'Servicios Profesionales'
    prestaciones = models.CharField(max_length=50, choices=Prestaciones.choices, default=Prestaciones.LEY)
    
    pagos_adicionales = models.CharField(max_length=200, blank=True)
    valor_estimado_mensual = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    # === SECCIÓN 3 Y 4: FUNCIONES Y RESPONSABILIDADES ===
    funciones_diarias_sugeridas = models.TextField(blank=True)
    funciones_diarias_cliente = models.TextField(blank=True)
    responsabilidades_sugeridas = models.TextField(blank=True)
    responsabilidades_cliente = models.TextField(blank=True)
    kpis = models.TextField(blank=True)

    # === SECCIÓN 5: PERFIL REQUERIDO ===
    escolaridad_requerida = models.CharField(max_length=200, blank=True)
    carrera_especialidad = models.CharField(max_length=200, blank=True)
    experiencia_minima = models.PositiveIntegerField(help_text="Años de experiencia requeridos", default=0)
    experiencia_deseable = models.CharField(max_length=200, blank=True)
    edad_deseada = models.CharField(max_length=100, blank=True)
    idioma_requerido = models.CharField(max_length=100, blank=True)
    herramientas = models.JSONField(default=list, blank=True, help_text="Lista de herramientas requeridas")
    
    class Certificacion(models.TextChoices):
        TITULO = 'titulo', 'Título'
        TITULO_CEDULA = 'titulo_cedula', 'Título y Cédula'
        TRAMITE_TITULO = 'tramite_titulo', 'En trámite Título'
        TRAMITE_CEDULA = 'tramite_cedula', 'En trámite Cédula'
    certificaciones = models.CharField(max_length=50, choices=Certificacion.choices, blank=True)
    
    class Viaje(models.TextChoices):
        PENDIENTE = 'pendiente', 'Pendiente'
        NO_DISPONIBLE = 'no_disponible', 'No disponible'
        OCASIONAL = 'ocasional', 'Disponibilidad ocasional'
        NACIONAL = 'nacional', 'Disponibilidad nacional'
        INTERNACIONAL = 'internacional', 'Disponibilidad internacional'
        TOTAL = 'total', 'Disponibilidad total'
    disponibilidad_viajar = models.CharField(max_length=50, choices=Viaje.choices, default=Viaje.PENDIENTE)
    disponibilidad_rolar_turnos = models.CharField(max_length=200, blank=True)

    # === SECCIÓN 6: COMPETENCIAS ===
    competencias_tecnicas_sugeridas = models.TextField(blank=True)
    competencias_tecnicas_cliente = models.TextField(blank=True)
    competencias_blandas_sugeridas = models.TextField(blank=True)
    competencias_blandas_cliente = models.TextField(blank=True)
    factores_exito_sugeridos = models.TextField(blank=True)
    factores_exito_cliente = models.TextField(blank=True)

    # === SECCIÓN 7: CONDICIONES LABORALES ===
    modalidad = models.CharField(max_length=20, choices=Modalidad.choices, default=Modalidad.PRESENCIAL)
    horario = models.CharField(max_length=200, blank=True)
    herramientas_proporcionadas = models.CharField(max_length=200, blank=True)
    
    # === SECCIÓN 8, 9 Y 10: PROCESO, DESCARTE, ACUERDOS ===
    entrevistas_requeridas = models.CharField(max_length=200, blank=True)
    evaluaciones_requeridas = models.CharField(max_length=200, blank=True)
    documentos_necesarios = models.CharField(max_length=200, blank=True)
    tiempo_cobertura = models.CharField(max_length=200, blank=True)
    quien_decide = models.CharField(max_length=200, blank=True)
    numero_candidatos_esperados = models.PositiveIntegerField(default=3)
    
    perfiles_no_aceptados = models.TextField(blank=True)
    experiencia_no_valida = models.TextField(blank=True)
    zonas_no_viables = models.TextField(blank=True)
    pretension_salarial_max = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    
    urgencia_vacante = models.CharField(max_length=200, blank=True)
    class SN(models.TextChoices):
        SI = 'si', 'Sí'
        NO = 'no', 'No'
    exclusividad = models.CharField(max_length=10, choices=SN.choices, default=SN.NO)
    honorarios_acordados = models.CharField(max_length=200, blank=True)
    class Garantia(models.TextChoices):
        DIAS_7 = '7_dias', '7 días'
        DIAS_15 = '15_dias', '15 días'
        DIAS_30 = '30_dias', '30 días'
        DIAS_60 = '60_dias', '60 días'
        DIAS_90 = '90_dias', '90 días'
    garantia = models.CharField(max_length=50, choices=Garantia.choices, blank=True)
    fecha_compromiso_terna = models.DateField(null=True, blank=True)

    consultor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='vacantes_asignadas')
    creado_por = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='vacantes_creadas')
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

    def save(self, *args, **kwargs):
        # Lógica de semáforo de Entrevista Inicial según tu Excel Original (10 Preguntas)
        if self.respuestas:
            positivas = 0
            riesgos = 0
            
            # Los 4 dropdowns de "Factores Críticos"
            factores_criticos = ['f_escolaridad', 'f_experiencia', 'f_carrera', 'f_herramientas']
            cumplen_criticos = True
            
            for f in factores_criticos:
                val = str(self.respuestas.get(f, '')).lower()
                if val == 'cumple':
                    positivas += 1
                elif val == 'no cumple':
                    riesgos += 1
                    cumplen_criticos = False
                    
            # Pregunta 8 (Traslado - texto libre) evalúa si el reclutador escribió "si"
            traslado = str(self.respuestas.get('p8', '')).lower()
            if 'si' in traslado or 'sí' in traslado:
                positivas += 1
            elif 'no' in traslado or 'lejos' in traslado:
                riesgos += 1
                
            # Pregunta 9 (Sueldo - texto libre) extrae el número y lo compara
            expectativa_str = str(self.respuestas.get('p9', '0')).replace('$', '').replace(',', '')
            import re
            numeros = re.findall(r'\d+', expectativa_str)
            if numeros:
                try:
                    expectativa = float(numeros[0])
                    oferta_max = float(self.candidato.vacante.sueldo_ofertado) * 1.10
                    if expectativa <= oferta_max:
                        positivas += 1
                    else:
                        riesgos += 1
                except:
                    pass
                    
            # Pregunta 10 (Motivadores - texto libre) da punto si no está vacío
            motivacion = str(self.respuestas.get('p10', '')).strip()
            if len(motivacion) > 0:
                positivas += 1
                
            # Calcular Semáforo
            if riesgos >= 1 or not cumplen_criticos:
                self.semaforo = 'rojo'
                self.resultado = self.Resultado.NO_VIABLE
                self.notas = f"Alerta Roja: El candidato no cumple 1 o más factores críticos (Escolaridad, Experiencia, Carrera, Herramientas, Sueldo o Traslado)."
            elif positivas >= 5:
                self.semaforo = 'verde'
                self.resultado = self.Resultado.VIABLE
                self.notas = "Candidato 100% Viable. Cumple los 4 factores críticos y las condiciones de la vacante."
            else:
                self.semaforo = 'amarillo'
                self.resultado = self.Resultado.OBSERVACION
                self.notas = "En duda: Hay datos faltantes o información ambigua. Validar con el reclutador."
                
        # (models.py - Al final del método save de EntrevistaInicial)
        super().save(*args, **kwargs)

        # ---------------------------------------------------------
        # NUEVO: Actualización Automática de Estatus del Candidato
        # ---------------------------------------------------------
        candidato = self.candidato
        # Si acabamos de hacer la entrevista inicial, el candidato ya está "En Proceso"
        if candidato.estatus == Candidato.Estatus.NUEVO:
            candidato.estatus = Candidato.Estatus.EN_PROCESO
            candidato.save()

class PreguntaEntrevistaInicial(models.Model):
    clave = models.CharField(max_length=20, unique=True) # Aquí va f_escolaridad, p8, p9
    rubro = models.CharField(max_length=100) # Ej: Sueldo, Traslado
    pregunta = models.TextField() # El texto editable



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
    
    # === AGENDA ENTREVISTA CLIENTE ===
    agendar_cliente = models.BooleanField(default=False)
    fecha_entrevista_cliente = models.DateField(null=True, blank=True)
    hora_entrevista_cliente = models.TimeField(null=True, blank=True)
    modalidad_cliente = models.CharField(max_length=100, blank=True, null=True)
    detalles_agenda_cliente = models.TextField(blank=True, null=True)

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

        # (models.py - Al final del método save de EntrevistaProfunda)
        super().save(*args, **kwargs)

        # ---------------------------------------------------------
        # NUEVO: Actualización Automática de Estatus del Candidato
        # ---------------------------------------------------------
        candidato = self.candidato
        
        # OJO: Cambiamos "dictamen" por "semaforo" que es el campo correcto
        if self.agendar_cliente:
            candidato.estatus = Candidato.Estatus.ENVIADO_CLIENTE
            candidato.save()
        elif self.semaforo == 'verde' or self.semaforo == 'amarillo':
            # Pasa a Viable (si no lo han marcado ya manualmente como Enviado)
            if candidato.estatus not in [Candidato.Estatus.ENVIADO_CLIENTE]:
                candidato.estatus = Candidato.Estatus.VIABLE
                candidato.save()
        elif self.semaforo == 'rojo':
            # Si el semaforo es ROJO en la profunda, queda descartado
            candidato.estatus = Candidato.Estatus.NO_VIABLE
            candidato.save()


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
