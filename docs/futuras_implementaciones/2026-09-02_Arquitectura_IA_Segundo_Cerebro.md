---
tags: [documentación, arquitectura, ia, cotizador, segundo_cerebro, roadmap]
date: 2026-09-02
---

# Arquitectura Estratégica: Copiloto de IA y Segundo Cerebro (Obsidian + PostgreSQL)

## 1. Visión General del Sistema ("Efecto Jarvis")

El objetivo de esta integración es dotar al Sistema Integral de Gestión de un **asistente comercial e institucional con memoria viva**. 

A diferencia de un chat genérico, este copiloto opera sobre dos fuentes de verdad propias de la empresa:
1. **Datos Cuantitativos / Duros:** Números, RFCs, montos y registros transaccionales alojados en **PostgreSQL**.
2. **Conocimiento Cualitativo / Criterio Humano:** Políticas de facturación, hábitos de clientes y catálogos de servicios alojados en un **Segundo Cerebro basado en Obsidian (Markdown)**.

---

## 2. Caso de Uso Prioritario: Armado Inverso de Prefacturas por Monto Objetivo

### El Problema Operativo Actual
Cuando un cliente solicita una facturación por un monto total cerrado (ej. $185,600.00 MXN con IVA), el personal comercial invierte entre 20 y 40 minutos en Excel intentando calcular qué partidas, cantidades y precios unitarios pueden sumar exactamente esa cantidad sin desfasar centavos y asegurando que los conceptos hagan sentido comercial y fiscal.

### La Solución con IA (Target-Budget Solver)
1. El usuario ingresa únicamente dos datos en el formulario: **Cliente** y **Monto Objetivo**.
2. La IA genera en menos de 5 segundos **3 estrategias precargadas**:
   * **Estrategia A (Por Giro Comercial):** Desglose de 2 a 3 partidas típicas del sector del cliente con precios estándar de mercado.
   * **Estrategia B (Por Fases de Proyecto):** Conceptos secuenciales o complementarios (ej. supervisión, suministros, implementación técnica).
   * **Estrategia C (Partida Global Ejecutiva):** Un solo concepto integrador de alto nivel.
3. El usuario selecciona la estrategia preferida con un clic y la tabla del cotizador se puebla automáticamente con claves SAT, precios, cantidades y subtotales exactos.

---

## 3. Principio de No-Repetición: Matriz de Rotación de Conceptos

Para evitar monotonía comercial o alertas en auditorías fiscales:
* **El historial NO se usa para clonar facturas pasadas.**
* La IA consulta el historial de prefacturas de ese cliente como un **filtro de exclusión y continuidad**:
  * *Regla:* Si el mes anterior se facturó un servicio específico (ej. "Mantenimiento preventivo"), la IA busca deliberadamente conceptos afines pero distintos dentro de su giro (ej. "Ajuste y calibración técnica" o "Suministro de consumibles").

---

## 4. Pila Tecnológica y Modelo de IA Seleccionado

| Componente | Elección Técnica | Justificación |
| :--- | :--- | :--- |
| **Proveedor** | **OpenAI API** | Infraestructura totalmente gestionada; no requiere comprar servidores físicos con GPU ni contratar AWS. Costo estimado: **$5 -  USD / mes**. |
| **Modelo Principal** | **GPT-4o** | Capacidad analítica superior para resolver restricciones matemáticas exactas y soporte nativo de **Structured Outputs (JSON estricto)** para garantizar que la respuesta no rompa el frontend. |
| **Modelo Secundario** | **GPT-4o-mini** | Para clasificación básica de correos, resúmenes y notas de CRM a costo casi nulo. |
| **Privacidad de Datos** | **API Empresarial** | Por contrato y certificaciones SOC2, los datos enviados vía API **no se usan para entrenar modelos** y viajan cifrados bajo TLS. |

---

## 5. Arquitectura de Memoria Dual: PostgreSQL + Obsidian

`
+-----------------------------------------------------------------------------+
|                          EL SEGUNDO CEREBRO (Obsidian)                      |
|  - Bóveda de archivos Markdown (.md) editada por el equipo comercial       |
|  - Clientes/ (preferencias, mañas, acuerdos particulares)                  |
|  - Giros/ (catálogos de servicios típicos de mercado)                       |
|  - Políticas/ (reglas de facturación con Monterrey)                         |
+---------------------------------------^-------------------------------------+
                                        | (Sincronizado vía Git al Servidor)
+---------------------------------------v-------------------------------------+
|                      ORQUESTADOR BACKEND (Django REST)                      |
|  1. Lee las notas Markdown de Obsidian desde el disco del servidor         |
|  2. Consulta la base de datos relacional PostgreSQL                        |
|  3. Construye el prompt con contexto completo y lo envía a GPT-4o          |
+-------------------+-----------------------------------+---------------------+
                    |                                   |
+-------------------v---------------+   +---------------v---------------------+
|     BASE DE DATOS RELACIONAL      |   |        MOTOR VECTORIAL (RAG)        |
|    PostgreSQL (Datos maestros,    |   |     Extensión nativa pgvector     |
|    RFCs, clientes y transacciones)|   |     Embeddings dentro de Postgres   |
+-----------------------------------+   +-------------------------------------+
`

### ¿Dónde vive Obsidian?
* **La aplicación visual:** Se instala en la laptop o PC de los usuarios para redactar notas y ver mapas mentales sin tocar bases de datos ni código.
* **Los archivos (.md):** Viven en una carpeta sincronizada dentro del proyecto en el servidor, permitiendo que Django los lea de forma nativa en milisegundos.

---

## 6. Hoja de Ruta de Implementación

1. **Fase 1 (Ajustes Menores a Base de Datos):**
   * Agregar campos giro_comercial y 
otas_estrategia al modelo Cliente.
2. **Fase 2 (Motor de Generación Inversa en Django):**
   * Crear endpoint /api/cotizador/generar-estrategia-monto/ conectado a GPT-4o mediante Pydantic para estructuración estricta.
3. **Fase 3 (Integración de Bóveda de Conocimiento):**
   * Configurar la lectura de notas Markdown desde Django para inyectar reglas por giro y cliente.
4. **Fase 4 (Componente en Frontend React):**
   * Diseñar las tarjetas de selección de estrategias en ModuloCotizador.jsx para aplicar la prefactura generada con un solo clic.

---

## 7. Enlaces Relacionados
- [[MOC Cotizador]]
- [[Arquitectura de Cotización y Facturación]]
- [[2026-09-02_Plan_Implementacion_IA]]