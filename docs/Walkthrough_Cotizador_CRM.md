# Walkthrough: Cotizador Inteligente y CRM Multi-Empresa

Este documento detalla la transformación del Módulo Cotizador de un simple generador de PDFs a un sistema de ventas avanzado capaz de enviar correos corporativos de manera dinámica.

## 1. Modelos Base de Datos (Mini-CRM)
Se crearon dos nuevos modelos en el backend (`apps/cotizador/models.py`):
- **`Cliente`:** Directorio rápido para prospectos. Almacena `nombre`, `correo` y `empresa` opcional.
- **`EmpresaEmisora`:** Catálogo de credenciales SMTP corporativas. Permite guardar el nombre de tu marca (ej. RecluSystem), el host SMTP, puerto, correo remitente y contraseña.

> [!TIP]
> **Seguridad:** Las contraseñas de los correos corporativos deben ser "Contraseñas de Aplicación" (App Passwords) si tu hosting web lo soporta, o la contraseña original si usas cPanel estándar. El campo de password es oculto (write-only) en el API para que no sea interceptado por el Frontend.

## 2. API y Tareas Asíncronas (Celery)
- Se habilitaron endpoints (`/api/cotizador/empresas-emisoras/` y `/api/cotizador/clientes/`) para consultar y registrar clientes en tiempo real.
- **Envío Dinámico:** El nuevo endpoint `enviar-cotizacion/` lanza la tarea en segundo plano `enviar_cotizacion_task`. Esta tarea lee las credenciales SMTP de la empresa emisora seleccionada y conecta directamente con el Web Hosting para disparar el correo con el PDF recién generado en base64.
- Al usar Celery, el reclutador/vendedor no se queda viendo un spinner congelado por 5 segundos; el sistema es reactivo.

## 3. Interfaz de Usuario (UI React)
Se modificó `ModuloCotizador.jsx` para integrar el flujo sin saturar la pantalla:
- **Selectores Inteligentes:** Antes de cargar el Excel, ahora aparecen dos *dropdowns* elegantes para escoger la `Empresa Emisora` y el `Cliente Destino`.
- **Botón + Nuevo Cliente:** Si el cliente es nuevo, un solo clic despliega un formulario minimalista alineado a la identidad gráfica (Azul `#0B4A7A`) para guardarlo sin recargar la página.
- **Acción Dual:** Se conservó el botón secundario "Generar Cotización PDF" (para descargarla manualmente) y se incorporó el botón primario de acción **"Generar y Enviar por Correo"**, el cual está desactivado hasta que se seleccionen los tres parámetros obligatorios (Empresa, Cliente y Archivo Excel).

### 4. Carga Masiva (Seed)
Se elaboró el script `backend/seed_empresas.py` para cargar de forma automatizada 23 correos corporativos como Emisoras usando `update_or_create` de Django, resolviendo el dominio para inyectar el host SMTP (`mail.dominio.com`) de manera dinámica.

## Siguientes Pasos
Para poner este módulo en marcha, entra al panel de administración de Django (`localhost:8000/admin`) y da de alta al menos **una Empresa Emisora** con sus credenciales de Web Hosting. Después de eso, desde React ya podrás registrar clientes y disparar correos al instante.
