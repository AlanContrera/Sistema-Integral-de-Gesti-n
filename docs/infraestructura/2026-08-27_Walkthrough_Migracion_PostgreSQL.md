# Walkthrough: Migración a PostgreSQL y Preparación para SaaS B2B
*Fecha: 27 de Agosto, 2026*

## Resumen Ejecutivo
Para habilitar la comercialización del sistema integral como un producto **SaaS B2B**, se tomó la decisión arquitectónica de transicionar del modelo embebido (SQLite) al modelo Cliente-Servidor empresarial (PostgreSQL). 

Se optó por el modelo de comercialización **Single-Tenant (Servidores Dedicados)**, lo que permite clonar la infraestructura aislada (Docker) para cada cliente, garantizando seguridad máxima, cero "data leakage" y flexibilidad para personalizaciones marca blanca (White-label).

## Flujo de Migración Cero-Pérdida de Datos

### 1. Extracción (Dump)
Se extrajo la totalidad de la base de datos de producción desde el contenedor de Django antes de apagarlo, omitiendo los modelos autogenerados para evitar conflictos de ContentTypes:
```bash
python manage.py dumpdata --natural-foreign --natural-primary -e contenttypes -e auth.Permission --indent 4 > backup_produccion.json
```

### 2. Actualización de Infraestructura
Se agregaron tres componentes críticos al código fuente:
1. **Conector de Python:** Se añadió `psycopg2-binary==2.9.9` a `requirements/base.txt`.
2. **Servicio Docker:** Se añadió el contenedor oficial `postgres:15-alpine` en el `docker-compose.yml` con un volumen persistente `postgres_data`.
3. **Settings:** Se apuntó el diccionario `DATABASES` en `base.py` al contenedor `db` por el puerto 5432 usando el driver de postgresql.

### 3. Refactorización de Signals Defensivos
Durante la carga de datos (`loaddata`), Django dispara los signals `pre_save` y `post_save` por defecto, lo que causaba un crasheo al buscar referencias cruzadas (Ej. `Candidato.objects.get(pk=...)`) de objetos que apenas se estaban insertando en RAM y aún no existían en la tabla.

**Solución Implementada:**
Se modificó `apps/reclutamiento/signals.py` para ignorar los signals durante la inyección en crudo:
```python
if kwargs.get('raw', False):
    return
```

### 4. Inyección
Tras reconstruir las imágenes de Docker (`docker compose build backend`), se corrió un `migrate` virgen para levantar los schemas, seguido de la inyección final:
```bash
python manage.py loaddata backup_produccion.json
```
**Resultado:** *Installed 7228 object(s) from 1 fixture(s)*.

## Seguridad Post-Migración
Se bloqueó formalmente la subida de los respaldos de base de datos (archivos `*.json`) en el `.gitignore` para evitar fugas de confidencialidad en el repositorio. La base de datos `db.sqlite3` puede ser removida con seguridad de los entornos locales.
