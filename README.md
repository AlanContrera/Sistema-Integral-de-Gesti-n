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
- **[✅ COMPLETADO] Módulo 6 (Reclutamiento y Selección):** Sistema "Perfilador" (Replicación avanzada de herramientas en Excel). Carga automatizada de catálogo con 3,675 competencias. Wizard de Vacantes interactivo con navegación por pasos, prevención de errores, autocompletado y cálculo de sueldos. Expediente digital del candidato con Entrevista Inicial (Semáforos) y Entrevista Profunda (cálculo porcentual en vivo y dictamen automático), ambas con **gestión dinámica de preguntas editables desde la interfaz**. Tablero ATS (Applicant Tracking System) con visualización de documento legal Perfilador optimizado. Generación de Reportes Ejecutivos en PDF de forma 100% dinámica con layout de consultoría 'Corporate Premium'.
- **[🚧 EN PREPARACIÓN] Módulo 7 (Comercial):** Interfaz CRM (Tablero Comercial) para creación de levantamientos y generación de PDF de Propuestas al Cliente.

## Estado

En construcción activa. El Frontend cuenta con un sistema de carpetas dinámico para organizar Ingresos y Facturas por cliente, además de generación de reportes Excel. La capa de extracción de datos (OCR y XML) opera correctamente. El Módulo de Cotizaciones se encuentra operando al 100%. El Módulo de Reclutamiento completó exitosamente el diseño "Premium" para reportes PDF y optimización de UI. Actualmente en preparación para iniciar el desarrollo del Módulo 7 (Comercial) con su propio Tablero CRM y reutilización de componentes de perfilamiento. Ver `contexto.md` para el detalle de la arquitectura.
