---
tags: [documentación, walkthrough, refactor]
date: 2026-09-02
---

# Corrección de Nombres de Archivos Adjuntos (Facturas)

## Descripción del Problema
Se reportó que, al momento de aprobar una operación desde la bandeja de aprobación y enviarla al cliente final, los archivos adjuntos (PDF y XML) llegaban renombrados con la referencia interna (ej. COT-01012026-0001.pdf), perdiendo el nombre original proporcionado por el emisor (Monterrey).

## Causa Raíz
En la tarea asíncrona de envío de correo (enviar_factura_oficial_task), el Content-Disposition estaba forzando el renombramiento estático del archivo mediante concatenación.

## Solución Técnica Implementada
1. **Preservación de Nombre**: Se modificó backend/apps/cotizador/tasks.py implementando os.path.basename() sobre operacion.pdf_factura.name. Esto extrae la última porción de la ruta almacenada (el nombre original físico), garantizando que el cliente reciba el archivo sin alteraciones.
2. **Limpieza UI (Regla Anti-Emoji)**: Se sanearon textos en el componente BandejaAprobacion.jsx que presentaban emojis residuales, respetando la estructura del frontend corporativo.

## Enlaces Relacionados
- [[Arquitectura de Cotización y Facturación]]
- [[Gestión de Correos y SMTP]]
