# CONTEXTO MAESTRO - Sistema Integral (App_Facturacion)

> **Última actualización:** 2026-08-20
> **Estado general del proyecto:** 🟢 En construcción — Setup de rastreo de creadores completado. En pausa por migración de equipo. Preparando inicio del Módulo de Administración de Usuarios.
> **Sesión actual enfocada en:** Definición de la arquitectura para el Módulo TI y jerarquía de Roles.

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

### ✅ Módulo 5: Generador de Cotizaciones PDF y Correos
- Procesamiento en backend de archivos Excel (Django + Pandas).
- Generación de PDF dinámicos y membretados mediante motor Platypus (ReportLab).
- Interfaz web dedicada en React (Drag & Drop) para generación y descarga interactiva.
- **Flujo de Envío 1-Click:** Integración con Celery y Redis para envío de correos asíncronos en segundo plano sin congelar UI.
- **Plantillas Dinámicas:** Inyección de textos y asuntos dinámicos desde Base de Datos según Empresa Emisora.
- **Folio y Diseño Premium:** Extracción oculta del folio generado en PDF para nombrar el archivo adjunto y maquetación de correo con tablas HTML premium.

### Módulo 6: Reclutamiento y Selección
Este módulo representa la digitalización completa y avanzada de las herramientas de perfilamiento y seguimiento que previamente se manejaban en Excel, transformándolas en un sistema de grado empresarial con estética 'Corporate Premium'.

**Características Principales:**
- **Wizard de Vacantes:** Interfaz interactiva de 9 pasos para la creación del "Perfilador". Incluye navegación secuencial, validación de campos obligatorios, prevención de envíos dobles, autocompletado y cálculo dinámico de sueldos.
- **Catálogo Inteligente:** Carga automatizada y gestión de una base de datos de 3,675 competencias.
- **Entrevistas Dinámicas:**
  - *Entrevista Inicial:* Sistema de semáforos para respuestas de primer filtro.
  - *Entrevista Profunda:* Cálculos porcentuales de *match* en vivo basados en habilidades, con emisión de dictamen automatizado.
  - *Gestor de Preguntas:* Arquitectura full-stack que permite editar y guardar preguntas por categoría en tiempo real desde la interfaz.
- **Tablero ATS (Applicant Tracking System):** Gestión visual del Pipeline de Candidatos, con selectores de estado (Activas, Cerradas, Canceladas) y vistas optimizadas de documentos legales de solo lectura. Incluye **progresión automática de estatus** (sincronizada con los semáforos de entrevistas) y **Modales Premium** para interacciones críticas (confirmación de veredictos, alertas) reemplazando diálogos nativos.
- **Diseño UI/UX (RecluSystem):** Interfaz estandarizada con la paleta institucional (Azul Claro #96C2DB y Gris Pizarra #1E293B), eliminando colores genéricos y unificando el lenguaje visual en botones, reportes y estados.
- **Generación de Reportes PDF:** Exportación del "Reporte Ejecutivo" del candidato. Convierte tablas complejas en un dossier de formato Consultoría Premium (1-2 hojas limpias) utilizando HTML2PDF con saltos de página inteligentes.
- **Roles y Asignación (RBAC):** Jerarquización de usuarios (Supervisor vs Asistente). El campo `consultor` permite la asignación directa de vacantes y candidatos, blindando la privacidad para que los reclutadores estándar solo vean su propia carga de trabajo.


## PRÓXIMA FASE: Módulo 7 (Comercial)

**Objetivo:** Desarrollar el Tablero CRM (Comercial) para gestionar clientes, seguimiento de prospección, levantamientos de requerimientos, emisión de propuestas económicas y reportes de ventas.



### Paleta de Colores (Módulo Comercial)
- **Color Primario (Acentos, Botones, Sidebar):** Azul Acero (`#5C7E8F`)
- **Fondo Secundario (Hover/Gradientes):** Azul Hielo (`#D4DDE2`)
- **Fondo General:** Blanco Puro (`#FFFFFF`)
- **Grises (Bordes, Textos Secundarios):** Gris Metálico (`#A2A2A2`)


## Documentación del Reclutamiento y Comercial

La documentación específica de cada módulo se encuentra en la carpeta `docs/`.
- [Análisis Excel Reclutamiento](file:///wsl.localhost/Ubuntu/home/sistemas_pm/Proyectos/Sistema-Integral-de-Gestion/docs/reclutamiento/analisis_excel_reclutamiento.md)
- [Biblia del Reclutamiento](file:///wsl.localhost/Ubuntu/home/sistemas_pm/Proyectos/Sistema-Integral-de-Gestion/docs/reclutamiento/biblia_excel_reclutamiento.md)

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
| 2026-07-27 | Módulo de Reclutamiento (Flujo de Candidato) | Se construyó el sistema de Entrevistas (Inicial y Profunda) con cálculos dinámicos de semáforos, porcentajes de match por habilidades y dictamen automatizado. Se desarrolló la exportación a PDF del "Reporte Ejecutivo", convirtiendo tablas tipo Excel en un dossier de formato Consultoría Premium (una o dos hojas limpias) utilizando HTML2PDF con saltos de página inteligentes. |
| 2026-07-30 | Módulo de Reclutamiento (Perfilador UI) | Se transformó el Formulario Perfilador de una página larga a un wizard de 9 pasos con navegación secuencial, validación de campos obligatorios, prevención de envíos accidentales por doble clic o tecla Enter, y se modernizó la paleta de colores y la interfaz de botones a un estilo profesional. |
| 2026-07-31 | Arquitectura de Frontend | Reestructuración completa del frontend implementando un patrón de diseño por Módulos de Negocio. Se agruparon las páginas y componentes en subcarpetas lógicas: `auth`, `pagos`, `cotizador` y `reclutamiento` para asegurar la escalabilidad del proyecto. |
| 2026-07-31 | Módulo de Reclutamiento (Preguntas Dinámicas) | Se construyó la arquitectura Full-Stack para gestionar las Preguntas Iniciales y Profundas de las entrevistas. Se integró una interfaz en React (VistaPreguntas) que consume los endpoints del backend para permitir la edición y guardado en tiempo real en base de datos. |
| 2026-08-04 | Módulo de Reclutamiento (Documento Perfilador y ATS) | Se separó la vista de gestión de vacante en pestañas: Pipeline de Candidatos y Perfilador Reclutamiento. Se construyó el Documento Perfilador de solo lectura, replicando fielmente la estructura legal y comercial del Excel original (Hoja 14), integrado con la paleta de colores institucional. Posteriormente, se optimizó el DocumentoReclutamiento UI para ser más compacto y se refactorizaron 3 componentes pesados de HTML duro a PDFs dinámicos con formato 'Corporate Premium'. Se dejó listo el plan de implementación para el Módulo 7 (Comercial). |
| 2026-08-05 | Separación Comercial-Reclutamiento | Se decidió desligar por completo al Módulo Comercial de la gestión de Vacantes. Reclutamiento asume el control 100% de la creación del Perfilador. Se implementaron filtros dinámicos en el tablero de vacantes (Activas, Cerradas, Canceladas) mejorando el diseño del selector de estados en el Tablero de Vacantes. |
| 2026-08-07 | Trazabilidad y Roles (Módulo Usuarios) | Se integró trazabilidad en `Vacante` mediante `creado_por` asignado automáticamente en el backend vía token. Se aprobó un plan arquitectónico para desarrollar un Módulo TI de Administración de Usuarios y expandir la jerarquía de roles (Supervisor vs Asistente) para el control de asignaciones (RBAC). |
| 2026-08-11 | Arquitectura de Seguridad (RBAC) y Rediseño Premium | Se implementó un estado global con AuthContext para proteger URLs por módulo. Se blindó la privacidad en Django (usuarios estándar solo ven sus vacantes asignadas). Rediseño estético premium de selectores en el Tablero ATS. |
| 2026-08-13 | Módulo TI y Asignación de Vacantes (RBAC) | Se construyó la pantalla VistaUsuarios para administrar cuentas y jerarquías (Supervisores vs Asistentes). Se integró el campo `consultor` en los modelos para asignar vacantes y candidatos a reclutadores específicos, protegiendo las vistas con el AuthContext. |
| 2026-08-13 | Cartera de Candidatos y Refactorización UI | Se implementó el estado 'cartera' en el flujo de reclutamiento con su respectiva `VistaCartera`. Se rediseñaron los selectores de estado a nivel global mediante el componente `SelectorPremium`. Se realizó una depuración masiva de archivos temporales (scripts de pruebas y HTML/JSX sueltos) en backend y frontend. |
| 2026-08-13 | Dockerización (Entorno Local) | Se implementó Docker y Docker Compose para empaquetar Django, React, Redis y Celery, manteniendo SQLite montado como volumen para proteger la información. Se estandarizó el hot-reloading y dependencias. |
| 2026-08-14 | Integración SMTP Corporativo y Celery | Se habilitó el envío de correos asíncronos para el agendamiento de entrevistas. Se configuraron las variables de entorno para usar el SMTP corporativo de cPanel (Puerto 465/587) y se conectó el contenedor de Celery Worker con Redis para despachar las invitaciones sin congelar la pantalla. Se inauguró la carpeta `docs/` como repositorio de documentación técnica. |
| 2026-08-14 | Flujo 1-Click: Reportes y Correo | Se automatizó el envío de Reportes PDF al cliente. Reestructuración de la vista de reportes hacia un formato "Wizard" paso a paso. El Backend decodifica PDFs desde la memoria (Base64), lo delega al Celery Worker para procesamiento en segundo plano y se envían asíncronamente por SMTP usando plantillas HTML "Corporate Premium" a prueba de gestores corporativos. |
| 2026-08-18 | Cotizador Inteligente y Mini-CRM | Módulo Cotizador transformado con BD dinámica (EmpresaEmisora y Cliente). Generación y envío asíncrono de PDFs mediante Celery con plantillas HTML corporativas. Carga masiva de 23 emisoras mediante script. |
| 2026-08-19 | Refactor UI/UX Cotizador y Sidebar | Rediseño completo del flujo del Cotizador hacia un 'Single Action Canvas' centrado. Integración visual del **envío de correos automáticos** (con mapeo de destinatario/remitente) y previsualización de PDF in-browser. Rediseño del Sidebar bloqueado en estado colapsado con integración limpia del logo P&M institucional en caja blanca. |
| 2026-08-20 | Cotizador: Extracción de Folio y UX Premium | Se consolidó la arquitectura de extracción de folios generados internamente en backend (PDF/ReportLab) exponiéndolos al frontend vía Custom Headers HTTP (CORS Expose-Headers) para renombrar descargas y adjuntos. Reestructuración de la plantilla de correo a formato corporativo table-based. |


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
powershell -ExecutionPolicy Bypass -File "C:\Users\Sistemas P&M\wsl_portforward.ps1"
```
El script detecta automáticamente la nueva IP de WSL y reconfigura todo.

## PRÓXIMA FASE: 

1. **Continuar con la IA (Llama 3.1):** Validar en producción la generación de facturas y ajustar el prompt si es necesario.


| 2026-08-26 | Cotizador: Mejoras Finales | Refinamiento de la UX con rediseño CSS Grid de partidas, estandarización de payloads de backend para inyección de datos del cliente, redondeo preciso a 2 decimales, folios secuenciales estables en BBDD, limpieza de Códigos Postales, e incorporación de plantilla HTML corporativa para facturación final a clientes. |
| 2026-08-27 | Arquitectura SaaS (Single-Tenant) | Análisis y adopción de modelo de distribución B2B (Servidores Dedicados). Transplante exitoso de la base de datos central embebida (SQLite) hacia PostgreSQL empresarial montado en Docker, incluyendo refactorización defensiva de Signals de Django e integración en el flujo de orquestación de Compose sin pérdida de datos. |
| 2026-08-28 | Cotizador: Bandejas Divididas, Historial y Clientes Exprés | División de la Bandeja de Cotizaciones en sub-pestañas "Por Enviar" y "Enviadas" con trazabilidad de operadores (Creado Por vs Enviado Por). Resolución del motor de generación oficial de PDFs ReportLab en memoria y despacho Celery en generar_cotizacion_view. Incorporación de sub-pestaña de Historial de Prefacturas con función de carga y restauración en formulario, y desarrollo de modal in-app para registro y asignación instantánea de clientes nuevos o de operación única. |
| 2026-08-31 | Cotizador: Catálogos SAT, Operación Única y Rediseño Responsivo Total | Modularización de Catálogos SAT 4.0 (`CatalogoSat.jsx`) con validación contra plantilla oficial de Excel. Implementación del flujo de 'Operación Única' (en memoria local sin persistir en la tabla Cliente de PostgreSQL) vs 'Cliente Fijo'. Corrección del ciclo de vida de prefacturas: los borradores (`NO_SOLICITADA`) se mantienen en historial sin saturar la Bandeja de Cotizaciones hasta ser formalmente enviadas a Monterrey. Blindaje contra conversiones numéricas vacías (`safe_float`) y resolución de fallos asíncronos en Celery (`enviar_factura_oficial_task`). Transformación total de la interfaz a diseño 100% responsivo para Smartphones, Tablets y Desktop (Mobile Header, Drawer deslizable, grids fluidas y tablas táctiles). |

| 2026-09-01 | Cotizador: Rediseño Premium (Light + Orquídea) y Fintech Badge | Refactorización visual completa de los componentes del cotizador, transicionando de la paleta índigo a un esquema Light limpio con acentos Orquídea (`#C084FC`) y Violeta Profundo (`#9333EA`). Implementación de un "Premium Fintech Badge" responsivo conectado al `AuthContext` para la gestión de perfil y sesión de usuario. Generación de documentación Walkthrough. |

| 2026-09-03 | Inteligencia Artificial (Llama 3.1) | Implementación de hiper-personalización de conceptos de facturación mediante historial de clientes. Ingesta masiva de 2,162 conceptos desde Excel hacia la tabla ConceptoEstrategia. Rediseño de IA modal en React (IAEstrategiaModal.jsx) y sintonización de prompt estricto (Anti-trampas matemáticas) para forzar montos asimétricos exactos y prevenir descripciones vacías o duplicadas. |
| 2026-09-04 | Carga de Clientes, Auditoría y Fallbacks de Descarga | Carga de 69 nuevos clientes desde Excel (clientes_2.xlsx). Auditoría de base de datos completa. Implementación de renderizado condicional en Bandeja de Cotizaciones para permitir 'Generar y Descargar' oficial (bypass de SMTP Celery) cuando el cliente o la empresa emisora carecen de correo, con blindaje transaccional en generar_cotizacion_view. |


## Arquitectura de Folios y Entregabilidad SMTP (Ago 2026)

### Herencia de Folios y Memoria Frontend
Se abandonó el formato genérico de UUIDs. Ahora, la BD controla la generación de folios como `COT-27082026-0001`. El Frontend en React (`FormularioPreFactura.jsx`) almacena un estado de memoria `cotizacionOrigen` que se inyecta en los payloads al enviar a Monterrey. Si la operación es una Prefactura vinculada, hereda el número secuencial exacto de su cotización padre (`PRE-27082026-0001`), y el backend previene clonaciones múltiples reescribiendo la Prefactura si se solicitan correcciones consecutivas.

### Entregabilidad Anti-Spam (Celery)
Para sortear bloqueos de cPanel (SpamAssassin) o Gmail, el módulo de envío de correos asíncrono se reestructuró:
1. **Estructura MIME:** Se usa `MIMEMultipart('mixed')` como contenedor principal, anidando un `MIMEMultipart('alternative')` interno.
2. **Fallback:** Se renderiza el template HTML, se aplica un regex Strip-Tags y se adjunta obligatoriamente un `MIMEText(..., 'plain')` antes del HTML.
3. **Headers Obligatorios:** Inyección nativa de `Message-ID`, `Date` y `Reply-To`.
