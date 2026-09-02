---
tags: [documentación, arquitectura, cloud, multiempresa, aws, smtp, roadmap]
date: 2026-09-02
---

# Arquitectura Cloud Multi-Empresa y Estrategia de Envío de Correos (AWS + Docker)

## 1. Resumen Ejecutivo

Este documento define la estrategia de infraestructura para desplegar el Sistema Integral de Gestión en la nube, permitiendo que **hasta 10 empresas distintas** operen de manera concurrente con aislamiento total de su información, eliminando al mismo tiempo la necesidad de una VPN para el despacho de correos electrónicos.

### Objetivos Clave
1. **Multi-Tenancy Eficiente:** Una sola base de datos y un solo servidor que atiende a múltiples empresas sin duplicar costos de infraestructura.
2. **Aislamiento de Clientes y Cotizaciones:** Garantía a nivel de código de que ninguna empresa pueda visualizar los clientes o facturación de otra.
3. **Anonimato de Ubicación y Alta Entregabilidad:** Despacho de correos desde la IP limpia de un centro de datos en AWS, ocultando la ubicación física local y evitando listas negras de Spam.

---

## 2. Aislamiento Multi-Empresa (Multi-Tenancy Lógico)

### Modelo de Datos Existente
El sistema ya cuenta con la base relacional necesaria:
* El modelo Cliente mantiene una relación Many-to-Many (empresas_emisoras) con el modelo EmpresaEmisora.
* El modelo OperacionFacturacion está vinculado directamente con la empresa emisora correspondiente.

### Reglas de Seguridad en Backend (Django)
Para garantizar la confidencialidad entre empresas:
* **Filtro Forzoso por Sesión:** Cada usuario autenticado está asociado a su respectiva empresa emisora. Ninguna consulta a la base de datos se ejecuta sin este parámetro:
  `python
  # Regla de acceso en views.py
  empresa_activa = request.user.empresa_asociada
  clientes_permitidos = Cliente.objects.filter(empresas_emisoras=empresa_activa)
  operaciones_permitidas = OperacionFacturacion.objects.filter(empresa_emisora=empresa_activa)
  `
* **Acceso por Subdominios (Opcional):**
  * empresa1.gestionintegral.com
  * empresa2.gestionintegral.com
  Nginx dirige el tráfico al mismo frontend de React, el cual ajusta dinámicamente el logotipo, colores corporativos y catálogos de la empresa emisora identificada en el subdominio.

---

## 3. Infraestructura y Alojamiento en AWS

Dado que el proyecto está 100% dockerizado (docker-compose.yml), la migración a AWS se realiza sin reescribir código.

`
                                  INTERNET
                                     │
                    HTTPS (Puerto 443) / Subdominios
                                     ▼
             ┌───────────────────────────────────────────────┐
             │       AWS EC2 / LIGHTSAIL (Ubuntu Linux)      │
             │                                               │
             │   ┌───────────────────────────────────────┐   │
             │   │    NGINX REVERSE PROXY + SSL CERTBOT  │   │
             │   └───────────────────┬───────────────────┘   │
             │                       │                       │
             │   ┌───────────────────┴───────────────────┐   │
             │   │             DOCKER COMPOSE            │   │
             │   │  - sig_frontend (React)               │   │
             │   │  - sig_backend (Django REST)          │   │
             │   │  - sig_celery (Workers asíncronos)    │   │
             │   │  - sig_celery_beat (Tareas periódicas)│   │
             │   │  - sig_postgres (PostgreSQL 15)       │   │
             │   │  - sig_redis (Colas de mensajes)      │   │
             │   └───────────────────────────────────────┘   │
             └───────────────────────────────────────────────┘
`

### Especificaciones del Servidor Recomendado
* **Servicio:** **AWS Lightsail** o **AWS EC2 (	3.medium)**.
* **Capacidad:** 2 vCPUs y 4 GB de memoria RAM (con 40 GB a 80 GB de almacenamiento SSD).
* **Costo Estimado:** **$20 a  USD mensuales**.
* **Capacidad Operativa:** Soporta holgadamente a 10 empresas con decenas de usuarios concurrentes generando cotizaciones, subiendo archivos y procesando correos en Celery.

---

## 4. Estrategia de Correo Saliente: ¿Por qué NO usar VPN?

### El Riesgo de las VPNs Comerciales
Si Celery enrutara sus conexiones SMTP a través de servicios como NordVPN o ExpressVPN:
1. **Bloqueo Inmediato:** Las IPs de VPNs públicas están reportadas en Spamhaus, Barracuda y filtros de Gmail/Outlook.
2. **Rebotes de Correo:** Los servidores receptores rechazan la conexión con error 550 Blocked IP o envían las facturas a la carpeta de correo no deseado.

### La Solución Nube (Cero VPN)
1. **Ocultamiento de Ubicación Física:** Al residir en AWS (ej. región us-east-1 en Virginia), la IP pública de origen es la del centro de datos de Amazon. Ningún cliente puede rastrear la ubicación física de la oficina o de los operadores.
2. **Canales SMTP Individuales:** Cada registro en EmpresaEmisora almacena sus propias credenciales SMTP (host_smtp, puerto_smtp, correo_remitente, contraseña). Cuando una empresa aprueba una factura:
   * El correo sale autenticado directamente por su propio servidor corporativo (cPanel, Google Workspace o Microsoft 365).
   * La firma SPF, DKIM y DMARC se mantiene válida, garantizando una tasa de entrega en bandeja de entrada superior al 98%.

---

## 5. Hoja de Ruta para Despliegue en Producción

1. **Fase 1: Preparación del Servidor AWS**
   * Crear instancia Ubuntu Linux en AWS Lightsail / EC2.
   * Asignar IP elástica fija (Static IP) y configurar Security Groups (puertos 80, 443 y SSH).
2. **Fase 2: Despliegue de Contenedores**
   * Clonar el repositorio Git en /home/ubuntu/Sistema-Integral-de-Gestion.
   * Configurar variables de entorno de producción en .env (credenciales DB, secret key).
   * Ejecutar docker-compose up -d --build.
3. **Fase 3: Configuración de Dominio y SSL**
   * Apuntar registros DNS de las empresas hacia la IP elástica de AWS.
   * Configurar Nginx y generar certificados SSL automatizados con Certbot.
4. **Fase 4: Pruebas de Entregabilidad**
   * Validar envíos de prueba desde cada una de las empresas emisoras hacia buzones externos (Gmail, Outlook) y verificar encabezados de entrega limpia.

---

## 6. Enlaces Relacionados
- [[Gestión de Correos y SMTP]]
- [[Arquitectura de Cotización y Facturación]]
- [[2026-09-02_Arquitectura_IA_Segundo_Cerebro]]