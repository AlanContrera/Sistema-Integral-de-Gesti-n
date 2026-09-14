---
tags: [documentacion, walkthrough, seguridad, infraestructura, telemetria]
fecha: 2026-09-14
autor: Alan Contrera
modulo: Infraestructura / Telemetría
---

# Walkthrough: Remediación de Fuga de Credenciales (Telegram Bot Token & Healthchecks)

## 1. Resumen del Incidente
El 12 de septiembre de 2026, el sistema de escaneo de secretos **GitGuardian** emitió una alerta crítica de fuga:
* **Tipo de secreto expuesto:** `Telegram Bot Token`
* **Repositorio:** `AlanContrera/Sistema-Integral-de-Gesti-n`
* **Origen de la fuga:** Commit `7ba26f6` (*docs(infraestructura): manual completo de telemetria telegram y gestion de secretos .env*)

## 2. Diagnóstico y Causa Raíz
Durante la redacción del manual de infraestructura `docs/infraestructura/2026-09-11_Manual_Telemetria_Telegram_y_Gestion_Segura_Secretos_ENV.md`, específicamente en la sección *4.3 Método A (Inyección Directa por SSH)*, se documentó un snippet de configuración pegando accidentalmente las credenciales reales de producción:
* `TELEGRAM_BOT_TOKEN=<TOKEN_FILTRADO_REVOCADO>` (Línea 156)
* `TELEGRAM_ADMIN_CHAT_ID=<ADMIN_CHAT_ID>` (Línea 157)
* Endpoint UUID real de Healthchecks.io en la sección 2.3 (Línea 82)

Los archivos `.env` reales del backend se mantuvieron protegidos en `.gitignore` y nunca ingresaron a Git. La fuga se debió a un error de documentación en un ejemplo.

## 3. Acciones de Remediación Ejecutadas

### 3.1. Saneamiento del Archivo de Documentación
Se eliminaron las credenciales reales y la URL con token privado en `docs/infraestructura/2026-09-11_Manual_Telemetria_Telegram_y_Gestion_Segura_Secretos_ENV.md`, dejando las variables vacías para fines explicativos.

### 3.2. Reescribir el Commit Comprometido (Amend)
Dado que `7ba26f6` era el último commit en la rama `main`, se aprovechó la capacidad de enmienda de Git para sobrescribirlo limpiamente:
```bash
git add docs/infraestructura/2026-09-11_Manual_Telemetria_Telegram_y_Gestion_Segura_Secretos_ENV.md
git commit --amend --no-edit
```
El nuevo commit generado (`b12f25e`) sustituyó al commit expuesto. Se verificó con `git log -G "<TOKEN_ID_REVOCADO>"` que el token ya no existe en ninguna parte del historial local.

### 3.3. Sincronización Segura en GitHub
Se ejecutó una actualización forzada protegida (`--force-with-lease`):
```bash
git push --force-with-lease origin main
```
Esto eliminó el commit `7ba26f6` de la rama remota `main` en GitHub, reemplazándolo por `b12f25e` libre de credenciales.

---

## 4. Acciones Críticas Pendientes en el Entorno Real

> [!CAUTION]
> **El token previo debe considerarse revocado:**  
> Una vez que un token es indexado por GitGuardian o escáneres web, la buena práctica dicta revocarlo en el proveedor para neutralizar cualquier ventana de exposición previa.

1. **En Telegram (@BotFather):**
   - Ejecutar `/mybots` -> Seleccionar `@AgentServeBot`.
   - Ir a **API Token** -> **Revoke current token**.
   - Copiar el nuevo token generado.

2. **En el Servidor Físico de Producción (192.168.10.46):**
   - Actualizar el nuevo token en `~/Sistema-Integral-de-Gestion/backend/.env`:
     ```bash
     nano ~/Sistema-Integral-de-Gestion/backend/.env
     ```
   - Reiniciar el daemon del bot y contenedores:
     ```bash
     sudo systemctl restart server_bot.service
     docker compose restart sig_backend sig_celery
     ```

3. **En GitGuardian:**
   - Ingresar a la alerta del correo y marcar el incidente como **"Resolved / Revoked"**.

---

## Enlaces Relacionados (Obsidian)
- [[2026-09-11_Manual_Telemetria_Telegram_y_Gestion_Segura_Secretos_ENV|Manual de Telemetría Telegram y Gestión Segura de Secretos]]
- [[2026-09-11_Monitoreo_Alertas_Telegram_y_Telemetria_Servidor|Monitoreo y Alertas de Servidor]]
- [[2026-09-11_Manual_Flujo_Desarrollo_y_Despliegue_Servidor|Flujo de Desarrollo y Despliegue]]
- [[2026-09-11_Despliegue_Servidor_Local_Ubuntu_BareMetal|Despliegue Servidor BareMetal]]
