# CONTEXTO MAESTRO - Sistema Integral (App_Facturacion)

> **Última actualización:** 2026-07-21
> **Estado general del proyecto:** 🟢 En construcción — Módulo 4 pulido, Preparando Motor de Cálculos (Módulo 3) y Módulo 5 (Cotizador) finalizado con soporte de más de 40 plantillas simultáneas.
> **Sesión actual enfocada en:** Refactorización del código de generación de cotizaciones en PDF.

## Objetivo General

Construir un Sistema Integral (Sistema Englobado) para automatizar el procesamiento de pagos, la facturación y la gestión operativa:
- Conexión a servidor de correo vía IMAP para revisar bandeja de entrada automáticamente.
- Identificar y extraer comprobantes de pago (PDF/Imágenes) y facturas CFDI (XML) que llegan como adjuntos.
- Aplicar OCR sobre imágenes de transferencias y extraer datos XML de facturas (Fecha, Banco, Monto, RFC, Emisor, etc).
- Procesar y registrar los datos extraídos en la base de datos (descartando archivos irrelevantes menores a 20KB).
- Calcular comisiones de clientes según reglas de negocio (pendiente de requerimientos).
- Presentar reportes y gestión a través de una interfaz web moderna.

## Stack Tecnológico

| Capa           | Tecnología                     | Propósito                          |
|----------------|--------------------------------|------------------------------------|
| Backend        | Python 3.x + Django            | API REST, lógica de negocio        |
| Frontend       | React (Vite)                   | Interfaz de usuario                |
| Base de datos  | SQLite / PostgreSQL            | Persistencia de datos              |
| Tareas async   | Celery + Redis                 | Procesamiento en segundo plano     |
| Lector Correos | IMAP (pyzmail)                 | Conexión y decodificación          |
| Extracción IA  | Gemini Flash (generativeai)    | Parseo inteligente de comprobantes |
| Extracción XML | xml.etree                      | Parseo de facturas CFDI del SAT    |
| API            | Django REST Framework          | Endpoints para React               |

## Módulos del Sistema

- [✅ COMPLETADO] Módulo 1: Recolección IMAP
  - Descarga correos vía Celery Beat.
  - Filtra adjuntos (ignora imágenes pequeñas de firmas < 20KB).

- [✅ COMPLETADO] Módulo 1.5: Extracción Inteligente (OCR y XML)
  - **Facturas (XML):** Se leen automáticamente las etiquetas CFDI (Emisor, Receptor, Folio, Total).
  - **Comprobantes (Imágenes/PDF):** Se pasan por Inteligencia Artificial (Gemini Vision) extrayendo JSON estricto con Monto, Banco, Cuentas y Referencia.
  - **Unificación:** Si un PDF es la representación impresa de una factura, se vincula automáticamente a la tabla de Facturas en lugar de tratarse como comprobante bancario.

### ✅ Módulo 1.8: API REST
- Endpoints `ModelViewSet` para exponer `CorreoProcesado`, `Comprobante` y `Factura`.
- Permite operaciones de actualización (PATCH) para validación manual de datos extraídos.

### ✅ Módulo 2: Procesamiento Lógico y Clasificación
- Clasificación de ingresos según asunto: Retorno, Confirmación, Asimilado, Blindado, Bancarización.
- Extracción de información estructurada directamente del cuerpo del correo (tablas Asimilados).
- Lógica de anidación (Hilos Padre-Hijo) para agrupar cadenas de correos en un solo Expediente.

### 🟡 Módulo 3: Cálculo de Comisiones ← **(ACTIVO)**
- Creación de motor de liquidación (subtotales, comisiones, intereses).
- Aplicación de reglas de negocio matemáticas basadas en el tipo de ingreso.

### ✅ Módulo 4: Interfaz Web (React)
- Vista de 'Expediente Unificado' con timeline de correos (hilos).
- Renderizado limpio de cuerpo de correos (eliminación de basura y metadatos de Outlook).
- Interfaz de "Modo Edición" para validación humana de errores del OCR.

### ✅ Módulo 5: Generador de Cotizaciones PDF
- Procesamiento en backend de archivos Excel (Django + Pandas).
- Generación de PDF dinámicos y membretados mediante motor Platypus (ReportLab).
- Interfaz web dedicada en React (Drag & Drop) para generación y descarga interactiva.

## Reglas Estrictas del Desarrollador

1. El asistente NO escribe código funcional por mí (ni vistas, ni funciones completas).
2. Fragmentos mínimos (2-4 líneas) solo para ilustrar conceptos puntuales.
3. Toda guía es a nivel lógico y arquitectónico. El "qué" y el "por qué".
4. Debo escribir todo el código yo mismo.
5. Ante dudas, el asistente hace preguntas guía para que yo llegue a la solución.
6. Documentar antes de implementar.

## Decisiones de Arquitectura

- 2026-06-18: backend y frontend separados (independencia de despliegue)
- 2026-06-18: Celery + Redis para tareas asíncronas (robustez y escalabilidad)
- 2026-06-19: Separar el modelo de Factura (XML estructurado) y Comprobante (OCR probabilístico).
- 2026-06-19: Unificar el archivo PDF de la factura con su registro XML para no contaminar la tabla de transferencias bancarias.
- 2026-06-19: Preprocesamiento de imágenes con PIL (Escala de grises, Lanczos 2x) y Tesseract PSM 6 para optimizar lectura de imágenes de WhatsApp.
- 2026-06-22: Filtro de firmas en dos capas (tamaño < 50KB + análisis de contenido bancario post-OCR).
- 2026-06-22: Exposición de API REST terminada con `corsheaders` para permitir React en puerto 5173.
- 2026-06-22: Frontend React completado. Tablas de Facturas y Comprobantes leyendo datos reales del backend Django.
- 2026-06-22: Data Fusion: Extracción de texto estructurado multilínea de correos para cruzar con fallos del OCR.
- 2026-06-22: Filtro post-OCR para destrucción automática de logotipos y firmas basado en ausencia de datos financieros.
- 2026-06-23: Refactorización y estabilización de Motor OCR. Modificación del motor (PSM dinámico) para detección de montos en fuentes grandes.
| 2026-06-23 | Calibración del motor OCR y limpieza | Tesseract requiere PSM automático para leer fuentes gigantes. La limpieza de caracteres duplicados por el OCR debe limitarse a letras para no destruir números naturales como las CLABE o montos. |
| 2026-06-24 | Validación "Human-in-the-Loop" | Se integró un modo edición en React que permite al usuario corregir datos y marcar comprobantes como "Revisados", mitigando las inevitables fallas del OCR. |
| 2026-06-24 | Clasificación de Ingresos | Celery clasifica los correos (`tipo_ingreso`) basándose en el asunto para permitir filtrado en el frontend. |
| 2026-06-25 | Renderizado de Hilos de Correo y Limpieza UI | Se implementó la vista de Expediente que agrupa padre e hijos. Se optimizó un parser en frontend para limpiar firmas de Outlook y extraer las tablas financieras incrustadas en el cuerpo del correo. |
| 2026-06-26 | Refactorización UI a Carpetas | Reemplazo de tablas planas y acordeones por un sistema de navegación basado en carpetas para Ingresos y Facturas, agrupados dinámicamente por cliente.
| 2026-06-26 | Reportes Excel y Metadatos PPD | Inclusión del 'Método de Pago' en el parseo XML y generación nativa de reportes Excel corporativos desde React.
| 2026-06-26 | Arquitectura de Asignación de Pagos | Se documentó el plan para la vinculación manual de comprobantes bancarios (OCR) con Facturas a crédito (PPD) para control de saldos.
| 2026-06-30 | Integración de IA Generativa | Se eliminó Tesseract OCR y se reemplazó por la API de Google Gemini (gemini-flash-latest) logrando una precisión absoluta en la extracción y permitiendo leer comprobantes en color sin filtros previos. El resultado se cruza contra el catálogo local para estandarizar los nombres.
| 2026-07-06 | IA en Cuerpo de Correo y Agregación Financiera | Se expandió el uso de Gemini para leer el cuerpo de los correos y extraer el `monto_depositado` con exactitud, superando las limitaciones de Regex. Se implementó una agregación por ORM (`Sum`) como respaldo para operar hilos con múltiples PDFs.
| 2026-07-06 | Pulido UI (Skeletons y Dashboard) | Se implementaron Loading Skeletons en React para mejorar la UX durante la obtención asíncrona de datos. Se agregó una Gráfica de Pastel (Recharts) en el Dashboard. Se optimizó el enrutamiento y filtros del Buzón para descartar Facturas puras. |
| 2026-07-13 | Módulo de Cotizaciones | Construcción de un motor dinámico para PDFs (ReportLab Platypus) que recibe un Excel desde React y dibuja una tabla exacta con columnas clave. Interfaz React con Drag & Drop para generación interactiva. |
| 2026-07-15 | Motor Heurístico y Paginación de PDF | Se implementó un algoritmo de paginación dinámica (`Table.split()`) para tablas largas. Se construyó un motor heurístico de extracción sin índices que procesa archivos Excel incluso sin fila de encabezados, asignando valores lógicamente. Se integró un Gestor de Membretadas en formato Modal dentro de React. |
| 2026-07-20 | Integración de Diseños Personalizados (PDF) | Se configuraron 7 estilos de plantillas (KALE, ASESORES GBR, GLOBALEARTH, GOVIDA, LEVICTUS, LEXIC, LIMGRATSA) en el generador de PDF, adaptando coordenadas, estilos de tabla, colores, alineaciones y lógica condicional de renderizado. |
| 2026-07-21 | Refactorización de Views y Temas | Se centralizó la configuración visual de la tabla y las coordenadas. El sistema soporta dinámicamente más de 40 diseños empresariales (CRISAC, VIMEX, TORRES, DERSA, etc.) mediante diccionarios en `temas_config.py`, logrando un código backend modular, optimizado y sin redundancias en la vista. |

## Notas de Sesión

- Este archivo debe actualizarse al inicio y cierre de cada sesión de trabajo.

## Configuración de Acceso LAN (WSL)

Para que los usuarios de la red local puedan acceder a la app se usa **Port Forwarding** de Windows hacia WSL.

### Configuración aplicada

| Elemento | Valor |
|---|---|
| IP Windows (LAN) | `192.168.10.188` |
| IP WSL (interna) | `172.27.78.x` *(cambia al reiniciar)* |
| Puerto Frontend | `5173` |
| Puerto Backend | `8000` |

**`vite.config.js`** tiene `host: '0.0.0.0'` para aceptar conexiones externas.  
**Django** debe lanzarse con `python manage.py runserver 0.0.0.0:8000`.

### URLs de acceso en red

- **Frontend:** `http://192.168.10.188:5173`
- **Backend:** `http://192.168.10.188:8000`

### Si deja de funcionar (IP de WSL cambió)

1. Abre **PowerShell como Administrador** (`Win+X` → Terminal Admin)
2. Ejecuta:
```powershell
powershell -ExecutionPolicy Bypass -File "C:\Users\Sistemas\wsl_portforward.ps1"
```
El script detecta automáticamente la nueva IP de WSL y reconfigura todo.
