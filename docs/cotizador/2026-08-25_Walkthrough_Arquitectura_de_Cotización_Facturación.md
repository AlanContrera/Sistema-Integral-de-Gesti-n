# Walkthrough: Arquitectura de Cotización y Facturación (2026-08-25)

Este documento sirve como referencia técnica en Obsidian para entender cómo quedó estructurado el motor de facturación asíncrono y los caminos de cotización.

## 1. El Origen de Datos (Frontend)
El componente FormularioPreFactura.jsx actúa como la terminal de captura. En lugar de un botón genérico, ahora posee una bifurcación lógica con modales personalizados (sin alertas nativas).

## 2. El Archivero Digital (Backend Models)
Se implementó el modelo OperacionFacturacion. Este es el corazón de la trazabilidad.

**Campos de Trazabilidad:**
Cada vez que se da clic a los botones, se genera una referencia_unica (Ej. OP-1A2B3C). Esta referencia se insertará en el ASUNTO de los correos para que el Robot Lector pueda identificar a quién pertenece la respuesta.

El estado del trámite fluye por:
1. NO_SOLICITADA
2. ENVIADA_A_MONTERREY
3. RECIBIDA_DE_MONTERREY
4. ENVIADA_AL_CLIENTE

## 3. Generación Asíncrona (Celery)
Al recibir las solicitudes, el backend (Django views.py) no detiene al usuario.
1. Guarda los totales en la base de datos.
2. Invoca a excel_generator.py para dibujar la plantilla exacta.
3. Mete la orden a Celery (enviar_cotizacion_task.delay) para que envíe el correo por SMTP sin trabar la pantalla de carga.
