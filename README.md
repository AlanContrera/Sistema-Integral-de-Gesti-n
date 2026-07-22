# Sistema Integral de Gestión (App_Facturacion)

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

## Estado

En construcción activa. El Frontend cuenta con un sistema de carpetas dinámico para organizar Ingresos y Facturas por cliente, además de generación de reportes Excel. La capa de extracción de datos (OCR y XML) opera correctamente. El Módulo de Cotizaciones se encuentra operando al 100% con un motor capaz de renderizar más de 40 diseños corporativos distintos dinámicamente gracias a una configuración centralizada y optimizada. Actualmente en preparación para el Módulo 3 (Cálculos y Liquidaciones) y la integración de asignación manual de pagos a facturas PPD. Ver `contexto.md` para el detalle de la arquitectura.
