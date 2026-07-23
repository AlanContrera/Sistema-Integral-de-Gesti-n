"""
settings/base.py
Configuracion compartida para todos los entornos.
Lee variables sensibles desde el archivo .env usando python-decouple.
"""

from pathlib import Path
from decouple import config
# --- PROGRAMACIÓN DE TAREAS PERIÓDICAS (Celery Beat) ---
from celery.schedules import crontab
import os

# Raiz del backend (dos niveles arriba de este archivo: settings/ -> config/ -> backend/)
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# GEMINI AI
GEMINI_API_KEY = config('GEMINI_API_KEY')

AUTH_USER_MODEL = 'usuarios.Usuario'


# --- SEGURIDAD ---
SECRET_KEY = config('SECRET_KEY')
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost').split(',')


# --- APLICACIONES INSTALADAS ---
INSTALLED_APPS = [
    # Django core
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Terceros
    'rest_framework',
    'django_celery_beat',
    'django_celery_results',

    # Aplicaciones del proyecto
    'apps.correos',
    'apps.pagos',
    'apps.comisiones',
    'apps.cotizador',
    'apps.usuarios',
        'apps.reclutamiento',

    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # <- Primera siempre
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    # XFrameOptionsMiddleware removido para permitir PDFs en el visor interno
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'


# --- BASE DE DATOS (SQLite para arrancar, por definir en produccion) ---
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# --- VALIDACION DE CONTRASENAS ---
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]


# --- INTERNACIONALIZACION ---
LANGUAGE_CODE = 'es-mx'
TIME_ZONE = 'America/Mexico_City'
USE_I18N = True
USE_TZ = True


# --- ARCHIVOS ESTATICOS ---
STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# --- ARCHIVOS MULTIMEDIA (adjuntos) ---
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Permite mostrar PDFs en iframes del mismo origen
X_FRAME_OPTIONS = 'SAMEORIGIN'


# --- CELERY ---
CELERY_BROKER_URL = config('CELERY_BROKER_URL', default='redis://localhost:6379/0')
CELERY_RESULT_BACKEND = 'django-db'
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = TIME_ZONE


# --- IMAP (leidas desde .env, disponibles para las tareas) ---
IMAP_SERVER = config('IMAP_SERVER')
IMAP_PORT = config('IMAP_PORT', default=993, cast=int)
IMAP_USER = config('IMAP_USER')
IMAP_PASSWORD = config('IMAP_PASSWORD')
IMAP_FOLDER = config('IMAP_FOLDER', default='INBOX')


CELERY_BEAT_SCHEDULE = {
    'revisar-bandeja-cada-2-minutos': {
        'task': 'correos.revisar_bandeja',
        'schedule': crontab(minute='*/2'),
    },
}


CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://192.168.10.188:5173'
]

# ==========================================
# CONFIGURACIÓN DE SEGURIDAD JWT Y API
# ==========================================
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}
