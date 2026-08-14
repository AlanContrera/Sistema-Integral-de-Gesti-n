# Sistema Integral de Gestión 

Plataforma unificada (Sistema Englobado) para la automatización de procesos financieros, administrativos, facturación y procesamiento de pagos mediante recolección automática de correos IMAP y extracción inteligente de datos con IA.

## Stack

- **Backend:** Python + Django + Celery + Redis
- **Extracción de Datos:** Inteligencia Artificial (Gemini Flash) + xml.etree (CFDI Parser)
- **Frontend:** React (Vite)

## Estructura

```
backend/    -> API REST + Tareas asíncronas (IMAP, OCR, XML)
frontend/   -> Interfaz web en React (Activa)
```

## Módulos Actuales

- **Módulo 1:** Recolección IMAP (Celery Beat)
- **Módulo 1.5:** Motor OCR y Parseo de XML
- **Módulo 1.8:** API REST (ModelViewSet para lectura y edición de comprobantes)
- **Módulo 2:** Procesamiento Lógico y Clasificación de Ingresos (Retornos, Bancarización, Asimilados, etc.) incluyendo anidamiento de hilos (Padre-Hijo).
- **Módulo 3:** Cálculo de Comisiones e Intereses (EN DESARROLLO)
- **Módulo 4:** Interfaz Web (Dashboard Interactivo, Notificaciones en Vivo, Súper Buscador Global, Navegación por Carpetas, Exportación a Excel con Formato, Validación OCR)
- **[✅ COMPLETADO] Módulo 5:** Generador Dinámico de Cotizaciones en PDF (Backend Django + Pandas + ReportLab, Paginación Inteligente, Extracción Heurística sin encabezados, Frontend React con Gestor Modal de Membretadas, Soporte para Múltiples Plantillas Personalizadas)
- **[✅ COMPLETADO] Módulo 6 (Reclutamiento y Selección):** Sistema "Perfilador" (Replicación avanzada de herramientas en Excel). Carga automatizada de catálogo con 3,675 competencias. Wizard de Vacantes interactivo con navegación por pasos, prevención de errores, autocompletado y cálculo de sueldos. Expediente digital del candidato con Entrevistas y dictamen automático. Tablero ATS con visualización de documento legal. Generación de Reportes Ejecutivos en PDF de forma 100% dinámica con layout 'Corporate Premium'.
- **[✅ COMPLETADO] Arquitectura Docker:** Dockerización de todos los servicios (Django, Vite, Celery, Redis) garantizando entornos locales 100% estandarizados con hot-reloading y persistencia segura de datos.
- **[🏗️ EN PREPARACIÓN] Módulo 7 (Comercial):** Interfaz CRM (Tablero Comercial).

## Estado

En construcción activa. El Módulo de Reclutamiento y la refactorización arquitectónica (TI y Seguridad) operan con éxito. El entorno de desarrollo ha sido completamente Dockerizado asegurando portabilidad e independencia de máquina. Próximo objetivo: Iniciar el desarrollo de cero del Módulo 7 (Comercial).