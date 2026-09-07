---
tags: [documentación, walkthrough, refactor, frontend, backend]
date: 2026-09-07
---

# Rediseño de Bandeja de Aprobación, ZIPs y Validaciones SMTP

## 1. Resumen de los Cambios

Se realizó una refactorización profunda en el flujo de aprobación de facturas recibidas de Monterrey (\BandejaAprobacion.jsx\) para mejorar la Experiencia de Usuario, estandarizar el diseño visual y prevenir errores silenciosos en la cola de Celery por falta de correos configurados.

### 1.1 Rediseño de UI en React
- **Tarjetas a Tabla:** Se reemplazó el antiguo formato de visualización por tarjetas por una **Tabla Premium Fintech** (basada en \BandejaCotizaciones\), optimizando la lectura de información.
- **Sistema de Pestañas:** Se implementaron las sub-pestañas **"Llegadas de MTY"** e **"Historial (Enviadas)"** usando \localStorage\ para recordar la vista activa.
- **Buscador en tiempo real:** Se añadió barra de búsqueda que filtra por referencia, cliente o empresa emisora en memoria.
- **Renderizado Condicional de Acción:** El sistema ahora evalúa si el cliente tiene registrado un correo (campo \	iene_correo\ inyectado por backend) y muestra dinámicamente un botón violeta de "Aprobar y Enviar" o un botón naranja de "Solo Descargar".

### 1.2 Forzado de Descarga ZIP (Cross-Origin)
- Se detectó un problema de **CORS** que impedía que \etch\ descargara binarios puros (PDF/XML) desde \/media/\ y forzaba la visualización en nuevas pestañas.
- Se refactorizó \probar_operacion_view\ en Django para que, si el cliente no tiene correo (\solo_descargar=True\), el backend agrupe el PDF y XML usando \zipfile\ en memoria y devuelva una respuesta HTTP binaria nativa (\pplication/zip\).
- El frontend ahora procesa esta respuesta usando \esponse.blob()\ para forzar la ventana de descarga en el navegador del usuario como \[REFERENCIA]_Archivos.zip\.

### 1.3 Validación Anti-Silent Fails de Celery
- Se identificó un bug en \solicitar_factura_monterrey_view\ donde si la **Empresa Emisora** seleccionada no tenía correo o contraseña (\App Password\) registrada en el sistema, la API devolvía "Éxito", pero la tarea asíncrona de Celery (\enviar_prefactura_monterrey_task\) explotaba con \535 Incorrect authentication data\.
- Se añadió un bloque de validación *Fail-Fast* en \iews.py\ antes de encolar la tarea. Ahora, si la empresa carece de credenciales, la API aborta devolviendo un status **400 Bad Request** y el frontend muestra el error, previniendo estados fantasma.

## 2. Archivos Modificados Principales

- **Frontend:**
  - \rontend/src/components/cotizador/BandejaAprobacion.jsx\ (Refactor completo).
- **Backend:**
  - \ackend/apps/cotizador/views.py\ (Funciones \operaciones_pendientes_view\, \probar_operacion_view\ y \solicitar_factura_monterrey_view\).

## 3. Próximos Pasos (Pendientes del Administrador)
- Asegurar que todas las empresas emisoras tengan su "Contraseña de Aplicación" de Google configurada en el sistema para evitar el error 400.
