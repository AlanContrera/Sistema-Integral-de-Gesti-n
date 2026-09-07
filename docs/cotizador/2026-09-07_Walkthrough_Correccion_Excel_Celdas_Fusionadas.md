---
tags: [documentación, walkthrough, bugfix, excel]
date: 2026-09-07
---

# Corrección de Celdas Fusionadas en Generación de Excel (Prefacturas)

## 1. Resumen del Problema

Al generar una prefactura en Excel con **más de 2 partidas (servicios)**, las columnas I (Impuesto) y J (Monto del Impuesto) de las partidas a partir de la fila 3 aparecían incorrectamente fusionadas (merged). 
Esto causaba que el texto "002 - IVA" abarcara ambas columnas y el valor del importe del impuesto quedara oculto o sobreescrito.

## 2. Causa Raíz (Bug de openpyxl)

El problema se debía a un comportamiento documentado (bug) de la librería openpyxl:
- La plantilla original tiene celdas fusionadas en la parte inferior para los totales (Subtotal, Impuestos, Total) exactamente en las columnas I y J (filas 22, 23 y 24).
- Al usar ws.insert_rows(21, amount=X) para agregar filas dinámicamente cuando hay múltiples servicios, openpyxl desplaza correctamente el contenido y formato de las celdas hacia abajo, **pero no desplaza el registro interno de celdas fusionadas (ws.merged_cells.ranges)**.
- Como resultado, las coordenadas de fusión de los totales se quedaban "atrapadas" en las filas 22, 23 y 24. Cuando el sistema escribía los nuevos servicios en esas mismas filas, las columnas I y J heredaban la fusión fantasma.

## 3. Solución Implementada

Se modificó el motor de generación (ackend/apps/cotizador/excel_generator.py) para interceptar y corregir este fallo antes de insertar las filas.

Se implementó un desplazamiento manual (shift) iterando sobre todas las áreas fusionadas del documento. Si una celda fusionada se encuentra en la fila 21 o posterior, sus coordenadas se desplazan hacia abajo exactamente la misma cantidad de filas que se van a insertar:

`python
# Corrección: openpyxl no desplaza celdas fusionadas al insertar filas
for m in list(ws.merged_cells.ranges):
    if m.min_row >= 21:
        m.shift(0, amount) # Desplazamiento manual en el eje Y (filas)
        
ws.insert_rows(21, amount=amount)
`

## 4. Resultados

- Las partidas dinámicas ahora se imprimen en filas limpias sin fusiones accidentales, manteniendo la columna I para la etiqueta del impuesto y la columna J para el monto.
- Las etiquetas de los totales al final de la cotización conservan su formato original y fusión correcta, ya que sus coordenadas fueron desplazadas matemáticamente.

---

## 5. Enlaces Relacionados
- [[MOC Cotizador]]
- [[Arquitectura de Cotización y Facturación]]
