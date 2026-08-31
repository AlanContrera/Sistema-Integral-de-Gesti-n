# Walkthrough: Bandejas Sub-divididas, Historial de Prefacturas y Registro Expres de Clientes

**Fecha:** 2026-08-28  
**Modulo:** Cotizador Inteligente y Facturacion  
**Objetivo:** Separar las cotizaciones por enviar de las enviadas con trazabilidad de usuarios, crear el historial navegable y recuperable de prefacturas, y habilitar la captura in-app de clientes nuevos o de operacion unica.

---

## 1. Resumen Ejecutivo

Durante esta sesion de trabajo se implementaron tres arquitecturas clave para el modulo de cotizaciones y facturacion:

1. **Bandeja de Cotizaciones Dividida (Por Enviar vs. Enviadas):**
   - Se crearon dos sub-pestanas independientes en la bandeja principal de cotizaciones.
   - **Por Enviar:** Muestra las prefacturas registradas en espera de ser convertidas en cotizaciones oficiales y enviadas por correo. Destaca la columna **Creado Por** (quien realizo la prefactura) y proporciona el boton de accion rapida *Generar y Enviar*.
   - **Enviadas:** Muestra las cotizaciones oficiales formalmente emitidas y enviadas por correo al cliente. Destaca la columna **Enviado Por** (el usuario autenticado que despacho la cotizacion) junto con el folio oficial COT-... y su enlace de origen a la prefactura previa.

2. **Correccion del Motor de Generacion Oficial y Despacho Asincrono:**
   - Se soluciono el error generar_cotizacion_pdf is not defined en ackend/apps/cotizador/views.py.
   - Se conecto la generacion de PDF oficial en memoria utilizando ReportLab (GenerarCotizacionView.as_view() con RequestFactory) a partir de la estructura clonada de la prefactura.
   - Se orquesto el envio asincrono via Celery utilizando enviar_cotizacion_task.delay(...).
   - Se automatizo la transicion de estado marcando prefactura.cotizacion_enviada = True, asegurando que el registro desaparezca de *Por Enviar* y aparezca de inmediato en *Enviadas*.

3. **Historial de Prefacturas y Restauracion en Formulario:**
   - En FormularioPreFactura.jsx, se introdujo un sistema de sub-pestanas: *Llenado de Prefactura* e *Historial de Prefacturas*.
   - La pestana de Historial ofrece un inventario de todas las prefacturas guardadas en base de datos, con buscador interactivo, estado del tramite (Borrador, Enviada a MTY, etc.), usuario creador y montos.
   - Accion **Cargar / Editar**: Al presionar este boton, el sistema restaura partidas, datos fiscales, emisor y receptor directamente en el formulario y conmuta la pestana para continuar su edicion o re-solicitud instantanea.

4. **Registro In-App de Clientes Nuevos o de Operacion Unica:**
   - Se elimino la friccion de tener que acudir al Django Admin para dar de alta clientes eventuales o nuevos.
   - Directamente desde el buscador de clientes de la prefactura web, el operador puede abrir un modal personalizado para registrar Nombre/Razon Social, RFC, Correo, Regimen Fiscal, Uso CFDI y Codigo Postal.
   - El cliente se almacena en PostgreSQL via POST /api/cotizador/clientes/, se integra a la lista en memoria y se auto-selecciona de inmediato para continuar la operacion sin interrupciones.

---

## 2. Modificaciones en Backend

### 2.1. Filtros por Estado en API: ackend/apps/cotizador/views.py (listar_prefacturas_view)
Se anadio soporte para el parametro ?estado:
- ?estado=por_enviar: Filtra registros 	ipo_operacion='PREFACTURA' que no cuenten con cotizaciones hijas asociadas y tengan cotizacion_enviada=False.
- ?estado=enviadas: Filtra registros 	ipo_operacion='COTIZACION' con cotizacion_enviada=True, resolviendo el nombre del usuario emisor (enviado_por).
- Sin parametro / estado general: Retorna todas las prefacturas ordenadas descendentemente por fecha para alimentar el nuevo historial.

### 2.2. Generacion y Despacho en generar_cotizacion_view
Se reconstruyo el flujo para:
1. Clonar los datos de la prefactura en un nuevo registro COTIZACION o actualizar el existente si ya existia.
2. Inyectar creado_por = request.user (usuario autenticado que despacho la cotizacion).
3. Generar el buffer Excel en memoria con generar_excel_prefactura.
4. Inyectar el buffer en GenerarCotizacionView.as_view() mediante RequestFactory y SimpleUploadedFile para producir el PDF oficial con ReportLab.
5. Despachar a la cola de Celery:
   `python
   enviar_cotizacion_task.delay(
       cliente_id=prefactura.cliente.id,
       empresa_id=prefactura.empresa_emisora.id,
       pdf_base64=pdf_b64,
       folio=cotizacion_hija.referencia_unica,
       subtotal=float(cotizacion_hija.subtotal),
       impuestos=float(cotizacion_hija.impuestos),
       total=float(cotizacion_hija.total),
       es_excel=False,
       correo_destino=correo_cliente
   )
   `
6. Marcar prefactura.cotizacion_enviada = True y guardar.

---

## 3. Modificaciones en Frontend

### 3.1. rontend/src/components/cotizador/BandejaCotizaciones.jsx
- **Sub-pestanas estilizadas:** Diseno con paleta institucional indigo/slate (#4F46E5, #F1F5F9, #FFFFFF).
- **Tabla 'Por Enviar':**
  - Folio Prefactura (PRE-...)
  - Cliente y Empresa Emisora
  - Columna de registro: creado_por (quien hizo la prefactura) y fecha.
  - Acciones: Vista previa PDF borrador, Descarga Excel y boton principal *Generar y Enviar*.
- **Tabla 'Enviadas':**
  - Folio Oficial (COT-...) y Folio de origen (PRE-...)
  - Cliente y Empresa Emisora
  - Columna de envio: enviado_por (quien despacho la cotizacion) y fecha de despacho.
  - Acciones: Vista previa de PDF oficial y Descarga de PDF.

### 3.2. rontend/src/components/cotizador/FormularioPreFactura.jsx
- **Sub-pestanas superiores:** Permiten alternar fluidamente entre el formulario de captura y el historial de prefacturas guardadas.
- **Historial Completo:**
  - Visualizacion tabular de prefacturas con buscador interactivo y boton de actualizacion.
  - Badges de estado: Borrador, Enviada a Monterrey, Recibida de Monterrey, Factura Entregada.
  - Accion *Cargar / Editar*: Recupera todo el payload guardado (datos_formulario) y puebla automaticamente los estados de partidas, parametros, cliente y empresa para reanudar el trabajo.
- **Modal de Cliente Nuevo / Unica Operacion:**
  - Modal con fondo desenfocado (ackdropFilter: blur(6px)).
  - Formulario de alta rapida con validacion de campos indispensables (Razon Social y Correo).
  - Peticion POST a /api/cotizador/clientes/ y asignacion inmediata sin recargar la pagina.

---

## 4. Verificacion y Pruebas Realizadas

1. **Prueba de Generacion de PDF en Memoria:**
   - Validada en shell interactiva de Django (GenerarCotizacionView.as_view() devolvio status_code = 200 y payload binario de 260 KB).
2. **Prueba de Flujo Completo 'Generar y Enviar':**
   - Prefactura seleccionada paso exitosamente a la cola de Celery.
   - El registro se transfirio automaticamente de la vista *Por Enviar* a *Enviadas*.
   - La tabla mostro correctamente el usuario autenticado que realizo el despacho.
3. **Prueba de Armonizacion Visual:**
   - Se elimino el esquema verde divergente en la pestana de enviadas, adoptando la paleta indigo corporativa.
4. **Prueba de Historial y Carga:**
   - La API /api/cotizador/listar-prefacturas/ devolvio las prefacturas existentes en la base de datos PostgreSQL.
   - El boton *Cargar / Editar* restauro las partidas e importes en el formulario.

---

## 5. Proximos Pasos Recomendados

- Implementar la suspension temporal de empresas emisoras (ctiva = BooleanField) en EmpresaEmisora para ocultar del cotizador aquellas empresas que aun no cuenten con credenciales SMTP configuradas.
