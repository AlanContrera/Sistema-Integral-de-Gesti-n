---
tags: [documentación, walkthrough, refactor, cotizador, ui-ux]
fecha: 2026-08-31
modulo: Cotizador Inteligente y Facturación
---

# Walkthrough: Mejoras de UX, Modal de Confirmación SMTP, Buscador en Enviadas y Persistencia de Navegación

**Fecha:** 2026-08-31  
**Módulo:** Cotizador Inteligente y Facturación  
**Objetivo:** Optimizar la experiencia de captura en el formulario de prefacturas, estructurar el modal de confirmación técnica para envíos a Monterrey, incorporar buscador en la bandeja de cotizaciones enviadas, proteger la edición de registros despachados y habilitar la persistencia de navegación con auto-actualización en segundo plano.

---

## 1. Resumen de Cambios Implementados

### 1.1. Captura Fluida de Precio Unitario
- Se corrigió el comportamiento del input numérico de Precio Unitario en `FormularioPreFactura.jsx` permitiendo valores vacíos `''` durante la edición y agregando auto-selección (`onFocus={(e) => e.target.select()}`).
- Se actualizaron las funciones reductoras de Subtotal, IVA e Importe para evaluar de forma segura valores numéricos (`parseFloat(...) || 0`).

### 1.2. Mapeo Dinámico y Jerárquico del Estado de Prefacturas
- Se restauró la columna **Estado** en la tabla de Historial de Prefacturas vinculada estrictamente al ciclo de vida de facturación:
  - `NO_SOLICITADA` -> **Borrador** (Gris / Slate).
  - `ENVIADA_A_MONTERREY` -> **Solicitada a MTY** (Ámbar).
  - `RECIBIDA_DE_MONTERREY` -> **Recibida de MTY** (Azul).
  - `ENVIADA_AL_CLIENTE` -> **Factura Entregada** (Verde).

### 1.3. Modal Técnico de Confirmación de Despacho a Monterrey
- Se rediseñó el modal de confirmación en `FormularioPreFactura.jsx` sustituyendo el texto genérico por dos tarjetas estructuradas:
  - **Remitente (Empresa Emisora):** Razón social y correo corporativo configurado en SMTP.
  - **Destinatario (Oficina de Facturación):** Oficina Monterrey (`giovannicontre24@gmail.com`).
- Se clarificó la separación entre el destinatario físico del correo y el cliente/receptor fiscal de la factura.

### 1.4. Buscador Interactivo en Cotizaciones Enviadas
- En `BandejaCotizaciones.jsx`, se agregó una barra de búsqueda en tiempo real dentro de la sub-pestaña **Enviadas**.
- Filtra instantáneamente por Folio Oficial (`COT-...`), Folio Origen (`PRE-...`), Cliente, Empresa Emisora y Usuario Remitente.

### 1.5. Bloqueo de Edición para Prefacturas Despachadas
- Se condicionó el botón **Cargar / Editar** en el Historial para que solo sea visible cuando la prefactura permanece en estado `NO_SOLICITADA` y no ha sido cotizada (`!cotizacion_enviada`), previniendo inconsistencias operativas.

### 1.6. Persistencia de Navegación y Auto-Actualización Silenciosa (Live Polling)
- **Persistencia con `localStorage`:**
  - `ModuloCotizador.jsx`: Recuerda la pestaña activa (`cotizador_active_tab`) al recargar el navegador.
  - `BandejaCotizaciones.jsx`: Recuerda la sub-pestaña (`por_enviar` vs `enviadas`).
  - `FormularioPreFactura.jsx`: Recuerda la sub-pestaña (`formulario` vs `historial`).
- **Auto-Refresh Silencioso:** Tanto el historial de prefacturas como las bandejas de cotizaciones se refrescan automáticamente cada 10 segundos en segundo plano sin bloquear la interfaz ni provocar parpadeos (`silent = true`).

---

## 2. Archivos Modificados

| Archivo | Tipo de Cambio | Descripción |
| :--- | :--- | :--- |
| `frontend/src/pages/cotizador/ModuloCotizador.jsx` | Modificado | Persistencia de pestaña principal en `localStorage`. |
| `frontend/src/components/cotizador/FormularioPreFactura.jsx` | Modificado | Fix input precio unitario, badges de estado, modal de confirmación con tarjetas, botón Cargar condicional, persistencia y auto-refresh. |
| `frontend/src/components/cotizador/BandejaCotizaciones.jsx` | Modificado | Buscador interactivo en Enviadas, persistencia de sub-pestaña y auto-refresh cada 10s. |
| `backend/apps/cotizador/views.py` | Modificado | Inclusión de `cotizacion_enviada` en payload de `listar_prefacturas_view`. |

---

## 3. Depuración de Registros de Prueba

Se ejecutó la limpieza controlada en la base de datos PostgreSQL de las prefacturas de prueba con folios `0001` a `0008` (`PRE-28082026-0001` a `PRE-28082026-0008`) junto con sus cotizaciones oficiales hijas, dejando las bandejas operativas y listas para producción.

---

## 4. Enlaces Relacionados (MOCs)

- [[MOC Cotizador Inteligente]]
- [[MOC Arquitectura Frontend]]
- [[MOC Backend Django y Celery]]
