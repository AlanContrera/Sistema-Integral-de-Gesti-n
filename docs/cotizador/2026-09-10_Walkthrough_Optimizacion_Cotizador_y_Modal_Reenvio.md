---
tags: [documentación, walkthrough, refactor, cotizador, ui, ux]
date: 2026-09-10
---

# Optimización de UX/UI en Cotizador, Registro Completo de Clientes y Modal de Reenvío

## 1. Resumen Ejecutivo

Durante esta sesión se llevaron a cabo mejoras clave en la experiencia de usuario, consistencia visual y robustez del flujo de cotizaciones:
1. **Regla de Entrega Quirúrgica en .agents/AGENTS.md**: Se incorporó una directriz estricta para evitar la entrega de archivos completos cuando se soliciten cambios puntuales, previniendo regresiones de código.
2. **Navegación y Tooltips en ModuloCotizador.jsx**: Se reorganizó el menú principal para priorizar **Prefactura Web** como primera opción activa por defecto y se restablecieron los tooltips emergentes en el sidebar colapsado.
3. **Registro Integral de Clientes en FormularioPreFactura.jsx**: Se rediseñó el modal de creación de clientes agrupando los datos en 3 secciones limpias (Fiscal, Domicilio y Contacto), distribuyendo el domicilio en una fila de 3 columnas (Colonia, Municipio / Ciudad, Estado) para eliminar espacio ocioso y scroll vertical. Además, se flexibilizó el campo de correo para que sea opcional.
4. **Modal Personalizado de Reenvío en BandejaCotizaciones.jsx**: Se sustituyó el cuadro nativo window.prompt del navegador por un modal nativo de React alineado al diseño del sistema.
5. **Regeneración y Persistencia Automática de PDF en Backend (iews.py)**: Se solventó el error de archivos PDF no encontrados en disco, asegurando que las cotizaciones web guarden su archivo físico en el modelo y que el endpoint de reenvío sea capaz de regenerar el PDF al vuelo a partir de datos_formulario.

---

## 2. Cambios Implementados

### 2.1. Navegación y Estilos (ModuloCotizador.jsx)
- **Pestaña Inicial Predeterminada**: Si no existe pestaña previa en localStorage, la pestaña activa se inicializa en 'llenado_web'.
- **Reordenamiento de Menú**: Prefactura Web ahora encabeza el listado de opciones tanto en el Sidebar de escritorio como en el Drawer móvil.
- **Tooltips CSS**: Se restauraron los pseudo-elementos .sidebar-collapsed .sidebar-btn::after y ::before para mostrar el nombre del módulo al pasar el cursor sobre los iconos colapsados.

### 2.2. Modal de Nuevo Cliente (FormularioPreFactura.jsx)
- **Estructuración en 3 Bloques**:
  - **Identificación y Datos Fiscales**: Razón Social, RFC, Código Postal, Régimen Fiscal y Uso de CFDI.
  - **Domicilio Fiscal (Opcional)**: Calle y Número (ancho completo) y sub-grid compacto de 3 columnas para Colonia, Municipio/Ciudad y Estado.
  - **Contacto y Envíos (Opcional)**: Correo Principal y Correos en Copia (CC).
- **Correo Opcional**: Se retiraron las validaciones forzosas en Frontend (equired y validación de formulario) y se adaptó ClienteSerializer en el Backend con extra_kwargs para permitir valores nulos o en blanco.

### 2.3. Modal de Reenvío de Cotizaciones (BandejaCotizaciones.jsx)
- Se eliminó el uso de window.prompt.
- Se introdujo un modal flotante con desenfoque de fondo (ackdropFilter: 'blur(8px)'), resumen del folio, datos del destinatario original, input con icono de correo y retroalimentación reactiva con Loader2 y 	oast.

### 2.4. Robustez en Backend (iews.py)
- **generar_cotizacion_view**: Ahora guarda físicamente el contenido binario del PDF generado en cotizacion_hija.pdf_factura mediante ContentFile.
- **eenviar_cotizacion_view**: En lugar de responder con error 400 cuando el PDF físico no se encuentra en disco, comprueba si existen los datos_formulario de la cotización, regenera el Excel y PDF en memoria al vuelo, lo almacena físicamente y despacha el correo mediante Celery.

---

## 3. Enlaces Relacionados
- [[MOC Cotizador]]
- [[2026-08-28_Walkthrough_Bandejas_Historial_y_Clientes]]
- [[2026-09-09_Walkthrough_Generador_Excel_Bandeja_y_Reenvio]]
