---
tags: [documentación, arquitectura, ia, cotizador, propuesta]
date: 2026-09-02
---

# Plan Estratégico: Implementación de Inteligencia Artificial en el Cotizador

## 1. Resumen Ejecutivo y Enfoque de Negocio

El objetivo de esta propuesta técnica es transformar el módulo cotizador de un sistema de captura reactivo y manual a un **asistente comercial asistido por inteligencia artificial**. 

La arquitectura actual (Django, Celery, PostgreSQL y React) cuenta con bases sólidas y desacopladas. Esta evolución no requiere reconstruir el software, sino superponer una **capa cognitiva** que optimice el tiempo del personal operativo y estandarice las decisiones comerciales.

### Principio Fundamental: Human-in-the-Loop
Bajo ninguna circunstancia la inteligencia artificial despachará cotizaciones o tomará compromisos contractuales de forma autónoma. El sistema pre-procesa, estructura y sugiere; el usuario comercial valida, ajusta si es necesario y autoriza con un clic.

---

## 2. Comparativa de Experiencia de Usuario (UX)

| Dimensión | Flujo Actual | Flujo Asistido con IA |
| :--- | :--- | :--- |
| **Ingesta de Solicitudes** | Lectura de correo externo, copia manual de cada ítem, búsqueda en catálogo y tipeo de cantidades en la interfaz (10-15 min). | Arrastrar el correo o PDF a la plataforma. La IA extrae partidas, mapea códigos y pre-llena el formulario en 3 segundos (<1 min). |
| **Fijación de Precios (Pricing)** | Dependencia de memoria del vendedor o consulta en historiales viejos/supervisores. Riesgo de márgenes desfasados. | Sugerencia contextual en tiempo real: muestra última venta, margen histórico del cliente y precio de cierre sugerido. |
| **Rol del Usuario** | Capturista de datos con alto esfuerzo operativo. | Supervisor y estratega comercial centrado en negociación y cierre. |

---

## 3. Arquitectura Técnica de la Solución

`
+-----------------------------------------------------------------------------+
|                               FRONTEND (React)                              |
|  - ModuloCotizador.jsx: Panel lateral "Copiloto"                            |
|  - Visualización contextual de confianza de extracción y sugerencias       |
|  - Conexión vía WebSockets / Server-Sent Events (Streaming de tokens)       |
+---------------------------------------^-------------------------------------+
                                        | (HTTP / SSE)
+---------------------------------------v-------------------------------------+
|                           BACKEND (Django REST Core)                        |
|  - Endpoint de ingestion (/api/cotizador/parse-rfq/)                       |
|  - Control de permisos, autenticación y auditoría                          |
+---------------------------------------^-------------------------------------+
                                        |
+---------------------------------------v-------------------------------------+
|                       COLA ASÍNCRONA (Celery Workers)                       |
|  1. Extracción de Documentos: pdfplumber / Tesseract OCR                    |
|  2. Razonamiento Estructurado: Instructor + Pydantic + LLM                 |
|  3. Recuperación Contextual (RAG): Búsqueda semántica en base vectorial     |
+-------------------+-----------------------------------+---------------------+
                    |                                   |
+-------------------v---------------+   +---------------v---------------------+
|      BASE DE DATOS RELACIONAL     |   |       CAPA VECTORIAL / RAG          |
|    PostgreSQL (Datos maestros,    |   |     PostgreSQL (pgvector)           |
|    clientes, órdenes y estados)   |   |   Embeddings de ventas históricas   |
+-----------------------------------+   +-------------------------------------+
`

### Componentes Clave:
1. **Motor de Extracción y Validación Estricta (Backend):**
   - Empleo de la librería instructor junto con modelos Pydantic en Python para obligar al modelo de lenguaje a generar salidas en esquemas JSON exactos y válidos para el backend de cotización.
   - Procesamiento de RFQs (Request for Quotation) adjuntos en formato PDF o imágenes con pdfplumber o OCR.

2. **Memoria Histórica y Sugerencia de Precios (RAG):**
   - Incorporación de la extensión pgvector sobre PostgreSQL para vectorizar descripciones de productos y cotizaciones previas.
   - Recuperación en milisegundos de transacciones similares para calcular el margen comercial sugerido.

3. **Interfaz y Streaming (Frontend):**
   - Integración de un componente lateral desplegable en ModuloCotizador.jsx.
   - Soporte para Server-Sent Events (SSE) en Django para renderizar respuestas token por token, eliminando la sensación de latencia.
   - Iconografía estricta con lucide-react, sin emojis, manteniendo la paleta cromática corporativa.

---

## 4. Hoja de Ruta de Implementación (Roadmap)

### Fase 1: Extracción Inteligente de Solicitudes (Inbound Parsing)
- Configurar worker en Celery dedicado a la inferencia de solicitudes.
- Integrar endpoint que reciba texto plano o PDF y devuelva el borrador de cotización en formato compatible con el estado de React.
- Mapeo automático contra la tabla existente de clientes y empresas emisoras.

### Fase 2: RAG de Precios y Margen Sugerido
- Habilitar pgvector en la base de datos de producción.
- Tarea en segundo plano para generar embeddings de las operaciones y cotizaciones históricas.
- Inyección de tarjetas de contexto en la interfaz: último precio cobrado, variación porcentual y margen recomendado.

### Fase 3: Copiloto Interactivo en Frontend
- Desarrollo del componente React para asistencia conversacional comercial.
- Acciones rápidas en la interfaz: "Aplicar sugerencias a la tabla", "Ajustar margen a 20%", "Reemplazar ítems sin stock".

---

## 5. Enlaces Relacionados
- [[Arquitectura de Cotización y Facturación]]
- [[MOC Cotizador]]
- [[Gestión de Correos y SMTP]]
