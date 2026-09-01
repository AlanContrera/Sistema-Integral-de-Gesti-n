---
tags: [documentación, walkthrough, refactor, ui, cotizador]
fecha: 2026-09-01
---

# Rediseño Visual del Módulo Cotizador (Light + Orquídea)

> [!NOTE]
> Este walkthrough documenta la refactorización visual completa del Módulo Cotizador, transicionando de la paleta índigo original a un esquema Light limpio con acentos Orquídea y tonos complementarios.

## Resumen de Cambios

Se aplicó un rediseño radical manteniendo un fondo blanco/claro (Light) pero inyectando una paleta de colores cuidadosamente seleccionada para garantizar contraste, jerarquía visual y una estética premium.

### Paleta de Colores Implementada

En lugar de usar un solo color (lo cual saturaría la vista), se diseñó una rampa de tonos violetas y ciruelas:

- **Fondo Base:** `#F8FAFC` (Gris azulado muy claro)
- **Fondo Superficies (Cards):** `#FFFFFF` (Blanco puro)
- **Sidebar & Texto Principal:** `#1C1335` (Ciruela profundo, reemplaza al `#1E1B4B`)
- **Acento Primario (Botones, Highlights):** `#C084FC` (Orquídea puro)
- **Acento Fuerte (Botones primarios, Hovers fuertes):** `#9333EA` (Violeta profundo)
- **Acento Suave (Fondos de estados activos, inputs):** `#F3E8FF` (Violeta muy claro)
- **Bordes Activos:** `#DDD6FE` (Lila suave)
- **Texto Secundario:** `#64748B` (Slate gris)

### Archivos Modificados

1. `frontend/src/pages/cotizador/ModuloCotizador.jsx`
   - Revertido el intento de "Dark Glassmorphic" hacia una estética Light pulida y profesional.
   - Implementada la jerarquía de botones (Botón Primario violeta fuerte `#9333EA`, Botón Secundario lila `#F3E8FF`).
   - Sombreados ajustados con opacidades sutiles de violeta (`rgba(147, 51, 234, 0.12)`).

2. **Componentes Hijos Migrados:**
   - `BandejaAprobacion.jsx`
   - `BandejaCotizaciones.jsx`
   - `FormularioPreFactura.jsx`
   - `GestorMembretadas.jsx`
   *Se ejecutó un script de migración masiva (Python Regex Replace) para mapear todos los antiguos códigos Hex índigo (`#4F46E5`, `#312E81`, `#6366F1`) a la nueva paleta de Orquídea y Violeta Profundo sin afectar la lógica del negocio.*

## Enlaces Relacionados
- [[Modulo Cotizador MOC]]
- [[Design System]]
