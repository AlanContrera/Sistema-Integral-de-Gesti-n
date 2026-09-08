---
tags: [documentación, walkthrough, cotizador, catalogo, frontend, backend, base_de_datos]
date: 2026-09-07
---

# Catálogo Relacional de Conceptos y Explorador Modal de Lectura Íntegra

## 1. Resumen y Necesidad de Negocio

Para garantizar máxima precisión en la emisión de prefacturas y eliminar inconsistencias derivadas de datos históricos no curados, se implementó una arquitectura relacional limpia para el manejo de conceptos de facturación.

### Requerimientos Clave
1. **Relación Estricta:** Los conceptos de facturación deben estar formalmente vinculados tanto al **Cliente Receptor** como a la **Empresa Emisora**.
2. **Lectura Completa (UX sin Truncamiento):** Dado que las descripciones de servicios (legales, administrativos, gestorías) abarcan múltiples líneas técnicas, el usuario debe poder leer el texto **100% íntegro** antes de seleccionarlo, evitando menús desplegables comprimidos o textos recortados con `...`.
3. **Inyección Atómica y Edición Libre:** Al elegir un concepto, deben auto-completarse la descripción, la clave SAT y la unidad, permitiendo al operador seguir editando libremente el campo de texto si requiere ajustar meses, folios o detalles específicos.

---

## 2. Arquitectura de Base de Datos y Backend

### 2.1 Modelo `ConceptoCliente` (`backend/apps/cotizador/models.py`)
```python
class ConceptoCliente(models.Model):
    empresa_emisora = models.ForeignKey(EmpresaEmisora, on_delete=models.CASCADE, related_name='conceptos_cliente')
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='conceptos_autorizados')
    descripcion = models.TextField(help_text='Texto o descripción del concepto de facturación')
    clave_sat = models.CharField(max_length=20, default='80141600', blank=True, help_text='Clave SAT')
    unidad_sat = models.CharField(max_length=10, default='E48', blank=True, help_text='Clave de unidad SAT')

    def __str__(self):
        return f"[{self.empresa_emisora.nombre_empresa}] {self.cliente.razon_social} - {self.descripcion[:40]}..."
```
* **Migración:** `0012_conceptocliente.py` aplicada exitosamente en PostgreSQL.

### 2.2 Endpoint REST (`backend/apps/cotizador/views.py` y `urls.py`)
* **Ruta:** `GET /api/cotizador/conceptos-cliente/?cliente_id=X&empresa_id=Y`
* **Permisos:** `AllowAny` (acceso directo desde el formulario web).
* **Respuesta:**
```json
{
  "conceptos": [
    {
      "id": 1,
      "descripcion": "Gestoria y trámites. Septiembre 2026",
      "clave_sat": "80141600",
      "unidad_sat": "E48"
    }
  ]
}
```

### 2.3 Carga Inicial de Datos
Se procesó el archivo oficial `ESTRATEGIA ANA LILIA.xlsx`, registrando los 12 conceptos autorizados para la cliente **ANA LILIA JANETH PORRAS FIGUEROA (ID: 150)** vinculados a:
* **LEXIC:** 4 conceptos de trámites notariales, razón social y registro público.
* **BERZAN:** 3 conceptos de análisis legal, informes y contabilidad financiera.
* **FICSAR:** 5 conceptos de custodia documental, evaluación de procesos y archivo institucional.

---

## 3. Frontend y Experiencia de Usuario (UX)

### 3.1 Componente `CatalogoConceptosModal.jsx`
Se creó un explorador modal estilo SaaS / Command Palette:
* **Tarjetas Completas:** Renderizado con `whiteSpace: 'pre-wrap'` para preservar párrafos y saltos de línea sin límite de altura.
* **Buscador Dinámico:** Filtro en tiempo real por palabras clave del concepto o por clave SAT.
* **Micro-interacciones:** Efecto hover con elevación suave y borde violeta orquídea (`#C084FC`).
* **Chips Fiscales:** Indicadores claros de `SAT: [clave]` y `Unidad: [clave]`.

### 3.2 Integración en `FormularioPreFactura.jsx`
* **Botón en Fila:** Si existen conceptos autorizados para la combinación Cliente-Empresa, aparece el botón interactivo `Ver Catálogo (N)` junto a la etiqueta de *Descripción*.
* **Actualización Atómica de Estado:** Se implementó una actualización funcional inmutable (`setPartidas(prev => prev.map(...))`), inyectando en un solo ciclo de render la descripción, la clave SAT y la unidad, resolviendo problemas de concurrencia en React.

---

## 4. Verificación y Resultados

- [x] Consulta dinámica en frontend al cambiar de Empresa Emisora o Cliente.
- [x] Modal responsivo con scroll suave y lectura íntegra de descripciones extensas.
- [x] Auto-relleno instantáneo de partida sin bloquear la edición manual posterior.
- [x] Django System Check: 0 issues reportados.
