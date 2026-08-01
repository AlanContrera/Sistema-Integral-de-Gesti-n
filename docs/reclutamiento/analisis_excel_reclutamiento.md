# Análisis Completo — Excel de Reclutamiento (41 hojas)

## 1. Mapa Real de las Hojas

| # | Hoja | Tipo | Área |
|---|------|------|------|
| 1 | Consulta Perfil x Estado | Catálogo consulta | Reclutamiento |
| 2 | **Perfilador** | Configuración de vacante | Comercial |
| 3 | Estados y Municipios | Catálogo geográfico | Sistema |
| 4 | Perfil de Puesto x Estado | Vista de perfil por estado | Comercial |
| 5 | **Propuesta al Cliente de Perfil** | Propuesta comercial para el cliente | Comercial |
| 6 | **Entrevista Inicial** (plantilla) | Filtro rápido del candidato | Reclutamiento |
| 7 | Entrevista Profunda (plantilla) | Evaluación profunda 37 rubros | Reclutamiento |
| 8 | Examen Habilidades | Evaluación técnica | Reclutamiento |
| 9 | **Envio de Candidato a CTE** | Ficha para enviar al cliente | Comercial |
| 10 | Catálogos | Catálogos internos (listas de control) | Sistema |
| 11 | Lista Estados | Catálogo 32 estados | Sistema |
| 12 | **Benchmark Salarial** | Comparativo de sueldos por puesto | Comercial |
| 13 | **Comparativo Bolsas** | Qué plataformas usar para publicar | Comercial |
| 14 | Perfilador Reclutamiento | Versión del perfilador para uso interno | Reclutamiento |
| 15 | Export Entrevista Inicial | Versión limpia para exportar | Sistema |
| 16 | Export Envio Candidato CTE | Versión limpia para exportar | Sistema |
| 17 | Exportar Nuevo Libro | Instrucciones de exportación | Sistema |
| 18 | **Reporte de Entrevistas** | Reporte resumen de candidatos | Admin/Comercial |
| 19–28 | **Candidato 01–10** | Entrevista inicial por candidato | Reclutamiento |
| 29 | **Vista 10 Candidatos** | Dashboard de control de 10 candidatos | Reclutamiento |
| 30–34 | **Entrevista Profunda 1–5** | Evaluación profunda con semáforo automático | Reclutamiento |
| 35 | **Top 5 Entrevista Cliente** | Ranking de candidatos para presentar al cliente | Comercial |
| 36 | Reportes Cliente | Índice de reportes | Comercial |
| 37–41 | **Reporte Cliente 1–5** | Ficha ejecutiva generada para el cliente | Comercial |

---

## 2. Flujo de Trabajo Real

```
ÁREA COMERCIAL
══════════════
[1] Perfilador
    → Define la vacante: puesto, cliente, sueldo ofertado, 
      sueldo mercado, ubicación, modalidad, herramientas, 
      competencias, experiencia, escolaridad, factores de éxito.
    
[2] Benchmark Salarial
    → Compara el sueldo contra el mercado.
    
[3] Comparativo Bolsas
    → Define en qué plataformas publicar (LinkedIn, OCC, Indeed, etc.)
    
[4] Propuesta al Cliente de Perfil
    → Documento que se envía al cliente ANTES de buscar candidatos.
      (Esto va ANTES del reclutamiento, es venta del servicio)

        ↓

ÁREA RECLUTAMIENTO
══════════════════
[5] Candidato 01–10 (Entrevista Inicial)
    → Para cada candidato: datos personales, respuestas filtro,
      resultado automático (Viable / No viable), 
      semáforo, si se agenda o no.
    
[6] Vista 10 Candidatos
    → Dashboard visual: nombre, resultado, riesgos, 
      fortalezas, si se agenda. (Los 10 al mismo tiempo)
    
[7] Entrevista Profunda 1–5
    → 37 rubros evaluados: herramientas, experiencia, escolaridad,
      soft skills, factores clave, alineación salarial, plan 30-60-90.
    → Calcula puntaje y genera: Verde ≥70% / Amarillo 65-74% / Rojo <65%
    → Genera análisis ejecutivo automático (fortalezas y brechas)
    
[8] Top 5 Entrevista Cliente
    → Ranking consolidado de los mejores 5 candidatos.
    → Muestra puntaje, resultado, siguiente paso.

        ↓

ÁREA COMERCIAL (cierre)
═══════════════════════
[9] Reporte Cliente 1–5
    → Ficha ejecutiva para enviar al cliente por candidato:
      - Datos del candidato
      - Resultado y semáforo
      - Fortalezas y brechas
      - Conclusión y siguiente paso recomendado
```

---

## 3. División por Área y Rol

### 🔵 Área Comercial
| Lo que hacen | Módulos del sistema |
|---|---|
| Crear y configurar vacantes | Perfilador |
| Consultar sueldos de mercado | Benchmark Salarial |
| Decidir dónde publicar la vacante | Comparativo Bolsas |
| Enviar propuesta al cliente (antes) | Propuesta a Cliente |
| Ver el top de candidatos listos | Top Candidatos |
| Generar y enviar reportes al cliente | Reporte Ejecutivo (PDF) |

### 🟢 Área Reclutamiento
| Lo que hacen | Módulos del sistema |
|---|---|
| Registrar candidatos | Candidatos |
| Hacer entrevista inicial (filtro) | Entrevista Inicial |
| Hacer entrevista profunda (37 rubros) | Entrevista Profunda |
| Ver dashboard de candidatos activos | Vista Control |

### 🔴 Admin
| Lo que hacen |
|---|
| Crear/gestionar usuarios y roles |
| Ver todos los módulos |
| Ver reportes globales por cliente/vacante |

---

## 4. Propuesta de Arquitectura del Sistema

### Apps Django (Backend)

```
apps/
├── usuarios/         → Login, Roles (Admin, Comercial, Reclutamiento)
├── vacantes/         → Perfilador (definición de la vacante)
├── comercial/        → Propuesta a cliente, Benchmark, Bolsas de trabajo
├── candidatos/       → Registro de candidatos por vacante
├── evaluaciones/     → Entrevista Inicial + Entrevista Profunda
├── reportes/         → Reporte ejecutivo (vista web + PDF)
└── catalogos/        → Estados/Municipios, Catálogos internos
```

### Modelos Clave

| Modelo | Campos principales |
|--------|-------------------|
| `Usuario` | nombre, email, rol (admin/comercial/reclutamiento), activo |
| `Vacante` | cliente, puesto, sueldo_oferta, sueldo_mercado, ubicación, modalidad, estado (activa/cerrada) |
| `PerfilVacante` | vacante, herramientas[], competencias_blandas[], factores_exito[], experiencia_min, escolaridad |
| `Candidato` | nombre, correo, teléfono, zona, vacante, consultor_asignado |
| `EntrevistaInicial` | candidato, respuestas (JSON), resultado, semáforo, agenda (bool), notas |
| `EntrevistaProfunda` | candidato, rubros (JSON 37 campos), puntaje, porcentaje, semáforo, analisis_ejecutivo |
| `ReporteCliente` | candidato, vacante, fortalezas, brechas, conclusion, fecha_envio, pdf_generado |

---

## 5. Preguntas Finales Antes de Arrancar

> [!IMPORTANT]
> Necesito tus respuestas para definir el plan de desarrollo.

1. **¿El login abarca todo el Sistema Integral** (el módulo de facturación/cotizaciones también) o solo esta sub-app de reclutamiento?

2. **Propuesta al Cliente**: ¿Se genera también como PDF (como el cotizador) para enviar al cliente antes del proceso, o solo queda visible en el sistema?

3. **Benchmark Salarial**: en el Excel hay una tabla de sueldos. ¿Esta tabla la alimentan ustedes manualmente en el sistema, o se conecta a alguna fuente externa?

4. **Comparativo de Bolsas**: ¿Esto lo quedan como catálogo informativo o quieres un módulo donde registren cuántos candidatos llegaron de cada plataforma?

5. **¿Tienen ya un nombre definido para esta sub-app?** (ej. "Módulo de Reclutamiento", "TalentHub", etc.)
