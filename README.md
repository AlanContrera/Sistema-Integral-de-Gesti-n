# Sistema Integral de Gestión 

Plataforma unificada (Sistema Englobado) para la automatización de procesos financieros, administrativos, facturación y procesamiento de pagos mediante recolección automática de correos IMAP y extracción inteligente de datos con IA.

## Stack

- **Backend:** Python + Django + Celery + Redis + PostgreSQL
- **Extracción de Datos:** Inteligencia Artificial (Gemini Flash) + xml.etree (CFDI Parser)
- **Frontend:** React (Vite)

## Estructura

```
backend/ -> API REST + Tareas asíncronas (IMAP, OCR, XML, SMTP) frontend/ -> Interfaz web en React (Activa) docs/ -> Documentación viva de la arquitectura y flujos del sistema
```

## Módulos Actuales

- **Módulo 1:** Recolección IMAP (Celery Beat)
- **Módulo 1.5:** Motor OCR y Parseo de XML
- **Módulo 1.8:** API REST (ModelViewSet para lectura y edición de comprobantes)
- **Módulo 2:** Procesamiento Lógico y Clasificación de Ingresos (Retornos, Bancarización, Asimilados, etc.) incluyendo anidamiento de hilos (Padre-Hijo).
- **Módulo 3:** Cálculo de Comisiones e Intereses (EN DESARROLLO)
- **Módulo 4:** Interfaz Web (Dashboard Interactivo, Notificaciones en Vivo, Súper Buscador Global, Navegación por Carpetas, Exportación a Excel con Formato, Validación OCR)
- **[✅ COMPLETADO] Módulo 5:** Cotizador y Facturación Empresarial (ACTUALIZACIÓN SEPTIEMBRE 2026): Suite integral de cotización y facturación empresarial. Integra catálogos fiscales oficiales SAT 4.0 modularizados (CatalogoSat.jsx), catálogo relacional de conceptos autorizados por dupla Cliente-Empresa Emisora con explorador modal de lectura íntegra en tarjetas interactivas (CatalogoConceptosModal.jsx), **Generador de Cotizaciones desde Excel integrado en la Bandeja** con modal espacioso (GenerarCotizacionExcelModal.jsx), detección inteligente de cliente (Catálogo vs Operación Única), validación en caliente de membretadas físicas y SMTP, **persistencia física de PDFs** (pdf_factura), y **Reenvío de Cotizaciones en 1-Clic** desde la pestaña de Enviadas. Eliminación de vistas y pestañas legacy obsoletas para una experiencia limpia. Flujo estructurado de prefacturas, Bandeja de Aprobación tabular estilo Fintech con descarga directa sin correo, despacho asíncrono SMTP multi-empresa con Celery, **diseño responsivo 100% multiplataforma** y **Rediseño Premium Fintech (Light + Orquídea)** con gestión de sesión (AuthContext).
- **[🏗️ EN PREPARACIÓN] Módulo 8:** Hub Multi-Agente (pps.agentes) - Arquitectura central de Inteligencia Artificial para monitoreo, diagnóstico heurístico de incidentes SMTP/DNS/Celery y redacción ejecutiva de alertas automáticas.
- **[✅ COMPLETADO] Módulo 6 (Reclutamiento y Selección):** Sistema "Perfilador" (Replicación avanzada de herramientas en Excel). Carga automatizada de catálogo con 3,675 competencias. Wizard de Vacantes interactivo con navegación por pasos, prevención de errores, autocompletado y cálculo de sueldos. Expediente digital del candidato con Entrevistas y dictamen automático. Tablero ATS avanzado con progresión automática de estatus y modales personalizados premium. Generación de Reportes Ejecutivos en PDF y su **Envío Automatizado al Cliente (Flujo 1-Click)** mediante plantillas HTML corporativas e integración de tareas asíncronas de alto rendimiento con Celery y Redis.
- **[✅ COMPLETADO] Arquitectura Docker:** Dockerización de todos los servicios (Django, Vite, Celery, Redis) garantizando entornos locales 100% estandarizados con hot-reloading y persistencia segura de datos.
- **[🏗️ EN PREPARACIÓN] Módulo 7 (Comercial):** Interfaz CRM (Tablero Comercial).

## Base de Datos e Inspección Visual
La arquitectura corre sobre **PostgreSQL 15**. Se integró un contenedor con **pgAdmin4** para la visualización del Diagrama Entidad-Relación (ERD) en tiempo real. 
- **Acceso local:** `http://localhost:5050` (Ejecutar `docker-compose up -d pgadmin` para levantar la interfaz).

## Estado

En construcción activa. El Módulo de Reclutamiento y la refactorización arquitectónica (TI y Seguridad) operan con éxito. El entorno de desarrollo ha sido completamente Dockerizado asegurando portabilidad e independencia de máquina. Migración de Base de datos a PostgreSQL