# Arquitectura de Contenedores (Docker)

Esta aplicación está completamente dockerizada para garantizar estandarización y facilitar su despliegue en cualquier entorno (desarrollo o producción).

## Contenedores Principales (`docker-compose.yml`)

La infraestructura se divide en 4 servicios independientes, todos interconectados a través de la red interna de Docker:

1. **`sig_backend` (Django REST Framework)**
   - **Puerto Expuesto:** `8000:8000`
   - **Propósito:** Expone los endpoints de la API, maneja la lógica de negocio y se conecta a la base de datos `db.sqlite3`.
   - **Volúmenes:** Mapea la carpeta local `./backend` al `/app` del contenedor. Esto permite "Hot-Reloading" en Python y asegura que la base de datos física local se afecte (protegiendo los datos de candidatos incluso si el contenedor se destruye).

2. **`sig_frontend` (Vite + React)**
   - **Puerto Expuesto:** `5173:5173`
   - **Propósito:** Sirve la interfaz de usuario para consumo en el navegador.
   - **Volúmenes:** Mapea `./frontend` para inyectar los cambios de código al instante mediante el Hot-Reloading configurado a través de Chokidar. Aisla la carpeta `node_modules` internamente.

3. **`sig_redis` (Redis 7 Alpine)**
   - **Puerto Expuesto:** `6379:6379`
   - **Propósito:** Actúa como *Message Broker* (gestor de colas en memoria). Recibe las tareas pesadas desde Django y las mantiene en fila hasta que un trabajador asíncrono esté libre.

4. **`sig_celery` (Celery Worker)**
   - **Puerto:** N/A (Se ejecuta en segundo plano puro sin exponer HTTP).
   - **Propósito:** Se conecta a Redis para escuchar la cola de tareas asíncronas (como el envío masivo de correos o análisis de OCR). Ejecuta las instrucciones sin bloquear los recursos del servidor web `sig_backend`.

## Comandos Útiles de Gestión

- **Encender la arquitectura completa:** `docker-compose up -d`
- **Apagar la arquitectura:** `docker-compose down`
- **Ver los registros (logs) de un contenedor específico:** `docker logs sig_celery --tail 50`
- **Reconstruir imágenes (cuando se instalan nuevas librerías en requirements.txt):** `docker-compose up -d --build`
