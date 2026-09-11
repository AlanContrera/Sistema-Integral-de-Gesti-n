# Sistema de Telemetría y Alertas en Tiempo Real vía Telegram

> **Fecha:** 11 de Septiembre de 2026  
> **Servidor:** Ubuntu Server 24.04 LTS Bare-Metal (`192.168.10.46`)  
> **Canal de Notificaciones:** Bot `@AgentServeBot`  
> **Administrador:** Ing. Alan Contreras (Chat ID: `8759898291`)  

---

## 1. Visión General de la Arquitectura

Para garantizar la fiabilidad del Sistema Integral de Gestión (SIG) sin depender de software de terceros en los clientes ni incurrir en costos de dominios, se implementó una red de telemetría y control remoto bidireccional basada en la API de Telegram y Healthchecks.io.

```
       +-------------------------------------------------------+
       |                  SERVIDOR SIG (Ubuntu)                |
       |                                                       |
       |   +-----------------------------------------------+   |
       |   |      Docker Compose (backend, celery, db)     |   |
       |   |                                               |   |
       |   |  tasks.py (enviar_cotizacion / factura)       |   |
       |   |       | (Fallo SMTP / rebote)                 |   |
       |   |       v                                       |   |
       |   |  core/telegram.py ------------------------+   |   |
       |   +-------------------------------------------|---+   |
       |                                               |       |
       |   +---------------------------------------+   |       |
       |   |    systemd: server_bot.service        |   |       |
       |   |                                       |   |       |
       |   |  • Watchdog Docker (status=exited)    |   |       |
       |   |  • Heartbeat Healthchecks.io (60s)    |   |       |
       |   |  • Botón "📥 Git Pull"                |   |       |
       |   |  • Botón "⚠️ Ver Errores / Logs"      |   |       |
       |   +-------------------+-------------------+   |       |
       +-----------------------|-----------------------+       |
                               |                               |
                               +---------------+---------------+
                                               |
                                               v (HTTPS API)
                                 +---------------------------+
                                 |  Telegram API Bot Gateway |
                                 +-------------+-------------+
                                               |
                                               v
                                  📱 Teléfono Administrador
```

---

## 2. Alertas de Entrega de Correo (Cotizador y Facturación)

### Detección y Notificación
Cuando el trabajador de segundo plano (`sig_celery`) ejecuta el envío de una cotización, prefactura o factura oficial y ocurre cualquier incidencia:
- **Destinatario sin correo:** Detecta que el cliente no tiene dirección configurada.
- **Rebote de servidor SMTP (`550 User not found`):** Servidor de destino rechaza la cuenta.
- **Timeout o expiración de credenciales:** Fallo de conexión o autenticación en el proveedor SMTP.

La función `notificar_error_correo` en `backend/core/telegram.py` captura el error y despacha una alerta con el siguiente formato:

```
🚨 ERROR EN ENVÍO DE CORREO

📄 Documento: Cotización (COT-2026-0042)
👤 Cliente: Transportes del Norte
📧 Destinatario: facturacion@clientenoexiste.com
⏰ Hora: 17:45:10

❌ Causa del Error:
SMTPRecipientsRefused: 550 Mailbox does not exist
```

---

## 3. Monitor de Errores y Watchdog de Servidor

El bot residente (`/home/sistemas/server_bot.py`) incorpora dos mecanismos de vigilancia:

### A. Botón "⚠️ Ver Errores / Logs"
- Consulta los últimos registros de los contenedores `sig_backend` y `sig_celery`.
- Filtra líneas que contengan `ERROR`, `CRITICAL`, `Traceback`, `Exception` o `Failed`.
- Si todo opera con normalidad, confirma: `✅ Sin Errores: Los contenedores de Django y Celery no presentan excepciones recientes`.

### B. Watchdog Automático de Contenedores
- En su hilo de monitoreo continuo (cada 60 segundos), evalúa el estado de todos los contenedores con prefijo `sig_`.
- Si un contenedor entra en estado `Exited` o falla inesperadamente:
```
🚨 ALERTA CRÍTICA: Contenedor Caído

El servicio sig_backend se ha detenido inesperadamente.

Usa el botón 🔄 Reiniciar Docker para intentar recuperarlo.
```

---

## 4. Teclado de Botones en Telegram

El menú principal del bot cuenta con 7 accesos rápidos:

| Botón | Función |
| :--- | :--- |
| `📊 Estado del Servidor` | CPU, RAM, temperatura, carga y resumen de Docker |
| `📍 Ver IP` | Consulta IP pública dinámica e IP local de red |
| `📥 Actualizar Sistema (Git Pull)` | Descarga cambios de GitHub y corre migraciones de DB |
| `⚠️ Ver Errores / Logs` | Inspección remota de excepciones en backend y celery |
| `🔄 Reiniciar Docker` | Recarga de todos los contenedores de la aplicación |
| `⚡ Reiniciar Servidor` | Reinicio físico seguro (con confirmación de 2 pasos) |
| `🛑 Apagar Servidor` | Apagado físico seguro (con notificación de fallo a Healthchecks) |

---

## 5. Mantenimiento del Servicio

Para actualizar el script del bot en el servidor físico:

```bash
sudo systemctl restart server_bot.service
sudo systemctl status server_bot.service
```
