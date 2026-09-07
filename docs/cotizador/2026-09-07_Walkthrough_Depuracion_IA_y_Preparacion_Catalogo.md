---
tags: [documentación, walkthrough, refactor, cotizador, arquitectura, base_de_datos]
date: 2026-09-07
---

# Depuración de IA Experimental y Preparación de Catálogo Relacional

## 1. Resumen y Contexto de Negocio

Durante las pruebas operativas del generador automático de estrategias y conceptos de prefacturación (basado inicialmente en modelos de lenguaje y posteriormente en algoritmos de partición de montos), se evidenciaron problemas estructurales propios del uso de datos no curados:
1. **Inconsistencias de Negocio:** Asignación de cantidades arbitrarias en conceptos de servicios que requieren cantidad unitaria fija.
2. **Cruces de Dominio Comercial:** Conceptos históricos importados desde hojas de cálculo masivas sin validación previa contenían nombres comerciales de clientes desalineados con los giros de las empresas emisoras.
3. **Falta de Claves SAT Reales:** Dependencia de claves SAT genéricas o por defecto al carecer de una estructura formal.

Por decisión de arquitectura y negocio, se retiró por completo la capa experimental de Inteligencia Artificial / estrategias en el Cotizador, optando por una solución sólida y limpia: **diseñar e implementar una base de datos relacional desde cero que vincule formalmente Empresa Emisora, Cliente, Conceptos oficiales y Claves SAT verificadas.**

---

## 2. Componentes Retirados y Limpieza del Sistema

### 2.1 Frontend (`frontend/`)
- **Eliminación de Componente:** Se borró el archivo `frontend/src/components/cotizador/IAEstrategiaModal.jsx`.
- **Limpieza en `FormularioPreFactura.jsx`:**
  - Se removió el botón "Auto-Generar con IA" de la barra de acciones de partidas.
  - Se eliminó el estado `isIAModalOpen` y su importación.
  - Se retiró la invocación del modal al final del componente, dejando la UI libre de código muerto.

### 2.2 Backend (`backend/`)
- **Eliminación de Servicios y Scripts:**
  - Se eliminó el módulo de lógica `backend/apps/cotizador/ai_services.py`.
  - Se eliminó el script transitorio de ingestión de Excel `backend/importar_conceptos.py`.
- **Limpieza de Vistas y Rutas:**
  - Se eliminó la vista `generar_estrategia_ia_view` en `backend/apps/cotizador/views.py`.
  - Se retiró la ruta `/api/cotizador/generar-estrategia-ia/` en `backend/apps/cotizador/urls.py`.

### 2.3 Base de Datos y Migraciones (`PostgreSQL` / `Django ORM`)
- **Reversión de Migración:** Se ejecutó `python manage.py migrate cotizador 0011` para desaplicar y eliminar la tabla de la migración `0012_conceptoestrategia`.
- **Eliminación de Migración Huérfana:** Se eliminó el archivo `backend/apps/cotizador/migrations/0012_conceptoestrategia.py`.
- **Limpieza de Modelos:** Se borró la clase `ConceptoEstrategia` en `backend/apps/cotizador/models.py`.

---

## 3. Estado Actual del Sistema

- **Validación Django:** `python manage.py check` ejecutado con éxito (0 issues).
- **Consistencia de Migraciones:** Todas las aplicaciones están en sincronía y sin migraciones pendientes o huérfanas.
- **Frontend Operativo:** La interfaz de Prefacturación y Cotizaciones opera de manera fluida, reactiva y sin dependencias no resueltas.

---

## 4. Próximos Pasos (Nuevo Enfoque de Catálogo)

1. **Diseño de Modelo Relacional:**
   - Crear una entidad dedicada en `models.py` que relacione:
     - `empresa_emisora` (ForeignKey).
     - `cliente` (ForeignKey).
     - `descripcion` (Texto normalizado del concepto aprobado).
     - `clave_sat` (Clave de producto o servicio oficial SAT 4.0).
     - `unidad_sat` (Clave de unidad oficial, ej. `E48` para servicio).
2. **Panel de Gestión / Carga Limpia:**
   - Proveer interfaz o panel de administración para altas, bajas y modificaciones controladas de conceptos oficiales.
3. **Autocompletado Contextual Inteligente:**
   - Al seleccionar Empresa Emisora y Cliente en el formulario, sugerir en un desplegable únicamente los conceptos válidos para esa dupla comercial específica.
