---
tags: [documentación, walkthrough, refactor, cotizador, ui, ux, layout, web-interface-guidelines]
date: 2026-09-15
---

# Auditoría Técnica y Diagnóstico de UI/UX y Layout: Módulo Cotizador (Independiente)

> [!NOTE]
> **Premisa Arquitectónica**: El Módulo Cotizador y Facturación es un sistema desacoplado e independiente de la identidad corporativa de P&M. Requiere su propio lenguaje visual, ergonomía y arquitectura de diseño SaaS FinTech de clase mundial, sin subordinarse a marcas externas.

Este diagnóstico aplica formalmente las **Web Interface Guidelines** (Vercel Skills: Accesibilidad, Focus States, Formularios, Layout, Tipografía, Animación y Performance) sobre los componentes del Cotizador:
- `ModuloCotizador.jsx` (Shell, Layout raíz, Sidebar, Header y Rutas)
- `FormularioPreFactura.jsx` (Captura de emisión, Partidas, Totales y Modal Cliente)
- `BandejaCotizaciones.jsx` (Listados de cotizaciones, Subpestañas, Acciones y Modal Reenvío)
- `BandejaAprobacion.jsx` (Bandeja de facturas Monterrey y Descarga ZIP)
- `GenerarCotizacionExcelModal.jsx` (Importador modal de matrices Excel)
- `GestorMembretadas.jsx` (Repositorio de activos PDF)

---

## 1. Hallazgos por Regla de Web Interface Guidelines

### 1.1. Accesibilidad (A11y)
- **`BandejaCotizaciones.jsx:522-540`**: Los botones de acción de fila (Vista previa, Descarga, Reenvío) son botones con solo icono (`<Eye />`, `<Download />`, `<Send />`). Tienen atributo `title`, pero carecen de `aria-label`. Los lectores de pantalla no anuncian su propósito.
- **`ModuloCotizador.jsx:50-85`**: En el Sidebar colapsado (`isSidebarOpen: false`), los 4 botones de navegación renderizan solo el icono. Carecen de `aria-label`; dependen exclusivamente de un pseudo-elemento CSS `data-tooltip`, inaccesible para navegación por teclado o tecnologías asistivas.
- **`FormularioPreFactura.jsx:625-820`**:
  - Los campos de entrada (`<input>`, `<select>`) no tienen `id` asignado y los `<label>` no tienen `htmlFor`. No existe asociación programática entre etiqueta y control.
  - El buscador de clientes utiliza un `<div>` interactivo con `onClick` (`resultItem`) sin roles ARIA (`role="option"` o `role="button"`), sin `tabIndex={0}` y sin manejador `onKeyDown` para navegar con flechas del teclado.
- **`BandejaCotizaciones.jsx:207-210` y `BandejaAprobacion.jsx:120-121`**: Existen etiquetas `<h1></h1>` y `<p></p>` vacías en el DOM. Violan la jerarquía semántica de encabezados.

### 1.2. Focus States y Navegación por Teclado
- **`FormularioPreFactura.jsx:529-531`**: Los inputs tienen `outline: 'none'` hardcodeado en sus estilos en línea sin ninguna alternativa de `:focus-visible` o anillo de foco (`focus-visible:ring`). Al navegar con `Tab`, el usuario pierde completamente el indicador de foco.
- **`ModuloCotizador.jsx:95-130`**: El menú de perfil de usuario se abre mediante click, pero carece de atributos `aria-haspopup="menu"`, `aria-expanded` y no se cierra al presionar la tecla `Escape`.

### 1.3. Formularios y Captura de Datos
- **`FormularioPreFactura.jsx:625-780`**:
  - Ningún input tiene `name` ni `autoComplete="off"`. Los navegadores intentan autocompletar campos como "Clave Prod Serv", "Unidad" o "Colonia" con datos personales del usuario.
  - Los campos de correo no tienen `spellCheck={false}`.
  - Los placeholders usan tres puntos estándar `...` en lugar del caracter tipográfico elipsis `…`.
  - La validación es puramente por Toast flotante (`toast.error`) en lugar de mensajes de error inline adyacentes a cada campo con foco automático en el primer error.

### 1.4. Tipografía y Datos Numéricos
- **Carencia de `tabular-nums`**: En [FormularioPreFactura.jsx:536-537](file:///Ubuntu/home/sistemas_pm/Proyectos/Sistema-Integral-de-Gestion/frontend/src/components/cotizador/FormularioPreFactura.jsx#L536-L537) y [BandejaCotizaciones.jsx:500-515](file:///Ubuntu/home/sistemas_pm/Proyectos/Sistema-Integral-de-Gestion/frontend/src/components/cotizador/BandejaCotizaciones.jsx#L500-L515), los montos monetarios (`$12,450.00`) no utilizan `font-variant-numeric: tabular-nums`. Los dígitos tienen anchos variables, provocando temblores visuales al actualizar cálculos y desalineación vertical en columnas numéricas.
- **Fragmentación de Fuente**: En `BandejaCotizaciones.jsx` y `FormularioPreFactura.jsx` se declara `fontFamily: "'Inter', sans-serif"`, mientras que `ModuloCotizador.jsx` y `BandejaAprobacion.jsx` importan `'Outfit'` y `'Plus Jakarta Sans'`.

### 1.5. Animaciones y Transiciones
- **Anti-patrón `transition: all`**: Se detectó `transition: 'all 0.2s'` en más de 15 botones y contenedores (`ModuloCotizador.jsx:60`, `FormularioPreFactura.jsx:525`, `BandejaCotizaciones.jsx:225`). Esto fuerza al navegador a recalcular propiedades pesadas como layout y pintura en cada hover. Debe restringirse explícitamente a `transform`, `opacity`, `background-color` y `border-color`.
- **Falta de `prefers-reduced-motion`**: Las animaciones `@keyframes fadeIn`, `@keyframes slideDown` y `@keyframes slideUp` no respetan la preferencia de reducción de movimiento del sistema operativo.

---

## 2. Diagnóstico del Layout: Fricciones Espaciales y Estructurales

### 2.1. El Problema del "Canvas Anidado" (Doble Padding y Scrollbars Fantasma)
El shell principal (`ModuloCotizador.jsx:245`) aplica:
```css
.cotizador-main-content {
  padding: 48px 60px;
}
```
Y cada componente hijo agrega su propio contenedor masivo:
- `BandejaAprobacion.jsx:116`: Envuelve todo en `padding: '40px'`, `background: '#F8FAFC'` y `minHeight: '100vh'`, restringido a un `maxWidth: '1200px'` centrado.
- `FormularioPreFactura.jsx:519`: Envuelve la vista en `mainWrapper` con `padding: '32px'`, `borderRadius: '24px'` y `border: '1px solid #E2E8F0'`.
- `GestorMembretadas.jsx`: Envuelve en tarjeta blanca con `padding: '40px'` y `borderRadius: '24px'`.
- `BandejaCotizaciones.jsx`: No tiene tarjeta, flota directamente en el fondo.

**Consecuencia**:
1. Al cambiar de pestaña entre Cotizaciones, Aprobación y Prefactura, el ancho del contenido "salta" bruscamente (de 100% fluido a 1200px fijo).
2. Se generan márgenes de hasta `100px` en pantallas de laptop (1366x768 o 1440x900), comprimiendo la zona útil de trabajo.
3. Se produce scroll vertical doble cuando la altura supera el viewport.

### 2.2. La Falsa Barra Sticky de Totales (`FormularioPreFactura.jsx`)
En `styles.stickyBar` (línea 532):
```javascript
stickyBar: {
  position: 'absolute',
  bottom: '0',
  left: '0',
  right: '0',
  // ...
}
```
Al estar contenida dentro de `mainWrapper` con `position: 'relative'`, la barra **no flota sobre la pantalla**. Se posiciona al final absoluto del contenedor DOM.
Si el usuario añade 3 o más partidas, los totales ($ Subtotal, IVA, Total) y los botones críticos ("Guardar", "Solicitar Factura") quedan **enterrados fuera de la vista**. El operador debe hacer scroll continuo hacia abajo para consultar el total y volver a subir para editar campos.

### 2.3. Densidad Vertical Crítica en Partidas (Captura Ineficiente)
Cada partida en `FormularioPreFactura.jsx` (líneas 787-806) está construida en **dos renglones en grid desproporcionados**:
- **Renglón 1 (80px)**: Clave Prod Serv, Cantidad, Clave Unidad, Unidad.
- **Renglón 2 (100px)**: Descripción (multilínea), Conceptos sugeridos, Impuesto (fijo 16%), Valor Unitario, Importe y botón Eliminar.

Una sola partida ocupa **~180px de altura vertical**. Una cotización estándar de 5 conceptos consume más de **900px únicamente en partidas**, empujando la pantalla y destruyendo la visión holística del documento.

### 2.4. Sidebar Colapsado Forzado y Asimétrico
- El sidebar está bloqueado en `width: 90px`. No existe botón de hamburguesa ni toggle en escritorio para expandirlo.
- En pantallas grandes (1920x1080 o 2560x1440), dejar un sidebar de 90px con 4 iconos aislados desaprovecha el espacio y reduce la ergonomía visual.

---

## 3. Diagnóstico de la Paleta Cromática: La Saturación Púrpura

Al no tener vínculo con P&M, el cotizador tiene total libertad creativa. Sin embargo, su paleta actual sufre de **Sobresaturación Monocromática**:
1. **Fondo Sidebar**: `#1C1335` (Berenjena casi negro de alto peso visual).
2. **Color Interactivo Primario**: `#9333EA` (Púrpura intenso eléctrico).
3. **Color Hover / Bordes**: `#C084FC`, `#DDD6FE`, `#FAF5FF`.
4. **Badges y Acentos**: `#A855F7`, `#7E22CE`.

**El problema de diseño**:
El púrpura se utiliza indiscriminadamente para:
- El menú lateral y los botones activos.
- Los botones de acción primaria ("Solicitar Factura", "Generar desde Excel").
- Los iconos informativos (Calendario, Edificio, Documento).
- Los badges de éxito (mezclado con verde menta `#ECFDF5`).
- Los bordes de input en foco y zonas de drag-and-drop.

Al teñir todos los elementos con la misma familia cromática, **se anula la jerarquía visual**. El ojo del operador no distingue qué es una acción primaria crítica, qué es un estado informativo y qué es un dato secundario.

---

## 4. Propuesta de Rediseño Integral (Layout, Colores y Ergonomía FinTech)

### 4.1. Nueva Paleta SaaS FinTech (Elegante, Neutra y de Alto Contraste)
Para un sistema de facturación y cotizaciones autónomo, se recomienda un esquema inspirado en la banca corporativa moderna y herramientas financieras de alta gama (estilo Stripe Invoicing / Ramp):

- **Neutros Dominantes (90% de la UI)**:
  - Fondo de Aplicación: `#F8FAFC` (Slate 50 / Slate 100 suave).
  - Superficies y Tarjetas: `#FFFFFF` con bordes sutiles `#E2E8F0` y sombras difusas (`0 1px 3px rgba(0,0,0,0.04)`).
  - Texto Principal: `#0F172A` (Slate 900, máxima legibilidad).
  - Texto Secundario / Labels: `#64748B` (Slate 500).
- **Acento Primario (Acción y Jerarquía)**:
  - **Índigo / Deep Slate**: `#4F46E5` (Indigo 600) con hover `#4338CA` o **Zafiro Ejecutivo** `#1E40AF` / `#2563EB`. Aporta sobriedad contable, máxima confianza y contraste WCAG AAA sobre blanco.
- **Semántica Funcional Estricta**:
  - **Éxito / Enviada / Timbrada**: Fondo `#ECFDF5`, borde `#A7F3D0`, texto `#047857`.
  - **Pendiente / Borrador**: Fondo `#FFFBEB`, borde `#FDE68A`, texto `#B45309`.
  - **Alerta / Sin Correo**: Fondo `#FEF2F2`, borde `#FECACA`, texto `#B91C1C`.

### 4.2. Rediseño del Layout (Estructura Unificada)
1. **Canvas Único sin Anidamiento**:
   - `ModuloCotizador.jsx`: Padding uniforme y responsivo de `24px 32px` (máximo `1400px` centrado o fluido).
   - Eliminar `padding: '40px'` y `minHeight: '100vh'` dentro de `BandejaAprobacion.jsx` y `FormularioPreFactura.jsx`. Todos los componentes hijos ocupan el 100% del canvas sin marcos redundantes.
2. **Eliminación de Nodos Vacíos**: Retirar definitivamente los tags `<h1></h1>` y `<p></p>` huérfanos.
3. **Sidebar Híbrido Dinámico**:
   - Sidebar colapsable con toggle (`240px` expandido / `80px` colapsado) o barra lateral flotante limpia con etiquetas textuales integradas debajo del icono (estilo Dashboard moderno).

### 4.3. Rejilla Contable Compacta de Partidas (1 Sola Fila por Concepto)
Transformar la captura de partidas en una **Rejilla Tabular Contable**:
```
+-------------------------------------------------------------------------------------------------------------------------+
| Clave SAT   | Cant | Unidad | Descripción del Concepto (con Asistente)      | P. Unitario | IVA     | Importe   | Acción |
|-------------+------+--------+-----------------------------------------------+-------------+---------+-----------+--------|
| [ 84111500] | [ 1] | [E48 ] | [ Servicios de Consultoría Empresarial      ] | [$5,000.00] | 16% IVA | $5,000.00 |  [Trash]
+-------------------------------------------------------------------------------------------------------------------------+
```
- **Altura por partida**: Se reduce de `180px` a `52px` (70% de ahorro de espacio).
- **Alineación Contable**: Claves a la izquierda, textos descriptivos fluidos con `min-w-0`, montos numéricos a la derecha con `tabular-nums`.

### 4.4. Barra de Totales Sticky Real Flotante (Glassmorphism)
Configurar la barra de totales y despacho con:
```css
position: sticky;
bottom: 20px;
z-index: 30;
background: rgba(255, 255, 255, 0.92);
backdrop-filter: blur(12px);
border: 1px solid #E2E8F0;
border-radius: 16px;
box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04);
```
- **Resultado**: Los totales y los botones "Guardar" y "Solicitar Factura" flotan sobre la vista permanentemente, acompañando al usuario durante todo el flujo de captura.

### 4.5. Consolidación de Historiales y Acceso a Excel
- **Pestaña 1: Emisión**: Toggle superior `[ Formulario Web | Importar Matriz Excel ]`. Si el usuario elige Excel, se despliega la carga directamente en el lienzo sin necesidad de abrir un modal dentro de otra pestaña.
- **Pestaña 2: Bandeja de Cotizaciones**: Centraliza todo el ciclo de vida (Borradores / Por Enviar / Enviadas con reenvío y descarga).
- **Pestaña 3: Facturas Monterrey**: Aprobación y descarga ZIP.
- **Pestaña 4: Plantillas Membretadas**: Repositorio.

---

## 5. Matriz de Cumplimiento de Guidelines

| Área | Estado Actual | Estado Propuesto (Web Guidelines) |
| :--- | :--- | :--- |
| **A11y** | Botones de icono sin `aria-label`, labels sin `htmlFor` | `aria-label` en todos los iconos, labels asociados por `id` |
| **Focus** | `outline: none` sin indicador visual | Anillo de foco accesible `:focus-visible:ring-2 ring-indigo-500` |
| **Formularios** | Sin `autocomplete="off"`, placeholders con `...` | `autocomplete="off"`, `spellCheck={false}`, elipsis `…` |
| **Tipografía** | Mezcla de fuentes, montos sin alineación numérica | Fuente unificada, `tabular-nums` en subtotales y totales |
| **Animación** | `transition: all 0.2s` en múltiples nodos | Transición explícita de propiedades, `@media (prefers-reduced-motion)` |
| **Layout** | Canvas anidado, padding 60px+40px, falsa barra sticky | Canvas único fluido, barra sticky real flotante, 1 fila por partida |
| **Cromática** | Saturación de púrpura (`#1C1335`, `#9333EA`) | Paleta FinTech neutra (`#F8FAFC`, `#0F172A`, acento `#4F46E5` / `#2563EB`) |

---

## 6. Enlaces Relacionados
- [[MOC Cotizador]]
- [[2026-09-10_Walkthrough_Optimizacion_Cotizador_y_Modal_Reenvio]]
- [[2026-09-07_Walkthrough_Rediseño_Bandeja_Aprobacion]]
