# Rediseño de Bandeja de Aprobación y Descarga sin Correo

Este plan detalla los pasos para transformar la Bandeja de Aprobación, migrando de un diseño de tarjetas a un formato de tabla con pestañas (igual que la Bandeja de Cotizaciones) e implementando la lógica para gestionar clientes sin correo.

## Proposed Changes

### Backend (ackend/apps/cotizador/views.py)

#### [MODIFY] operaciones_pendientes_view
- Recibir el parámetro estado por GET (?estado=llegadas o ?estado=enviadas).
- Si es llegadas, filtrar por estado_factura='RECIBIDA_DE_MONTERREY'.
- Si es enviadas, filtrar por estado_factura='ENVIADA_AL_CLIENTE'.
- Incluir en la respuesta el campo 	iene_correo: boolean y cliente_correo: string (revisando si op.cliente.correo existe) para que el frontend decida qué botón mostrar.

#### [MODIFY] probar_operacion_view
- Leer equest.data.get('solo_descargar', False).
- Si solo_descargar es verdadero, **Omitir** la llamada a Celery (enviar_factura_oficial_task.delay).
- Independientemente de esto, actualizar el estado_factura a 'ENVIADA_AL_CLIENTE' para que pase al historial.

### Frontend (rontend/src/components/cotizador/BandejaAprobacion.jsx)

#### [MODIFY] BandejaAprobacion.jsx
- Eliminar el diseño actual basado en tarjetas.
- Implementar un sistema de sub-pestañas ('llegadas' y 'enviadas') con persistencia en localStorage.
- Implementar una barra de búsqueda (usquedaEnviadas).
- Implementar el diseño de tabla Premium Fintech (usado en BandejaCotizaciones.jsx) para mostrar la lista de operaciones.
- Renderizado condicional en las acciones de la tabla:
  - Si el cliente **tiene correo**: Botón primario de "Aprobar y Enviar al Cliente".
  - Si el cliente **no tiene correo**: Botón primario de "Solo Descargar (Sin Correo)".
- Actualizar handleAprobar para enviar solo_descargar: true en el payload y lanzar la descarga automática (abriendo el PDF en una nueva pestaña si es necesario o usando la URL existente).

## Verification Plan
### Automated Tests
- N/A

### Manual Verification
- Comprobar que las pestañas funcionan y cargan los estados correctos.
- Intentar aprobar una factura de un cliente con correo y verificar que se encole en Celery.
- Intentar aprobar una factura de un cliente SIN correo y verificar que solo cambie de estado a "Enviadas" sin llamar a Celery.
- Verificar que el diseño en tabla sea responsive y se alinee a la estética Orquídea/Light del cotizador.
