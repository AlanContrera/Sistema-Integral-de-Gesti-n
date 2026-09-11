# Despliegue y Migración a Servidor Físico Local (Bare-Metal Ubuntu Server 24.04 LTS)

**Fecha:** 2026-09-11  
**Módulo:** Infraestructura y Arquitectura de Despliegue Local  
**Estado:** 🟢 Operativo en Producción Local  
**Acceso en Red Local (LAN):** `http://192.168.10.46:5173`

---

## 1. Justificación y Objetivos de la Migración

Anteriormente, el sistema operaba en una computadora de desarrollo bajo Windows 10 con virtualización anidada en WSL2. Esto conllevaba:
1. Dependencia de que la laptop/PC estuviera encendida y en la oficina.
2. Sobrecarga de memoria RAM (Windows consumía más de 3 GB solo en reposo).
3. Latencia y consumo extra por la capa de virtualización de WSL2.

**Solución Implementada:**
Se convirtió un equipo de escritorio dedicado en un **servidor bare-metal con Ubuntu Server 24.04 LTS (Headless, sin interfaz gráfica)**, corriendo Docker Engine de forma nativa directamente sobre el procesador y el SSD.

---

## 2. Ficha Técnica del Servidor

| Parámetro | Especificación | Rol en la Arquitectura |
| :--- | :--- | :--- |
| **Procesador (CPU)** | AMD FX(tm)-6100 (6 Núcleos @ 3.3 GHz) | Multiprocesamiento paralelo para Django, Celery, Redis y BD |
| **Memoria RAM** | 8 GB DDR3 | Memoria física para contenedores activos |
| **Memoria SWAP** | 8 GB (en SSD) | Protección contra picos de carga y prevención de *OOM-Killer* |
| **Almacenamiento** | SSD 480 GB (SATA III) | Sistema operativo, volúmenes de Docker, PostgreSQL y archivos `media/` |
| **Red** | Ethernet Gigabit (Cableada) | IP estática/fija: `192.168.10.46` |
| **Sistema Operativo**| Ubuntu Server 24.04.1 LTS (Linux 7.0 x86_64) | Sistema base sin entorno de escritorio |

---

## 3. Bitácora de Configuración del Servidor

### A. Preparación del Sistema Operativo
1. Instalación limpia de **Ubuntu Server 24.04 LTS** eliminando Windows 10.
2. Habilitación de servicio **OpenSSH Server** para administración remota sin periféricos.
3. **Expansión de almacenamiento LVM:** Ubuntu Server asignó inicialmente solo 100 GB. Se extendió la partición lógica para ocupar el 100% de los 480 GB del SSD:
   ```bash
   sudo lvextend -l +100%FREE /dev/ubuntu-vg/ubuntu-lv
   sudo resize2fs /dev/ubuntu-vg/ubuntu-lv
   ```
4. **Configuración de memoria de intercambio (SWAP de 8 GB):**
   ```bash
   sudo fallocate -l 8G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
   ```

### B. Instalación de Docker Engine Oficial
Se instalaron los binarios oficiales de Docker (no versión snap) para máximo rendimiento:
```bash
sudo apt update && sudo apt install -y ca-certificates curl gnupg git
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER
```

---

## 4. Migración de Datos y Código

### A. Respaldo de la Base de Datos
Desde el entorno de desarrollo se generó el volcado SQL completo con los 162 clientes saneados y cotizaciones:
```bash
docker exec sig_postgres pg_dump -U sistemas -d sig_db --clean --if-exists > backup_sig_db.sql
```

### B. Transferencia Delta con `rsync`
Se sincronizó el proyecto directamente hacia el servidor omitiendo carpetas pesadas prescindibles (`node_modules`, `venv`, cachés):
```bash
rsync -avz --exclude 'node_modules' --exclude '__pycache__' --exclude 'venv' --exclude '.git' /home/sistemas_pm/Proyectos/Sistema-Integral-de-Gestion/ sistemas@192.168.10.46:~/Sistema-Integral-de-Gestion/
```

### C. Levantamiento de Contenedores y Restauración
En el servidor:
```bash
cd ~/Sistema-Integral-de-Gestion
docker compose up -d --build
docker exec -i sig_postgres psql -U sistemas -d sig_db < backup_sig_db.sql
```

---

## 5. Arquitectura de Servicios y Puntos de Acceso (LAN)

Todos los servicios corren bajo la red interna de Docker `sig_network` con redirección de puertos hacia la red de la oficina:

```
                  Red Local de la Oficina (192.168.10.0/24)
                                     │
                                     ▼
                      Servidor Físico (192.168.10.46)
        ┌──────────────────────────────────────────────────────────┐
        │ Docker Engine (Nativo Linux)                             │
        │                                                          │
        │  [sig_frontend]  Puerto 5173  ◄─── Web App React (Vite)  │
        │  [sig_backend]   Puerto 8000  ◄─── Django API & Admin    │
        │  [sig_postgres]  Puerto 5432  ◄─── Base de Datos         │
        │  [sig_redis]     Puerto 6379  ◄─── Broker Celery         │
        │  [sig_celery]                 ◄─── Tareas de Fondo       │
        │  [sig_celery_beat]            ◄─── Reloj Automático      │
        │  [sig_pgadmin]   Puerto 5050  ◄─── Panel Web PostgreSQL  │
        └──────────────────────────────────────────────────────────┘
```

### URLs de Acceso:
* **Sistema Integral (Frontend Web):** [http://192.168.10.46:5173](http://192.168.10.46:5173)
* **Panel de Administración Django:** [http://192.168.10.46:8000/admin/](http://192.168.10.46:8000/admin/)
* **pgAdmin 4 (Explorador de Base de Datos):** [http://192.168.10.46:5050](http://192.168.10.46:5050) *(Usuario: `admin@admin.com`, Clave: `admin`)*
* **Acceso SSH (Consola del Servidor):** `ssh sistemas@192.168.10.46`

---

## 6. Guía Rápida de Mantenimiento y Comandos Útiles

Para gestionar el servidor en el día a día desde cualquier terminal conectada por SSH:

* **Ver estado de los contenedores:**
  ```bash
  cd ~/Sistema-Integral-de-Gestion && docker compose ps
  ```
* **Ver logs en tiempo real (ej. Backend o Celery):**
  ```bash
  docker compose logs -f backend
  docker compose logs -f celery
  ```
* **Reiniciar los servicios:**
  ```bash
  docker compose restart
  ```
* **Apagar el sistema de forma segura:**
  ```bash
  docker compose down
  ```
* **Respaldar la base de datos rápidamente:**
  ```bash
  docker exec sig_postgres pg_dump -U sistemas -d sig_db > ~/backup_$(date +%Y%m%d).sql
  ```
