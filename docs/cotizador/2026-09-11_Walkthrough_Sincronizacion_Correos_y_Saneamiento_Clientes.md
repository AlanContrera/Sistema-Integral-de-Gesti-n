# Sincronización de Directorio, Depuración de Correos y Flexibilización de Clientes

**Fecha:** 2026-09-11  
**Módulo:** Módulo 5 - Cotizador y Facturación Empresarial  
**Contexto:** Depuración de la base de datos de clientes (`sig_db`), sincronización con directorio oficial Excel (`directorio_clientesP&M  PENDIENTES 6.xlsx`) y flexibilización del esquema `Cliente`.

---

## 1. Contexto y Diagnóstico Forense

### A. La Causa Raíz de los Correos Sintéticos (`contacto@...`)
Durante la migración inicial de datos hacia PostgreSQL (commit `553204e` de agosto 2026), el modelo `Cliente` exigía de forma obligatoria el campo `correo` (`EmailField(blank=False, null=False)`).
Para evitar que el motor de base de datos rechazara clientes que venían sin correo o con leyenda `"PENDIENTE"` en los catálogos previos, un script de carga inicial autogeneró direcciones ficticias usando el patrón:
$$\text{correo} = \texttt{contacto@} + \text{primeros 12 caracteres de la empresa} + \texttt{.com}$$
*Ejemplos generados:* `contacto@analiliajane.com`, `contacto@antoniagarri.com`, `contacto@goldenbeauty.com`, etc.

### B. Bloqueo en Django Admin
Posteriormente, la migración `0013_alter_cliente_correo` removió la restricción `NOT NULL` en la base de datos PostgreSQL (`DROP NOT NULL`), pero en el código Python de `models.py` el campo no contaba con `blank=True`. Como resultado:
* La base de datos aceptaba valores nulos o vacíos.
* Los formularios de Django y el **Django Admin** bloqueaban cualquier edición o intento de limpiar el correo arrojando el error: *"Este campo es obligatorio"*.

---

## 2. Acciones Ejecutadas

### A. Sincronización con Directorio Excel (`directorio_clientesP&M  PENDIENTES 6.xlsx`)
Se realizó un cruce exhaustivo entre los 162 clientes de la base de datos y las 323 empresas del directorio de clientes en Excel:

1. **21 Clientes con correos legítimos restaurados:** Se reemplazaron los correos comodín por las direcciones reales del Excel. En casos con correos adicionales, estos fueron preservados en `correos_cc`.
2. **Soporte CC en correos departamentales:** En clientes con cuentas diferenciadas (ej. compras vs facturación), se mantuvo la principal y se agregó la secundaria a `correos_cc` (`RAAL EDIFICACIONES Y PROYECTOS`, `US TECHNOLOGIES`).
3. **Eliminación del 100% de correos sintéticos:** Todos los clientes que no contaban con correo en el Excel (marcados como "PENDIENTE" o vacíos) fueron limpiados a cadena vacía `""`.
4. **Respeto estricto del catálogo existente:** No se crearon ni duplicaron empresas nuevas en la base de datos (se mantuvieron los 162 registros exactos).

### B. Auditoría y Corrección de Casos Particulares
* **DANIEL ANTONIO PEREZ CABRERA:** En el Excel (Filas 27 y 171) no posee correo. Se detectó y subsanó un falso positivo con `EZCA` (subcadena en `PEREZ CABRERA`), asignando `sezca15@gmail.com` a **SOLUCIONES EZCA** y dejando a Daniel en blanco.
* **GOLDEN BEAUTY M&P:** En el Excel (Fila 40) el correo correspondía a un salón de belleza particular (`IVONNE GARCIA`). Se dejó en blanco `""` para la razón social del grupo.
* **PROMOTORA PORTOFINO:** En el Excel (Fila 81) no tiene correo (`None`). Se eliminaron asignaciones erróneas y quedó en blanco `""`.

### C. Flexibilización del Modelo `Cliente`
En `backend/apps/cotizador/models.py`:
```python
# Línea actualizada:
correo = models.EmailField(blank=True, null=True, help_text='Correo principal donde se enviará la cotización')
```
* **Efecto:** El Django Admin y los serializadores de DRF ahora permiten registrar y actualizar clientes sin exigir correo electrónico obligatorio, reflejando el estatus real de los clientes pendientes.

---

## 3. Estado Final de la Base de Datos

| Indicador | Antes | Después |
| :--- | :---: | :---: |
| **Total de clientes en BD** | 162 | **162** (sin altas no deseadas) |
| **Correos sintéticos (`contacto@...`)** | 84 | **0** (0% ficticios) |
| **Clientes con correo real verificado** | 78 | **97** (+24.3%) |
| **Clientes con correo pendiente/vacío** | 0 (tenían correos falsos) | **65** (legítimamente en blanco) |

---

## 4. Normativa SAT CFDI 4.0: Razones Sociales sin "S.A. de C.V."

Se confirmó que el sistema almacena y procesa las razones sociales **sin el régimen societario** (sin *"S.A. de C.V."*, sin *"S. de R.L."*):
* Conforme al **Anexo 20 del SAT (CFDI 4.0)**, es una disposición oficial obligatoria que el campo `Nombre` del receptor se capture **sin el tipo de sociedad**.
* El sistema respeta los datos originales del catálogo fiscal sin agregar ni concatenar sufijos indebidos, asegurando un timbrado fiscal 100% válido.
