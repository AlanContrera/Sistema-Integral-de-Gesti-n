# Manual Operativo: Flujo de Desarrollo (PC Local) y Despliegue en Servidor (Producción)

**Fecha:** 2026-09-11  
**Módulo:** Infraestructura, DevOps & Operaciones  
**Entorno de Desarrollo (Dev):** Computadora Local / Laptop (`localhost:5173` / `localhost:8000`)  
**Entorno de Producción Local (Prod):** Servidor Físico Ubuntu Bare-Metal (`192.168.10.46:5173` / `192.168.10.46:8000`)

---

## 1. Filosofía Arquitectónica: Dev vs. Prod

Para garantizar que el sistema nunca se caiga para los usuarios de la oficina mientras se programan nuevas funcionalidades, se establece la separación estricta de entornos:

```
[ TU COMPUTADORA (Dev) ]                   [ GITHUB ]                   [ SERVIDOR FÍSICO (Prod) ]
    Laptop / WSL2                          Repositorio                     Ubuntu Server 24.04
          │                                     │                                   │
          ├── Escribir código nuevo             │                                   │
          ├── Crear pantallas y estilos         │                                   │
          ├── Probar en localhost               │                                   │
          │                                     │                                   │
          └── git push origin main ────────────►│                                   │
                                                │                                   │
                                                └── git pull ──────────────────────►│
                                                                                    ├── Actualización limpia
                                                                                    ├── Base de datos real
                                                                                    └── Cero interrupciones
```

* **Laptop (Desarrollo):** Es el "taller". Aquí podemos experimentar, programar nuevas funciones, equivocarnos y probar con datos simulados.
* **Servidor Físico (Producción):** Es la "tienda abierta al público". Los usuarios comerciales, de facturación y reclutamiento trabajan aquí en vivo. **Solo recibe versiones terminadas y probadas**.

---

## 2. El Ciclo Diario de Trabajo en 3 Pasos

### Paso 1: Desarrollo y Validación Local (En tu PC)
1. Desarrollamos la nueva pantalla, endpoint o flujo en tu IDE.
2. Verificamos su funcionamiento en tu navegador local (`http://localhost:5173`).

### Paso 2: Versionado y Respaldo en Git (En tu PC)
Una vez verificado que todo funciona correctamente, abres tu terminal local y ejecutas:
```bash
# Revisar archivos modificados
git status

# Agregar y documentar los cambios
git add .
git commit -m "feat(cotizador): agregar modulo de cobranza y abonos"

# Enviar los cambios a GitHub
git push origin main
```

### Paso 3: Despliegue en el Servidor (Vía SSH)
En tu ventana de PowerShell conectada al servidor (`ssh sistemas@192.168.10.46`):
```bash
# 1. Entrar a la carpeta del proyecto
cd ~/Sistema-Integral-de-Gestion

# 2. Descargar la última versión estable
git pull
```
¡Listo! En menos de 5 segundos el servidor se actualiza y los usuarios ya pueden ver los cambios.

---

## 3. Manejo de Migraciones de Base de Datos (`makemigrations` vs. `migrate`)

Este es el punto técnico más importante para no dañar la base de datos de producción:

| Comando | ¿Dónde se corre? | ¿Cuándo se corre? | ¿Qué hace? |
| :--- | :---: | :--- | :--- |
| **`makemigrations`** | **Solo en tu PC** | Al modificar `models.py` (tablas o campos nuevos). | Genera el archivo `.py` en la carpeta `migrations/` con el plano del cambio. |
| **`migrate`** | **En tu PC Y en el Servidor** | En tu PC para probar; en el Servidor después del `git pull`. | Aplica el plano en la base de datos de PostgreSQL real sin borrar datos existentes. |

### Flujo Completo cuando hay cambios en Base de Datos:

1. **En tu PC (Laptop):**
   ```bash
   docker exec sig_backend python manage.py makemigrations
   docker exec sig_backend python manage.py migrate
   git add .
   git commit -m "db: agregar nuevo modelo AbonoCotizacion"
   git push origin main
   ```
2. **En el Servidor (vía SSH):**
   ```bash
   cd ~/Sistema-Integral-de-Gestion
   git pull
   docker exec sig_backend python manage.py migrate
   ```

---

## 4. Archivos que NUNCA se tocan con Git (Secretos y Archivos Físicos)

Por seguridad y diseño de arquitectura, estos archivos están en `.gitignore` y **no se sobreescriben**:

* **`backend/.env`:** Contiene las contraseñas de correos IMAP/SMTP, credenciales de BD y API keys. Ya vive configurado en el servidor y `git pull` nunca lo alterará.
* **`backend/media/`:** Contiene las fotos, logos de membretadas, archivos de Excel y PDFs generados. Los archivos que suban los usuarios del servidor se quedan a salvo en el SSD del servidor.
* **PostgreSQL Data (`sig_postgres`):** Los datos reales de clientes, cotizaciones y usuarios viven en el volumen persistente de Docker en el servidor.

---

## 5. Acordeón de Comandos según el Tipo de Cambio

### Caso A: Solo cambiaste Frontend o Backend (código Python / React)
```bash
# En el Servidor:
cd ~/Sistema-Integral-de-Gestion && git pull
```
*(El hot-reloading de los contenedores refleja los cambios inmediatamente)*.

### Caso B: Modificaste Modelos de Base de Datos (`models.py`)
```bash
# En el Servidor:
cd ~/Sistema-Integral-de-Gestion && git pull
docker exec sig_backend python manage.py migrate
```

### Caso C: Instalaste librerías nuevas en `requirements.txt` o `package.json`
```bash
# En el Servidor:
cd ~/Sistema-Integral-de-Gestion && git pull
docker compose up -d --build
```
*(Docker reconstruye la imagen con las nuevas librerías sin perder ningún dato de la BD)*.

---

## 6. Plan de Contingencia y Rollback (Botón de Pánico)

Si alguna vez subes una versión al servidor y notas un error imprevisto que bloquea a los usuarios:

1. Regresar de inmediato a la versión anterior estable:
   ```bash
   cd ~/Sistema-Integral-de-Gestion
   git log --oneline -n 3
   git checkout <hash_del_commit_anterior>
   ```
2. El sistema vuelve a la versión previa en 2 segundos mientras solucionas el detalle con calma en tu laptop.
