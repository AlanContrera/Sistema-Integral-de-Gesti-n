# 📋 Biblia del Excel de Reclutamiento — Referencia Permanente

> **Archivo:** `IACI INGENIERO DE IMPLEMENTACION Y PROYECTO RECLUTAMIENTO BUENO edITABLE.xlsx`
> **Total de hojas:** 41
> **Propósito:** Expediente completo para gestionar UNA vacante: desde el levantamiento del perfil, pasando por entrevistas de hasta 10 candidatos, evaluaciones profundas de los 5 mejores, hasta la generación de reportes ejecutivos para el cliente.

---

## 📑 ÍNDICE DE HOJAS

| # | Hoja | Tipo | Propósito |
|---|------|------|-----------|
| 1 | Consulta Perfil x Estado | Base de datos + consulta | Tabla de 160 registros (32 estados × 5 generaciones) con personalidad, aptitudes, motivadores y puestos sugeridos por región. Panel de consulta en columnas M–R. |
| 2 | **Perfilador** | Formulario principal | Levantamiento completo de la vacante (64 filas, 10 secciones). El corazón del Excel. |
| 3 | Estados y Municipios | Catálogo geográfico | Lista de 32 estados con municipios por columna. |
| 4 | Perfil de Puesto x Estado | Vista cruzada | Perfil de candidato sugerido al seleccionar estado + puesto. |
| 5 | Propuesta al Cliente de Perfil | Documento comercial | Propuesta que se envía al cliente ANTES del reclutamiento. |
| 6 | Entrevista Inicial | Plantilla genérica | Plantilla base de entrevista inicial (no se usa directamente, es referencia). |
| 7 | Entrevista Profunda | Plantilla genérica | Plantilla base de entrevista profunda (referencia). |
| 8 | Examen Habilidades | Evaluación técnica | 8 rubros con calificación 0–10 y resultado automático. |
| 9 | Envio de Candidato a CTE | Reporte ejecutivo | Ficha consolidada que cruza Perfilador + Entrevista Inicial + Profunda + Examen. |
| 10 | **Catálogos** | Base de datos maestra | **349 puestos** con sueldo promedio, funciones, responsabilidades, competencias técnicas, blandas y factores de éxito. Municipios por estado (cols L–AP). Factor ubicación (cols BA–BD). Listas de escolaridad (col BF) y experiencia (col BH). |
| 11 | Lista Estados | Catálogo simple | Los 32 estados de México. |
| 12 | Benchmark Salarial | Comparativo | Sueldos mínimos, máximos y promedios por plataforma. |
| 13 | Comparativo Bolsas | Análisis comercial | Compara plataformas de publicación (LinkedIn, OCC, Indeed, etc.) con rangos salariales. |
| 14 | Perfilador Reclutamiento | Versión interna | Copia interna del perfilador con campos adicionales. |
| 15 | Export Entrevista Inicial | Versión limpia | Para exportar/imprimir la entrevista inicial. |
| 16 | Export Envio Candidato CTE | Versión limpia | Para exportar/imprimir el envío al cliente. |
| 17 | Exportar Nuevo Libro | Instrucciones | Lista de hojas listas para exportar. |
| 18 | Reporte de Entrevistas | Dashboard | Resumen de 10 candidatos con estatus de entrevista y aprobación. |
| 19–28 | **Candidato 01–10** | Entrevista inicial por candidato | 10 preguntas dinámicas + análisis automático + semáforo + agenda. |
| 29 | **Vista 10 Candidatos** | Dashboard de control | Tabla resumen de los 10 candidatos con resultado, riesgos, señales y agenda. |
| 30–34 | **Entrevista Profunda 1–5** | Evaluación profunda | 37 rubros evaluados con nivel (Nulo/Básico/Intermedio/Experto), puntaje automático, semáforo y análisis ejecutivo. |
| 35 | **Top 5 Entrevista Cliente** | Ranking consolidado | Los 5 mejores candidatos con puntaje, %, resultado y estatus para envío al cliente. |
| 36 | Reportes Cliente | Índice | Índice de los 5 reportes ejecutivos. |
| 37–41 | **Reporte Cliente 1–5** | Reporte ejecutivo final | Ficha ejecutiva por candidato para enviar al cliente (sin datos personales de contacto). |

---

## 🔧 HOJA 2: PERFILADOR (El Corazón)

### Estructura celda por celda

**Sección 1 — Datos del Cliente (filas 4–9)**
| Celda | Contenido | Tipo |
|-------|-----------|------|
| A5/B5 | Empresa | Texto libre |
| C5/D5 | Giro/industria | **FÓRMULA** → Jala del Catálogo según puesto seleccionado |
| A6/B6 | Contacto responsable | Texto libre |
| C6/D6 | Puesto del contacto | Texto libre |
| A7/B7 | Teléfono | Texto libre |
| C7/D7 | Correo | Texto libre |
| A8/B8 | Ubicación de la vacante | Texto libre |
| C8/D8 | Razón social | Texto libre |
| A9/B9 | Municipio o Alcaldía | Texto libre |
| C9/D9 | Sitio Web | Texto libre |

**Sección 2 — Datos del Puesto (filas 10–20)**
| Celda | Contenido | Tipo |
|-------|-----------|------|
| A11/B11 | **Nombre del puesto** | **CLAVE** — Este campo dispara fórmulas XLOOKUP contra la hoja Catálogos |
| C11/D11 | Área/departamento | Texto libre |
| A12/B12 | Jefe directo | Texto libre |
| C12/D12 | Número de vacantes | Número (default 1) |
| A13/B13 | Motivo de la vacante | **LISTA DESPLEGABLE**: Nueva, Reemplazo, Temporal |
| C13/D13 | Fecha ideal de ingreso | Texto libre |
| A14/B14 | Nivel del puesto | **LISTA DESPLEGABLE**: Operativo, Administrativo, Mando medio, Directivo |
| C14/D14 | Tipo de contratación | **LISTA DESPLEGABLE**: Planta, Temporal, Proyecto |
| A15/B15 | Sueldo Mensual Ofrecido | **Validación decimal** (solo números) |
| C15/D15 | Periodicidad de pago | **LISTA DESPLEGABLE**: Mensual, Semanal, Quincenal |
| A16/B16 | Jornada | **LISTA DESPLEGABLE**: Completa, Medio Tiempo, Fin de Semana |
| C16/D16 | Prestaciones | **LISTA DESPLEGABLE**: Ley, Superiores a las de la ley, Honorarios, Servicios Profesionales |
| B18 | Comparativo vs mercado | **FÓRMULA**: "Por debajo" / "Alto" / "En promedio" |
| B19 | Sueldo Mínimo | **FÓRMULA**: `MIN('Comparativo Bolsas'!I5:I12)` |
| D19 | Sueldo Máximo | **FÓRMULA**: `MAX('Comparativo Bolsas'!K5:K12)` |
| B20 | Sueldo promedio de mercado | **FÓRMULA** (ArrayFormula) |

**Sección 3–4 — Objetivo y Funciones (filas 21–29)**
| Celda | Contenido | Tipo |
|-------|-----------|------|
| B25 | Funciones diarias propuestas | **FÓRMULA**: `XLOOKUP(B11, Catálogos!A:A, Catálogos!C:C)` |
| B26 | Funciones diarias por el Cliente | Texto libre |
| B27 | Responsabilidades críticas propuestas | **FÓRMULA** (ArrayFormula del Catálogo) |
| B28 | Responsabilidades por el Cliente | Texto libre |
| B29 | Indicadores/KPIs | Texto libre |

**Sección 5 — Perfil Requerido (filas 31–36)**
| Celda | Contenido | Tipo |
|-------|-----------|------|
| A32/B32 | Escolaridad mínima | Texto libre |
| C32/D32 | Carrera/especialidad | Texto libre |
| A33/B33 | Experiencia mínima | Texto libre |
| A35/B35 | Software/herramientas | Texto libre |
| C35/D35 | Certificaciones | **LISTA DESPLEGABLE**: Título, Título y Cédula, En trámite Título, En trámite Cédula |
| A36/B36 | Disponibilidad para viajar | **LISTA DESPLEGABLE**: Pendiente, No disponible, Disponibilidad ocasional/nacional/internacional/total |

**Sección 6 — Competencias (filas 38–44)**
| Celda | Contenido | Tipo |
|-------|-----------|------|
| B39 | Competencias técnicas propuestas | **FÓRMULA**: `XLOOKUP(B11, Catálogos!A:A, Catálogos!E:E)` |
| B40 | Competencias técnicas del Cliente | Texto libre |
| B41 | Competencias blandas propuestas | Texto libre |
| B43 | Factores de éxito propuestos | **FÓRMULA** (ArrayFormula del Catálogo) |

**Sección 7–10 — Condiciones, Proceso, Descarte, Acuerdos (filas 45–64)**
| Celda | Contenido | Tipo |
|-------|-----------|------|
| D48 | Modalidad | **LISTA DESPLEGABLE**: Presencial, Mixta, Remota |
| D62 | Exclusividad | **LISTA DESPLEGABLE**: Sí, No |
| D63 | Garantía | **LISTA DESPLEGABLE**: 7 días, 15 días, 30 días, 60 días, 90 días |

---

## 📊 HOJA 10: CATÁLOGOS (La Base de Datos Maestra)

**349 filas × 62 columnas.** Es la base de datos más importante del Excel.

### Columnas principales (A–G): Puestos y competencias
| Columna | Contenido | Ejemplo |
|---------|-----------|---------|
| A | **Puestos demandados** | "Operador de producción", "Ayudante general", "Almacenista", ... (349 puestos) |
| B | **Sueldo promedio mensual MXN** | 9500, 8500, 9500, ... |
| C | **Funciones sugeridas** | Texto largo con bullets (•) |
| D | **Responsabilidades críticas** | Texto largo con bullets |
| E | **Competencias técnicas** | Texto largo con bullets |
| F | **Competencias blandas** | Texto largo con bullets |
| G | **Factores clave de éxito** | Texto largo con bullets |

### Columnas H–AP: Municipios por estado
| Columna | Contenido |
|---------|-----------|
| H | Municipios filtrados (fórmula dinámica) |
| J–K | Estado → Municipio (tabla base) |
| L–AP | Municipios agrupados por estado (Baja California, Baja California Sur, ..., Zacatecas) |

### Columnas AW–BD: Tabla de ajuste salarial por ubicación
| Columna | Contenido |
|---------|-----------|
| AW | Lista Estados |
| BA | Estado (fórmula) |
| BB | Municipio (fórmula) |
| BC | **Factor ubicación** (ej. 1, 1.05, 0.95) → Se usa para ajustar el sueldo promedio |
| BD | Llave concatenada Estado\|Municipio |

### Columnas BF–BJ: Listas para dropdowns
| Columna | Contenido | Valores |
|---------|-----------|---------|
| BF | **Escolaridad** | Primaria, Secundaria, Preparatoria, Técnico, Licenciatura, Maestría, Doctorado |
| BH | **Experiencia** | 1 año, 1-2 años, 2-3 años, 3-5 años, 5+ años, etc. |
| BJ | **Prestaciones adicionales** | Vales de Gasolina, Vales de Despensa, etc. |

---

## 👤 HOJAS 19–28: CANDIDATO 01–10 (Entrevista Inicial)

Cada hoja tiene **44 filas × 4 columnas** con esta estructura:

### Encabezado (filas 1–5)
| Celda | Contenido | Fuente |
|-------|-----------|--------|
| B2 | Puesto | **FÓRMULA** → `Perfilador!B11` |
| D2 | Ubicación | **FÓRMULA** → `TEXTJOIN(Perfilador!B9, B8)` |
| B3 | Sueldo propuesto | **FÓRMULA** → `Perfilador!B15` |
| D3 | Promedio mercado | **FÓRMULA** → `Perfilador!B20` |
| B5 | **Nombre del candidato** | Texto libre (único campo manual del encabezado) |

### Preguntas (filas 6–16): 10 preguntas dinámicas
| # | Rubro | Pregunta | Fuente |
|---|-------|----------|--------|
| 1 | Experiencia reciente | "Cuéntame tu experiencia más reciente..." | **FÓRMULA** dinámica que incluye `Perfilador!B11` |
| 2 | Experiencia mínima | "El perfil solicita experiencia mínima de..." | **FÓRMULA** que jala `Perfilador!B33` |
| 3 | Escolaridad | "¿Cuál es tu escolaridad máxima?" | **FÓRMULA** que jala `Perfilador!B32` |
| 4 | Carrera/especialidad | "¿Tu formación está alineada?" | **FÓRMULA** que jala `Perfilador!D32` |
| 5 | Software/herramientas | "¿Qué software dominas?" | **FÓRMULA** que jala `Perfilador!B35` |
| 6 | Competencias blandas | "¿Cómo manejas presión?" | Texto fijo |
| 7 | Logros/KPIs | "¿Cuál fue un logro importante?" | Texto fijo |
| 8 | Traslado/zona | "La vacante está en [ubicación]..." | **FÓRMULA** que jala ubicación |
| 9 | Expectativa salarial | "La oferta es de $X..." | **FÓRMULA** con `Perfilador!B15` y `B20` |
| 10 | Motivación | "¿Por qué te interesa?" | Texto fijo |

**Columna D (Respuesta)**: Texto libre que captura el reclutador.

### Análisis Automático (filas 25–31)
| Celda | Contenido | Tipo |
|-------|-----------|------|
| B26 | Respuestas capturadas | **FÓRMULA**: `COUNTA(D7:D16) & " de 10"` |
| B27 | Señales positivas | **FÓRMULA** (cuenta "Cumple" + validaciones de sueldo + zona) |
| D27 | Señales de riesgo | **FÓRMULA** (cuenta "No cumple" + búsqueda de "no"/"lejos") |
| B30 | **Resultado sugerido** | **FÓRMULA**: "Pasar a entrevista profunda" / "No pasar" / "En duda" |
| D30 | Siguiente paso | **FÓRMULA**: "Agendar entrevista profunda" / "No avanzar" |
| B31 | Justificación automática | **FÓRMULA** (texto concatenado con todo el análisis) |

### Factores Críticos (filas 33–38)
| Celda | Contenido | Validación |
|-------|-----------|------------|
| D34 | Escolaridad mínima | **LISTA DESPLEGABLE**: Cumple, No cumple, No aplica, Por validar |
| D35 | Experiencia mínima | **LISTA DESPLEGABLE**: Cumple, No cumple, No aplica, Por validar |
| D36 | Carrera/especialidad | **LISTA DESPLEGABLE**: Cumple, No cumple, No aplica, Por validar |
| D37 | Software/herramientas | **LISTA DESPLEGABLE**: Cumple, No cumple, No aplica, Por validar |
| B38 | Resultado factores críticos | **FÓRMULA**: "Cumple factores críticos" / "No cumple factor crítico" / "En revisión" |

### Agenda (filas 39–44)
| Celda | Contenido | Validación |
|-------|-----------|------------|
| B41 | Fecha entrevista profunda | Fecha libre |
| D41 | Hora | Texto libre |
| D42 | Modalidad | **LISTA DESPLEGABLE**: Presencial, Virtual, Telefónica |
| D43 | Confirmación enviada | **LISTA DESPLEGABLE**: Sí, No, Pendiente |

---

## 🔍 HOJAS 30–34: ENTREVISTA PROFUNDA 1–5

Cada hoja tiene **64 filas × 7 columnas** con **37 rubros evaluados**.

### Encabezado (filas 1–8)
| Celda | Contenido | Fuente |
|-------|-----------|--------|
| B2 | Puesto | FÓRMULA → Perfilador!B11 |
| E2 | Ubicación | FÓRMULA → TEXTJOIN |
| G2 | Fecha | FÓRMULA → TODAY() |
| C3 | Sueldo propuesto | FÓRMULA → Perfilador!B15 |
| E3 | Promedio mercado | FÓRMULA |
| G3 | Resultado entrevista inicial | FÓRMULA → 'Entrevista Inicial'!B30 |
| B6 | **Nombre del candidato** | Texto libre |
| F8 | Disponibilidad ingreso | **LISTA DESPLEGABLE**: Inmediata, 1 semana, 2 semanas, 15 días, 30 días, Por confirmar |

### 37 Rubros Evaluados (filas 9–46)

**Columnas:**
- **A**: Número (1–37)
- **B**: Paquete/Rubro
- **C**: Pregunta (la mayoría son **FÓRMULAS** dinámicas basadas en el Perfilador)
- **D**: Evidencia esperada (texto fijo)
- **E**: **Nivel expresado** → **LISTA DESPLEGABLE**: Nulo, Básico, Intermedio, Experto
- **F**: Puntaje automático → **FÓRMULA** (Nulo=0, Básico=1, Intermedio=2, Experto=3)
- **G**: Notas/evidencia del candidato (texto libre)

**Desglose de los 37 rubros:**
| # | Rubro | Cantidad |
|---|-------|----------|
| 1 | Actividad crítica general | 1 rubro |
| 2–6 | Funciones principales | 5 rubros (fórmulas del catálogo) |
| 7–11 | Responsabilidades críticas | 5 rubros (fórmulas del catálogo) |
| 12–16 | Competencias técnicas | 5 rubros (fórmulas del catálogo) |
| 17–20 | Herramientas/software | 4 rubros (fórmulas del catálogo) |
| 21 | Experiencia mínima | 1 rubro |
| 22 | Escolaridad | 1 rubro |
| 23–28 | Competencias blandas | 6 rubros (fórmulas del catálogo) |
| 29–34 | Factores clave de éxito | 6 rubros (fórmulas del catálogo) |
| 35 | Alineación salarial | 1 rubro → **LISTA DESPLEGABLE**: Sí, No, Negociable |
| 36 | Traslado/disponibilidad | 1 rubro |
| 37 | Plan 30-60-90 | 1 rubro |

### Resumen Automático (filas 47–64)
| Celda | Contenido | Tipo |
|-------|-----------|------|
| B48 | Puntaje obtenido | **FÓRMULA**: `SUM(F10:F46)` |
| D48 | Puntaje máximo | **FÓRMULA**: `COUNTA(E10:E46)*3` |
| F48 | **Porcentaje** | **FÓRMULA**: `B48/D48` |
| B49 | Nulos | **FÓRMULA**: `COUNTIF(E10:E46,"Nulo")` |
| D49 | Básicos | FÓRMULA |
| F49 | Intermedios | FÓRMULA |
| B50 | Expertos | FÓRMULA |
| F50 | Mínimo recomendado | **0.7 (70%)** |
| B51 | **Resultado sugerido** | **FÓRMULA**: ≥70% y 0 nulos = "Viable para entrevista con el cliente" / ≥60% = "Viable con observaciones" / <60% = "No viable" |
| B52 | Siguiente paso | FÓRMULA |
| B53 | Justificación automática | FÓRMULA (texto completo del análisis) |
| B55 | **Semáforo** | **FÓRMULA**: "Verde — enviar al cliente" / "Amarillo — enviar con observaciones" / "Rojo — no enviar" |
| A58 | Análisis ejecutivo | Texto calculado |
| A60 | Fortalezas principales | Texto calculado |
| D60 | Riesgos/brechas | Texto calculado |

---

## 🏆 HOJA 35: TOP 5 ENTREVISTA CLIENTE

Dashboard que consolida automáticamente los 5 candidatos con entrevista profunda.

| Columna | Contenido | Fuente |
|---------|-----------|--------|
| C | Candidato | FÓRMULA → nombre de cada Entrevista Profunda |
| J | Puntaje | FÓRMULA → B48 de cada hoja |
| K | % evaluación | FÓRMULA → F48 de cada hoja |
| L | Resultado sugerido | FÓRMULA → B51 |
| M | Siguiente paso | FÓRMULA → B52 |
| N | Notas/análisis | FÓRMULA → B53 |
| O | **Estatus** | **FÓRMULA**: "Listo para cliente" / "Validar reservas" / "No enviar" / "Pendiente" |

**Tabla de semáforo:**
| Rango | Acción | Color |
|-------|--------|-------|
| ≥75% | Agendar entrevista con cliente | 🟢 Verde |
| 65%–74% | Enviar con reservas | 🟡 Amarillo |
| <65% | No enviar | 🔴 Rojo |
| Sin captura | Completar evaluación | 🔵 Azul |

---

## 📄 HOJAS 37–41: REPORTE CLIENTE 1–5

Ficha ejecutiva generada automáticamente para enviar al cliente (sin datos de contacto personal del candidato).

### Estructura (38 filas × 6 columnas)
| Sección | Contenido | Fuente |
|---------|-----------|--------|
| Encabezado | Cliente, Puesto, Ubicación, Sueldo, Fecha | FÓRMULAS de Perfilador y Entrevista Profunda |
| Resumen ejecutivo | Conclusión + Motivo | FÓRMULAS |
| Validaciones realizadas | Perfilador, Entrevista inicial, Profunda, Examen, Decisión | FÓRMULAS |
| Fortalezas | Funciones, Responsabilidades, Competencias, Factores | FÓRMULAS |
| Puntos a validar | 4 puntos fijos | Texto fijo |
| Recomendación final | Resultado + Siguiente paso | FÓRMULAS |
| Nota importante | Pendientes de psicometría y socioeconómico | Texto fijo |

---

## 🔽 RESUMEN DE TODAS LAS LISTAS DESPLEGABLES

| Hoja | Celda(s) | Opciones |
|------|----------|----------|
| Perfilador | B13 | Nueva, Reemplazo, Temporal |
| Perfilador | B14 | Operativo, Administrativo, Mando medio, Directivo |
| Perfilador | D14 | Planta, Temporal, Proyecto |
| Perfilador | D15 | Mensual, Semanal, Quincenal |
| Perfilador | B16 | Completa, Medio Tiempo, Fin de Semana |
| Perfilador | D16–D17 | Ley, Superiores a las de la ley, Honorarios, Servicios Profesionales |
| Perfilador | D35 | Título, Título y Cédula, En trámite Título, En trámite Cédula |
| Perfilador | B36 | Pendiente, No disponible, Disponibilidad ocasional/nacional/internacional/total |
| Perfilador | D48 | Presencial, Mixta, Remota |
| Perfilador | D62 | Sí, No |
| Perfilador | D63 | 7 días, 15 días, 30 días, 60 días, 90 días |
| Candidato 01–10 | D34:D37 | **Cumple, No cumple, No aplica, Por validar** |
| Candidato 01–10 | D42 | Presencial, Virtual, Telefónica |
| Candidato 01–10 | D43 | Sí, No, Pendiente |
| Entrevista Profunda 1–5 | E10:E43, E45:E46 | **Nulo, Básico, Intermedio, Experto** |
| Entrevista Profunda 1–5 | E44 | **Sí, No, Negociable** (alineación salarial) |
| Entrevista Profunda 1–5 | F8 | Inmediata, 1 semana, 2 semanas, 15 días, 30 días, Por confirmar |
| Perfilador Reclutamiento | B23 | Pendiente, No disponible, Disponibilidad ocasional/nacional/internacional/total |
| Perfilador Reclutamiento | B41 | Pendiente, Sí, No, Con ajustes |
| Reporte de Entrevistas | I11:I20 | Sí, No, Por confirmar |
| Reporte de Entrevistas | J11:J20 | Pendiente, Aprobado, No aprobado |
| Examen Habilidades | F7:F14 | Validación numérica (entero ≥0) |

---

## 🔗 FLUJO DE DEPENDENCIAS ENTRE HOJAS

```
CATÁLOGOS (349 puestos con funciones, competencias, sueldos)
    │
    ▼
PERFILADOR (B11 = nombre del puesto → dispara XLOOKUP a Catálogos)
    │
    ├──► CANDIDATO 01–10 (preguntas dinámicas según Perfilador)
    │        │
    │        ▼
    │    VISTA 10 CANDIDATOS (dashboard automático)
    │
    ├──► ENTREVISTA PROFUNDA 1–5 (37 rubros dinámicos según Perfilador)
    │        │
    │        ▼
    │    TOP 5 ENTREVISTA CLIENTE (ranking automático)
    │        │
    │        ▼
    │    REPORTE CLIENTE 1–5 (ficha ejecutiva para el cliente)
    │
    ├──► BENCHMARK SALARIAL (sueldos min/max/promedio)
    ├──► COMPARATIVO BOLSAS (plataformas de publicación)
    ├──► PROPUESTA AL CLIENTE (documento comercial previo)
    └──► EXAMEN HABILIDADES (evaluación técnica complementaria)
```

---

## ⚡ FÓRMULAS CLAVE QUE SE DEBEN REPLICAR EN EL SISTEMA

1. **XLOOKUP del puesto al catálogo**: Cuando el usuario selecciona un puesto en B11, automáticamente se cargan funciones (B25), competencias técnicas (B39), factores de éxito (B43).

2. **Preguntas dinámicas en Candidato**: Las 10 preguntas se construyen con fórmulas IF que incluyen datos del Perfilador (escolaridad, experiencia, sueldo, ubicación).

3. **Semáforo de Entrevista Inicial**: Si faltan respuestas = "Pendiente". Si tiene ≥2 riesgos O no cumple factor crítico = "No pasar". Si tiene ≥5 positivas, ≤1 riesgo y cumple factores = "Pasar a profunda".

4. **Puntaje de Entrevista Profunda**: Nulo=0, Básico=1, Intermedio=2, Experto=3. Porcentaje = puntaje/máximo. ≥70% sin nulos = Verde. ≥60% = Amarillo. <60% o con nulos = Rojo.

5. **Ajuste salarial por ubicación**: El sueldo promedio del catálogo se multiplica por el factor de ubicación (tabla BA–BD) para dar un sueldo ajustado a la zona geográfica.

---

> [!IMPORTANT]
> Este documento es la **referencia definitiva** del Excel. Cualquier funcionalidad del sistema web debe replicar esta lógica. NO inventar campos ni flujos que no existan aquí.
