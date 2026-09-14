---
tags: [documentacion, walkthrough, cotizador, pdf, bugfix]
fecha: 2026-09-14
autor: Alan Contrera
modulo: Cotizador / Bandeja de Cotizaciones
---

# Walkthrough: Corrección de Vista Previa y Descarga de PDF en Bandeja de Cotizaciones

## 1. Diagnóstico y Causa Raíz
Al consultar la **Vista Previa** (icono del ojo) de una cotización en la **Bandeja de Cotizaciones** (`BandejaCotizaciones.jsx`), el documento PDF resultante se mostraba con los datos de cabecera correctos pero con la tabla de servicios y precios completamente vacía. Sin embargo, al descargar el archivo oficial o al enviarlo por correo, el PDF aparecía íntegro y con todas las partidas.

### Causa Técnica:
1. **Diferencia de Origen de Datos:** Al generar cotizaciones desde Excel (`generar_desde_excel_view`), el archivo binario del PDF completo se genera y persiste inmediatamente en el campo `pdf_factura` del modelo `OperacionFacturacion`. En `datos_formulario` solo se almacenan los totales de cabecera (`subtotal`, `impuestos`, `total`), sin duplicar la lista de partidas.
2. **Invocación Redundante a `preview-cotizacion-pdf/`:** En el frontend, tanto `handlePreview` como `handleDownload` enviaban `cot.datos_formulario` al endpoint `preview-cotizacion-pdf/` para forzar la regeneración de un PDF en memoria. Al no encontrar la clave `partidas`, el generador construía una fila en blanco con precio $0.00.
3. **Ausencia de `pdf_url` en la API:** El endpoint `listar-prefacturas/` (`listar_prefacturas_view`) no exponía la URL del archivo PDF físico (`pdf_url`) que ya existía guardado en el servidor.

---

## 2. Solución Arquitectónica Implementada

### 2.1. Backend (`backend/apps/cotizador/views.py`)
* **Exposición de `pdf_url`:** En `listar_prefacturas_view` (tanto para `estado == 'enviadas'` como para `por_enviar`), se agregó la serialización de `pdf_url` utilizando `request.build_absolute_uri(c.pdf_factura.url)` si el archivo físico existe en disco.
* **Respuesta en Descarga Directa:** En `generar_cotizacion_view`, cuando `solo_descargar == True`, se retorna `pdf_url` para consumo inmediato del frontend.

### 2.2. Frontend (`BandejaCotizaciones.jsx`)
* **Priorización del PDF Físico:** Se adaptaron `handlePreview` y `handleDownload` para recibir `pdfUrl`. Si `pdfUrl` existe (el archivo oficial ya está almacenado en disco), la vista previa se abre directamente en una nueva pestaña (`window.open(pdfUrl, '_blank')`) y la descarga consume directamente el archivo físico mediante un blob URL o descarga directa.
* **Modo Fallback:** Si `pdfUrl` es nulo (ej. un borrador inicial que aún no cuenta con archivo PDF generado), se mantiene la llamada a `preview-cotizacion-pdf/`.

---

## 3. Enlaces Relacionados (Obsidian)
- [[2026-09-09_Walkthrough_Generador_Excel_Bandeja_y_Reenvio|Generador Excel y Reenvío]]
- [[2026-09-10_Walkthrough_Optimizacion_Cotizador_y_Modal_Reenvio|Optimización Cotizador y Modal Reenvío]]
- [[2026-08-28_Walkthrough_Bandejas_Historial_y_Clientes|Bandejas, Historial y Clientes]]
- [[MOC_Cotizador|MOC Cotizador]]
