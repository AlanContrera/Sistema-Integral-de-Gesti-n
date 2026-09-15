---
tags: [documentación, walkthrough, refactor, cotizador, ui, ux, arquitectura]
date: 2026-09-15
---

# Auditoría y Diagnóstico Integral de UI/UX: Módulo Cotizador y Facturación

## 1. Resumen Ejecutivo

El presente documento expone una auditoría técnica y de diseño heurístico sobre el **Módulo Cotizador y Facturación Empresarial** del *Sistema Integral de Gestión (P&M)*. Tras una inspección del código fuente (`ModuloCotizador.jsx`, `BandejaCotizaciones.jsx`, `FormularioPreFactura.jsx`, `BandejaAprobacion.jsx`, `GenerarCotizacionExcelModal.jsx`, `GestorMembretadas.jsx`), de la documentación histórica en `docs/cotizador/` y de los lineamientos en `.agents/AGENTS.md`, se identifican fricciones críticas en:
1. **Disonancia Cromática y de Marca**: Aislamiento del módulo en una paleta morada/orquídea oscura (`#1C1335`, `#9333EA`, `#C084FC`) ajena a la identidad corporativa P&M (`#0B4A7A`, `#1A9BD7`, `#F4F7F9`).
2. **Arquitectura de Información Redundante**: Duplicación de historiales y fragmentación de estados entre pestañas que confunden al operador.
3. **Ergonomía y Layout Inconsistente**: Anidamiento excesivo de paddings ("doble canvas"), cabeceras con etiquetas vacías y una barra de totales con posición absoluta falsa en lugar de un `sticky` funcional.
4. **Densidad de Captura en Partidas**: Sobredimensión vertical en la captura de conceptos fiscales (180px por partida), obligando a scroll continuo.

---

## 2. Diagnóstico Heurístico Detallado

### 2.1. Cromática, Tipografía e Identidad de Marca (Brand Dissonance)
- **Aislamiento Estilístico**: Mientras que el núcleo del sistema y su archivo base (`frontend/src/index.css`) definen un tema limpio y corporativo basado en el Azul Marino P&M (`#0B4A7A`), Celeste P&M (`#1A9BD7`) y fondos neutros (`#F4F7F9`), el Cotizador adoptó colores púrpuras/orquídeas profundos (`#1C1335`, `#9333EA`, `#7E22CE`). Esto genera la sensación de estar en una aplicación externa y desentonada.
- **Inconsistencia en Badges de Estado**: En `BandejaCotizaciones.jsx` (línea 506), el badge de estatus utiliza fondo menta `#ECFDF5` con texto morado `#9333EA` junto al icono `CheckCircle2`. Esta combinación rompe los estándares de accesibilidad cromática y coherencia semántica.
- **Doble Tipografía**: `index.css` define globalmente Google Font `'Outfit'`. No obstante, tanto `BandejaCotizaciones.jsx` como `FormularioPreFactura.jsx` fuerzan en sus estilos en línea `fontFamily: "'Inter', sans-serif"`, lo que fragmenta la tipografía de títulos, botones y números.

### 2.2. Arquitectura de Información y Rutas de Navegación (IA)
- **El Dilema del Historial Duplicado**:
  - En `FormularioPreFactura.jsx` existe la subpestaña **"Historial de Prefacturas"** (consulta `/api/cotizador/listar-prefacturas/`).
  - En `BandejaCotizaciones.jsx` existe la subpestaña **"Por Enviar"** (consulta `/api/cotizador/listar-prefacturas/?estado=por_enviar`) y **"Enviadas"** (consulta `/api/cotizador/listar-prefacturas/?estado=enviadas`).
  - *Impacto UX*: El usuario se pregunta constantemente: "¿Dónde encuentro la cotización que acabo de hacer?". Si va a "Prefactura -> Historial" ve unas acciones (Cargar/Editar y Descargar Excel); si va a "Cotizaciones -> Por Enviar" ve otras (Generar y Enviar / Generar y Descargar). Esta separación fragmenta el modelo mental.
- **"Generar desde Excel" como Acción de Segundo Nivel**:
  - La importación y análisis de archivos Excel es uno de los flujos de mayor valor operativo. Actualmente se encuentra oculto como un botón secundario dentro de la pestaña `BandejaCotizaciones.jsx`, obligando al usuario a entrar a Cotizaciones para subir un Excel.

### 2.3. Layout, Jerarquía Espacial y Ergonomía
- **Efecto "Doble Canvas" (Double Padding)**:
  - El contenedor raíz `.cotizador-main-content` en `ModuloCotizador.jsx` tiene un padding de `48px 60px`.
  - Componentes hijos como `BandejaAprobacion.jsx` añaden su propio contenedor con `padding: '40px'` y `minHeight: '100vh'`, o `FormularioPreFactura.jsx` con `padding: '32px'` y borde. Esto satura la pantalla de marcos dentro de marcos y genera barras de desplazamiento vertical duplicadas.
- **Etiquetas Vacías (Phantom Spacing)**:
  - En `BandejaCotizaciones.jsx`: `<h1 style={{ ... }}></h1>` y `<p style={{ ... }}></p>` se encuentran vacíos en el DOM, consumiendo `24px` de margen inferior innecesario.
  - En `BandejaAprobacion.jsx`: Ocurre exactamente lo mismo con un `<h1>` y `<p>` vacíos que empujan el contenido `32px` hacia abajo.
- **Sidebar Bloqueado**:
  - El menú lateral está fijado en un ancho mínimo colapsado (`90px`) sin opción de expansión persistente en escritorio. Los usuarios deben adivinar los 4 iconos o esperar a que el tooltip CSS emerja en hover.

### 2.4. Ergonomía del Formulario de Captura (`FormularioPreFactura.jsx`)
- **Falsa Barra Sticky de Totales**:
  - La barra inferior de totales y despacho (`stickyBar`) está configurada con `position: 'absolute'; bottom: '0'` dentro de un contenedor relativo. Por ende, **no flota sobre la pantalla**. Si el usuario agrega 3 o 4 partidas, los botones de "Guardar", "Solicitar Factura" y los totales quedan enterrados al final de la página. El usuario pierde visibilidad del monto total mientras captura.
- **Densidad Vertical Desmesurada en Partidas**:
  - Cada partida ocupa dos filas en grid (Clave, Cantidad, Unidad en la primera; Descripción, Conceptos Sugeridos, Impuestos, Precio e Importe en la segunda), requiriendo cerca de `180px` de altura por concepto. Capturar una cotización de 5 conceptos requiere un scroll de casi `1,000px`.
- **Configuración Fiscal Oculta sin Resumen**:
  - El bloque de Configuración Fiscal se despliega en acordeón. Cuando está cerrado, no ofrece un resumen visual ("chips") de los parámetros vigentes (ej. PUE, 03 - Transferencia, G03 - Gastos), lo que obliga al usuario a abrirlo por precaución para verificar que los datos fiscales sean correctos.

### 2.5. Tablas y Modales
- **Botones de Acción Indistinguibles**:
  - En las tablas de Enviadas y Llegadas, las acciones (Ojo para preview, Descarga directa, Reenvío o Aprobación) se agrupan en pequeños cuadros de 36px en tonos grises o morados muy similares, elevando el riesgo de clics erróneos.
- **Inconsistencia en Modales**:
  - Los 4 modales (`GenerarCotizacionExcelModal`, `CatalogoConceptosModal`, `ModalNuevoCliente`, modal de reenvío) varían en radios de curvatura (16px, 20px, 24px), estilos de cabecera y paddings.

---

## 3. Matriz Comparativa: Estado Actual vs Propuesta de Rediseño

| Dimensión | Estado Actual | Propuesta de Rediseño Premium |
| :--- | :--- | :--- |
| **Paleta Cromática** | Morado/Orquídea oscuro (`#1C1335`, `#9333EA`) | Azul Corporativo P&M FinTech (`#0B4A7A`, `#1A9BD7`, `#F4F7F9`) |
| **Tipografía** | Mezcla de `'Inter'` y `'Outfit'` | `'Outfit'` estandarizado en toda la suite |
| **Navegación** | Sidebar colapsado forzado (90px) con tooltips | Sidebar refinado con toggle o modo híbrido limpio con micro-labels |
| **Canvas** | Padding anidado (48px + 40px) y títulos vacíos | Canvas único sin doble borde, títulos descriptivos y breadcrumb |
| **Barra de Totales** | `position: absolute` (oculta al hacer scroll) | `position: sticky; bottom: 20px` flotante con efecto cristal |
| **Captura de Partidas** | 2 filas gigantes por partida (~180px alto) | Rejilla Contable Compacta de 1 sola fila por partida (~54px) |
| **Historiales** | Duplicados entre Prefactura y Cotizaciones | Unificados en Bandeja Maestra con filtros por estado |
| **Carga de Excel** | Botón oculto dentro de Cotizaciones | Acceso visible de 1-Clic o switch en vista de Emisión |

---

## 4. Hoja de Ruta de Implementación Propuesta

### Fase 1: Unificación de Marca y Saneamiento de Layout (Quick Wins)
1. **Armonización Cromática**: Migrar las constantes de color del módulo hacia la paleta institucional P&M:
   - Primario: `#0B4A7A`
   - Acento/Interactivo: `#1A9BD7` y `#0284C7`
   - Superficies: `#FFFFFF` y `#F8FAFC`
   - Sidebar: Blanco corporativo o Azul Profundo con contraste AAA.
2. **Limpieza de DOM y Paddings**: Eliminar los `<h1>` y `<p>` vacíos de `BandejaCotizaciones` y `BandejaAprobacion`. Estandarizar el padding del canvas principal a un único contenedor fluido.
3. **Estandarización Tipográfica**: Retirar los `fontFamily: 'Inter'` forzados para heredar `'Outfit'` de forma consistente.

### Fase 2: Ergonomía del Formulario de Prefactura
1. **Barra Flotante Sticky Real**: Convertir `stickyBar` a `position: sticky; bottom: 24px; z-index: 30; backdrop-filter: blur(12px)` para que el total y los botones de acción ("Guardar", "Solicitar Factura") permanezcan visibles en todo momento.
2. **Rejilla Contable de Partidas (Single-Row Grid)**:
   - Rediseñar cada partida en una sola fila estructurada:
     `[ Clave SAT | Cant | Unidad | Descripción + Sugerencias | P. Unitario | IVA (16%) | Importe | Eliminar ]`
   - Ahorro del 65% de espacio vertical.
3. **Chips de Resumen Fiscal**: Mostrar etiquetas compactas en el encabezado del acordeón fiscal cuando esté cerrado (ej: `[PUE]` `[03 - Transferencia]` `[G03 - Gastos en general]`).

### Fase 3: Reestructuración de la Arquitectura de Información
1. **Fusión de Historiales**: Consolidar la visualización de cotizaciones en `BandejaCotizaciones`:
   - Subpestaña 1: **Borradores / Por Enviar** (con acciones de Cargar/Editar, Generar y Enviar).
   - Subpestaña 2: **Emitidas / Enviadas** (con Reenvío, Descarga y Vista Previa).
2. **Acceso Protagónico a Generar desde Excel**: Exponer un selector de método de entrada en la vista de emisión: "Captura Manual en Línea" o "Cargar Plantilla Excel".

---

## 5. Enlaces Relacionados
- [[MOC Cotizador]]
- [[2026-09-10_Walkthrough_Optimizacion_Cotizador_y_Modal_Reenvio]]
- [[2026-09-07_Walkthrough_Rediseño_Bandeja_Aprobacion]]
- [[2026-08-31_Walkthrough_Diseno_Responsivo_Cotizador]]
