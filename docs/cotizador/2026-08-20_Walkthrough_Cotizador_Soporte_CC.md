# Walkthrough: Soporte para Correos CC y Carga Masiva (Cotizador)

**Fecha:** 2026-08-20
**Módulo:** Cotizador Inteligente y Mini-CRM
**Objetivo:** Adaptar el modelo de base de datos para soportar el envío de copias a múltiples correos (CC) por cliente, actualizar la tarea de Celery, y subir masivamente un catálogo desde un archivo Excel sin encabezados.

---

## 1. Modificación de Arquitectura de Datos (`models.py`)

Para poder guardar múltiples correos adicionales sin crear tablas relacionales innecesarias (manteniendo la eficiencia), se agregó un campo de texto en el modelo `Cliente`.

**Cambios realizados:**
- Se inyectó el campo `correos_cc = models.CharField(max_length=500, blank=True, null=True)`.
- Este campo almacena los correos secundarios separados por coma (ej. `uno@mail.com, dos@mail.com`).
- Se ejecutaron las migraciones (`makemigrations` y `migrate`) para impactar a la base de datos (SQLite). Durante la migración, se proporcionó un valor por defecto ('Sin especificar') a los campos heredados para mantener la consistencia en registros viejos.

> [!NOTE]
> **Decisión de Diseño:** Se eligió un `CharField` con separación por comas en lugar de un `ArrayField` porque el proyecto utiliza SQLite (que no soporta arreglos nativos como PostgreSQL) y porque es muchísimo más fácil de parsear desde un archivo Excel plano.

---

## 2. Lógica de Envío Asíncrono (`tasks.py`)

Se actualizó la tarea `@shared_task` encargada de armar el correo SMTP para que inyecte los correos CC tanto en los metadatos visuales del correo como en los destinatarios reales del servidor.

**Correcciones y Mejoras:**
1. **Soporte CC Visual:** Se agregó `msg['Cc'] = cliente.correos_cc` para que en la bandeja de entrada del receptor aparezcan las personas copiadas.
2. **Envío Real SMTP:** Se construyó una lista dinámica `to_addrs`. Se parsea el texto separando por comas y limpiando espacios en blanco (`c.strip()`). 
3. **Corrección de Bug:** Se detectó y corrigió un error en el diccionario de contexto de la plantilla HTML. El código antiguo solicitaba `cliente.nombre`, pero el modelo solo define `cliente.empresa`. Se corrigió para evitar una caída del Worker al momento de mandar el correo.

```python
# Fragmento Clave del Procesamiento de Destinatarios
to_addrs = [cliente.correo]
if cliente.correos_cc:
    # Separa por coma y limpia posibles espacios generados por Excel
    to_addrs.extend([c.strip() for c in cliente.correos_cc.split(',') if c.strip()])
    
server.send_message(msg, to_addrs=to_addrs)
```

---

## 3. Carga Masiva (Seed) Inteligente (`seed_clientes_excel.py`)

Se desarrolló un script para leer un archivo Excel (`.xlsx`) sin encabezados (data cruda en la fila 0) utilizando `pandas`.

**Características del Script:**
- Configura el entorno usando `config.settings.development` para poder conectarse a la base de datos fuera de Django.
- Lee los datos ignorando la falta de fila de títulos (`header=None`).
- Procesa espacios nulos y `NaN` que típicamente rompen las cargas masivas.
- Implementa `bulk_create(ignore_conflicts=True)` para insertar los registros a una velocidad 10x mayor en la base de datos sin lanzar excepciones por posibles duplicados.

> [!TIP]
> **Integración con Obsidian:** Copia este archivo dentro de tu carpeta `docs/cotizador/` en el repositorio, y muévelo a tu Segundo Cerebro (Obsidian) para tener la referencia técnica a mano cuando construyamos el Módulo Comercial.
