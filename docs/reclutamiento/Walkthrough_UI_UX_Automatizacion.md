# Walkthrough: Mejoras UI/UX y Automatización (Módulo Reclutamiento)

Este documento resume las implementaciones estéticas y funcionales realizadas en el Tablero ATS y Flujo de Candidatos para garantizar una experiencia de usuario Premium (Corporate Level).

## 1. Modales Premium en Reemplazo de Alertas Nativas
Se sustituyó el comportamiento predeterminado del navegador (`window.confirm` y `window.alert`) por modales personalizados construidos en React (`SelectorEstatusPremium` y `ModalEnviarReporte`).
- **Beneficio:** Evita que el navegador bloquee la página con alertas invasivas.
- **Estética:** Se integraron sombras suaves (`box-shadow`), animaciones de entrada (`slideUpFade`, `fadeIn`) y fondos borrosos (`backdrop-filter: blur`).
- **Seguridad:** Los modales bloquean acciones duplicadas durante procesos asíncronos (ej. botón en estado "Cargando" con spinner).

## 2. Estandarización de Paleta de Colores (RecluSystem)
Se unificó el sistema de diseño para eliminar colores de plantillas genéricas.
- **Azul Institucional (`#96C2DB`):** Utilizado para botones primarios ("+ Nuevo Levantamiento", "Enviar al Cliente"), iconos activos, y bordes de selección.
- **Gris Pizarra (`#1E293B`):** Empleado en encabezados (`h2`, `h3`) y texto de jerarquía principal, proporcionando contraste y elegancia frente al azul primario.
- Se eliminaron colores descontextualizados como el azul marino fuerte (`#1A237E`) y el azul verdoso opaco (`#5C7E8F`).

## 3. Automatización de Estatus del Candidato (Backend)
Se optimizó el ciclo de vida del candidato a través de la actualización automática de su estatus basado en el rendimiento de sus entrevistas.
- **Entrevista Inicial:** El método `save()` del modelo evalúa el `semáforo` de las respuestas.
  - Verde -> `viable`
  - Amarillo -> `en_proceso`
  - Rojo -> `no_viable`
- Esto elimina la necesidad de que el reclutador cambie manualmente el estatus tras aplicar filtros básicos, reduciendo el trabajo manual.

## 4. Fixes Funcionales de Data
- **Migración Virtual:** Se manejó el cambio conceptual del campo `zona_ubicacion` a `plataforma_origen` (Fuente de Reclutamiento) directamente desde el Frontend, enviando valores controlados (`No especificada`) para satisfacer las validaciones del Django REST Framework sin necesidad de alterar el esquema SQL (Zero Migrations).
- **Control de Acceso:** El ViewSet de candidatos ahora filtra por `vacante__consultor=user.id`, previniendo que usuarios estándar vean candidatos de otras vacantes.
