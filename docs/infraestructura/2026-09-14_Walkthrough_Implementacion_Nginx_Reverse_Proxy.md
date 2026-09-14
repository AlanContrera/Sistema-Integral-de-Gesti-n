---
tags: [documentacion, walkthrough, infraestructura, docker, nginx, produccion]
fecha: 2026-09-14
autor: Alan Contrera
modulo: Infraestructura / Despliegue Local
---

# Walkthrough: Implementación de Nginx como Reverse Proxy y Web Server en Docker

## 1. Resumen Ejecutivo
Para garantizar el rendimiento óptimo, la seguridad y la accesibilidad remota del **Sistema Integral de Gestión** entre sedes (**Oficina B** ↔ **Oficina A** vía Tailscale), se integró **Nginx** como Reverse Proxy y servidor web de producción en la arquitectura Docker.

Esto resuelve la fragmentación de puertos (`:5173` y `:8000`), unificando todo el tráfico en el puerto estándar **80**, sirviendo el frontend React precompilado con compresión Gzip y redirigiendo internamente las peticiones hacia Django y los archivos multimedia.

---

## 2. Arquitectura de Servicios

```
                           Petición HTTP (Puerto 80)
                                      │
                                      ▼
                      ┌────────────────────────────────┐
                      │  sig_nginx (Nginx 1.27 Alpine) │
                      │  Puerto 80:80                  │
                      └───────┬────────────────┬───────┘
                              │                │
            ┌─────────────────┴─────┐    ┌─────┴────────────────┐
            │                       │    │                      │
        Ruta "/"              Ruta "/api/"    Ruta "/admin/"    Rutas "/media/" y "/static/"
            │                       │    │                      │
            ▼                       ▼    ▼                      ▼
  [Archivos HTML/JS/CSS]      [sig_backend]              [Volúmenes Montados]
  frontend/dist/ (React SPA)  Django REST (Puerto 8000)   media/ y staticfiles/
```

---

## 3. Componentes Integrados

### 3.1. Configuración de Nginx (`nginx/nginx.conf`)
* **SPA Routing:** Configuración `try_files $uri $uri/ /index.html;` para que React Router navegue fluidamente sin errores 404 al recargar páginas.
* **Proxy Pass:** Redirección transparente de `/api/` y `/admin/` hacia el servicio `backend:8000`.
* **Archivos Estáticos y Media:** Entrega directa con directivas `expires` para caché eficiente de comprobantes, membretadas y hojas de estilo del Django Admin.
* **Gzip & Buffer:** Compresión dinámica de respuestas JSON, CSS y JS, con soporte para cargas de hasta 50MB (`client_max_body_size 50M;`).

### 3.2. Configuración de Django (`backend/config/settings/base.py`)
* Se agregó la directiva `STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')` para consolidar los archivos del admin con `collectstatic`.

### 3.3. Orquestación Docker (`docker-compose.yml`)
* Se incorporó el servicio `sig_nginx` bajo la red interna `sig_network`.

---

## 4. Guía de Despliegue y Mantenimiento

### 4.1. Compilación Inicial en el Servidor
```bash
# 1. Compilar el build de producción de React
docker compose exec frontend npm run build

# 2. Recolectar estáticos de Django Admin
docker compose exec backend python manage.py collectstatic --noinput

# 3. Levantar el contenedor de Nginx
docker compose up -d nginx
```

### 4.2. Flujo de Actualizaciones Futuras
Al realizar cambios en el código y descargarlos en el servidor (`git pull`):
* **Si cambiaste React:** `docker compose exec frontend npm run build`
* **Si cambiaste Django:** `docker compose restart backend`
* **Nginx no requiere reiniciarse** a menos que modifiques `nginx.conf`.

---

## Enlaces Relacionados (Obsidian)
- [[2026-09-11_Despliegue_Servidor_Local_Ubuntu_BareMetal|Despliegue Servidor BareMetal]]
- [[2026-09-11_Manual_Flujo_Desarrollo_y_Despliegue_Servidor|Flujo de Desarrollo y Despliegue]]
- [[2026-09-14_Walkthrough_Remediacion_Fuga_Telegram_Secretos|Remediación de Fuga de Secretos]]
- [[arquitectura_docker|Arquitectura Docker]]
