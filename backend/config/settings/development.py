"""
settings/development.py
Configuracion especifica para el entorno de desarrollo local.
"""

from .base import *  # noqa: F401, F403

DEBUG = True

# En desarrollo permitimos cualquier host local y túneles
ALLOWED_HOSTS = ['*']
CORS_ALLOW_ALL_ORIGINS = True

# Herramientas utiles en desarrollo
INSTALLED_APPS += [  # noqa: F405
    'django_extensions',
]
