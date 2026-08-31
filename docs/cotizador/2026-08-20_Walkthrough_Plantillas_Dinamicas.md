# Walkthrough: Plantillas de Correo Dinámicas (Unificadas)

**Fecha:** 2026-08-20
**Módulo:** Cotizador Inteligente y Mini-CRM
**Objetivo:** Eliminar la necesidad de tener múltiples archivos `.html` para las cotizaciones, centralizando el diseño en una **plantilla maestra unificada** y manejando el texto (Asunto y Cuerpo del correo) de forma dinámica desde la base de datos para cada empresa emisora.

---

## 1. Modificación de Arquitectura de Datos (`models.py`)

Se agregaron dos nuevos campos a la tabla `EmpresaEmisora` para guardar la configuración de texto específica de cada compañía.

**Cambios realizados:**
- Se inyectó `asunto_cotizacion` (CharField) para personalizar el encabezado del correo.
- Se inyectó `cuerpo_cotizacion` (TextField) para personalizar la redacción exacta que pide cada empresa.
- Se usó `blank=True, null=True` para evitar conflictos en migraciones con registros viejos.
- Se registraron en `admin.py` para que el administrador del sistema pueda editar los textos de bienvenida sin tocar el código fuente.

---

## 2. Inyección Dinámica en la Tarea (`tasks.py`)

La función asíncrona de Celery (`enviar_cotizacion_task`) se actualizó para leer estos nuevos campos y armar el correo sobre la marcha.

**Lógica Implementada:**
1. **Asunto Dinámico:** Se agregó una validación para usar el `asunto_cotizacion` de la base de datos, y si está vacío, usa uno de respaldo.
   `msg['Subject'] = empresa.asunto_cotizacion if empresa.asunto_cotizacion else f"Propuesta Comercial - {empresa.nombre_empresa}"`
2. **Contexto de Plantilla:** Se pasa el texto extraído al motor de renderizado bajo la variable `'cuerpo_correo'`.

---

## 3. Plantilla Maestra Unificada (`envio_cotizacion.html`)

Se creó un solo archivo HTML con un diseño corporativo limpio (fondo gris neutro, contenedor blanco tipo tarjeta). 

**Decisiones de Diseño:**
- **Inyección Pura:** En el contenedor del mensaje, se eliminó cualquier saludo codificado (hardcoded) y simplemente se imprime `{{ cuerpo_correo }}`.
- **Formato Respetado:** Se usó la propiedad CSS `white-space: pre-wrap;` en el párrafo. Esto asegura que si el usuario da múltiples espacios o saltos de línea (Enters) en el campo TextField de Django Admin, el correo respetará ese espaciado visual sin necesidad de meter etiquetas `<br>` manualmente.

---

## 4. Carga Automática de Textos (Seed)

Se desarrolló el script `seed_textos_correos.py` para poblar masivamente los textos de 30 empresas distintas en 1 segundo.
- Se utilizó `.filter(nombre_empresa__icontains=...)` para asegurar que el script encontrara a las empresas sin importar variaciones menores en su nombre (ej. "CALAFELL" vs "COMERCIALIZADORA CALAFELL").
- Si una empresa del script no existía en la BD, el script la creó automáticamente como un "cascarón", dejando en blanco el correo y contraseña, listos para ser rellenados manualmente después.

> [!TIP]
> **Integración con Obsidian:** Copia este archivo dentro de tu carpeta `docs/cotizador/` en tu repositorio para documentar esta decisión arquitectónica. En un futuro, si cambian los colores de la marca, solo tendrás que editar **1 solo HTML** en lugar de 30.
