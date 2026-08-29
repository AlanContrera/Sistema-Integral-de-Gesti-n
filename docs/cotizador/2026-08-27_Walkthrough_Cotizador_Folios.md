# Walkthrough: Unificación y Relación de Folios en Cotizador y Prefacturas
**Fecha:** 2026-08-27

> [!NOTE]  
> Este documento resume la implementación de la nueva arquitectura de folios (`COT-XXXX` y `PRE-XXXX`), cómo se enlazan las prefacturas a las cotizaciones originales, cómo se resolvió la duplicación de registros al enviar solicitudes múltiples a Monterrey, la configuración Anti-Spam de Celery y la instalación gráfica de la Base de Datos.

## 1. Modificación de Arquitectura de Base de Datos (`models.py`)

Se reestructuró la entidad `OperacionFacturacion` para abandonar el formato genérico `OP-UUID`. 

### Cambios Clave:
- **`tipo_operacion`**: Se agregó para diferenciar si un registro es `'COTIZACION'` o `'PREFACTURA'`.
- **`cotizacion_origen`**: Se agregó como una llave foránea a `self` para poder enlazar una Prefactura a la Cotización de la cual nació.
- **Lógica de Generación de ID (`save()`)**:
  - Las operaciones "raíces" (Cotizaciones o Prefacturas directas) buscan el último consecutivo del día y generan formatos como `COT-27082026-0001`.
  - **Herencia de Folio:** Si una Prefactura es generada a partir de una Cotización, extrae inteligentemente el consecutivo de la cotización original y simplemente intercambia las siglas (`PRE-27082026-0001`).

## 2. Memoria Temporal de React (`FormularioPreFactura.jsx`)

Para que el backend sepa de dónde viene una prefactura, el frontend ahora tiene "memoria":
- Al presionar **Generar Cotización**, si la petición es exitosa, React guarda el ID retornado en el estado `cotizacionOrigen`.
- Al presionar **Solicitar a Monterrey**, la función `construirPayload()` inyecta silenciosamente el campo `referencia_cotizacion_origen` con el valor de la memoria.

## 3. Lógica Anti-Clonación (`views.py`)

Se ajustó la vista `solicitar_factura_monterrey_view`.
1. Busca si viene un ID en `referencia_cotizacion_origen`.
2. Busca si *ya existe* una `PREFACTURA` que pertenezca a esa `cotizacion_origen`.
   - Si **existe**: Sobreescribe los montos y vuelve a enviar el correo.
   - Si **no existe**: Crea el nuevo registro.

## 4. Unificación Visual (PDF = Correo = BD)
Se inyectó el parámetro `folio_oficial` dentro del `mock_request` en `generar_cotizacion_view`. `GenerarCotizacionView` ahora lee primero el `folio_oficial` inyectado y solo auto-genera uno temporal si este viene vacío (modo preview).

## 5. Prevención Anti-Spam en Correos (`tasks.py`)
Para evitar bloqueos temporales por parte de los servidores cPanel y Gmail (SpamAssassin), se integraron los siguientes estándares premium en las tareas de Celery:
- Se reemplazó el contenedor por defecto por `MIMEMultipart('mixed')` para separar los adjuntos del cuerpo textual.
- Se agregó un `MIMEMultipart('alternative')` anidado, combinando el cuerpo HTML renderizado por plantillas de Django, **junto con una extracción obligatoria en Texto Plano** (Strip-Tags).
- Se inyectaron cabeceras críticas: `Message-ID` (generado nativamente por `email.utils`), `Date`, y `Reply-To`.

## 6. Instalación de pgAdmin4 (Docker)
Se agregó un contenedor adicional en `docker-compose.yml` para aislar la visualización del nuevo motor de base de datos PostgreSQL.
- Se configuró el puerto `5050`.
- Se mapeó al host interno `db` usando credenciales seguras.
- Esto permite la visualización de los **Diagramas Entidad-Relación (ERD)** de todo el sistema de manera gráfica.
