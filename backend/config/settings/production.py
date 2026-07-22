"""
settings/production.py
Configuracion especifica para el entorno de produccion.
Se completara cuando el proyecto este listo para despliegue.
"""

from .base import *  # noqa: F401, F403

DEBUG = False

# En produccion ALLOWED_HOSTS debe contener el dominio real del servidor
# Ejemplo: ALLOWED_HOSTS = ['tudominio.com', 'www.tudominio.com']
