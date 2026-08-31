---
tags: [documentación, walkthrough, responsive, mobile, ui-ux, cotizador]
fecha: 2026-08-31
modulo: Cotizador Inteligente y Facturación
---

# Walkthrough: Rediseño Responsivo Total (Móvil, Tablet y Escritorio) en Cotizador

**Fecha:** 2026-08-31  
**Módulo:** Cotizador Inteligente y Facturación  
**Objetivo:** Transformar la experiencia visual y estructural del Cotizador para que sea 100% responsivo, eliminando el desbordamiento en smartphones (iPhone, Android) y pantallas compactas, manteniendo la potencia corporativa en monitores de escritorio.

---

## 1. Problemas Identificados en la Vista Móvil Original
1. **Sidebar lateral permanente:** Ocupaba 80px fijos a la izquierda robando el 25% del ancho de pantalla en celulares (390px).
2. **Padding horizontal excesivo:** Los 60px de margen en cada lado (`120px` en total) estrangulaban el área de tablas y formularios.
3. **Cuadrículas fijas multicolumna:** Filas de conceptos con 5 columnas paralelas que provocaban desbordamiento horizontal y cortes de texto.
4. **Modales con ancho estático:** Dificultad para visualizar campos en pantallas angostas.

---

## 2. Soluciones y Mejoras Implementadas

### 2.1. Navegación Móvil Moderna (`ModuloCotizador.jsx`)
- **Cabecera Móvil Sticky (`cotizador-mobile-header`):**
  - Visible únicamente en resoluciones `< 768px`.
  - Botón de **Menú Hamburguesa**, título del módulo activo y botón rápido para volver al sistema principal.
- **Drawer Deslizable con Backdrop Blur:**
  - Al abrir el menú en el celular, la barra lateral emerge como un panel deslizable (`slideInLeft`) con fondo difuminado y cierre táctil.
- **Ocultamiento Inteligente de la Barra de Escritorio:**
  - En móviles la barra estática izquierda desaparece automáticamente, liberando el 100% del ancho del dispositivo.

### 2.2. Bandeja de Cotizaciones Fluida (`BandejaCotizaciones.jsx`)
- **Filtros y Pestañas Adaptables:** Las sub-pestañas (*Por Enviar* y *Enviadas*) y el buscador se ajustan al ancho de la pantalla sin deformarse.
- **Tablas con Desplazamiento Táctil Nativo:** Se envolvió la tabla en un contenedor con `overflow-x: auto` y `WebkitOverflowScrolling: touch`, permitiendo deslizar las columnas suavemente con el dedo.

### 2.3. Formulario de Prefacturas Responsivo (`FormularioPreFactura.jsx`)
- **Partidas / Conceptos en Cuadrícula Dinámica:**
  - En escritorio: Vista tabular amplia de 4 y 5 columnas.
  - En móviles (`< 768px`): Los campos de cada partida (Clave, Cantidad, Unidad, Descripción, Precio e Importe) se reorganizan automáticamente en filas de 2 y 1 columna touch-friendly.
- **Barra de Totales y Acciones:**
  - En celular se convierte en un bloque vertical espaciado donde los totales se muestran al 100% y los botones de acción (*Descargar Excel*, *Guardar Borrador*, *Enviar a Monterrey*) ocupan todo el ancho con altura táctil (`46px`).
- **Modales Adaptables:**
  - Tanto el modal de *Nuevo Cliente* como el de *Confirmación de Envío a Monterrey* se ajustan al ancho de la pantalla con scroll interno para pantallas pequeñas.

---

## 3. Matriz de Compatibilidad de Pantallas

| Dispositivo | Resolución Típica | Comportamiento |
| :--- | :--- | :--- |
| **Smartphones** | 375px - 430px (iPhone, Galaxy) | Header móvil, Drawer táctil, formularios en 1 columna y tablas con scroll suave. |
| **Tablets** | 768px - 1024px (iPad, Galaxy Tab) | Layout híbrido fluido, modales centrados y controles táctiles cómodos. |
| **Laptops** | 1366px - 1536px | Sidebar colapsable tradicional, espaciado estándar y productividad óptima. |
| **Monitores PC** | 1920x1080 (FHD), 2K, 4K | Máxima amplitud, panel completo y visualización corporativa de alto impacto. |

---

## 4. Enlaces Relacionados (MOCs)

- [[MOC Cotizador Inteligente]]
- [[MOC Arquitectura Frontend]]
- [[MOC Diseño Responsivo y UX]]
