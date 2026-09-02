---
tags: [documentación, walkthrough, refactor, base_de_datos]
date: 2026-09-02
---

# Depuración y Consolidación de Clientes Duplicados

## 1. Resumen de la Operación

Se llevó a cabo una depuración a nivel de base de datos en el modelo \Cliente\ de Django (\pps.cotizador.models.Cliente\). Se identificaron y resolvieron **22 grupos de clientes duplicados** que compartían el mismo RFC pero diferían en su denominación (nombres cortos comerciales vs. razones sociales extendidas).

Siguiendo el criterio operativo establecido, se conservó de forma sistemática el registro con el **nombre más largo / razón social completa**, eliminando los registros redundantes y garantizando la integridad referencial de las operaciones históricas.

---

## 2. Garantía de Integridad Referencial y Datos

Antes de la eliminación de cualquier registro redundante, el script ejecutó dentro de una transacción atómica (\	ransaction.atomic\):
1. **Reasignación de Operaciones (\OperacionFacturacion\):** Verificación y migración de claves foráneas hacia el ID conservado.
2. **Transferencia de Relaciones Many-to-Many:** Vinculación de las empresas emisoras (\EmpresaEmisora\) asociadas al cliente redundante hacia el cliente consolidado.
3. **Fusión de Metadatos:** En caso de que el registro corto contara con campos poblados (correo, correos_cc, dirección, código postal o régimen fiscal) y el registro largo los tuviera nulos, se transfirieron automáticamente antes del borrado.

---

## 3. Matriz de Fusión y Depuración

| RFC | Registro Eliminado (Nombre Corto) | Registro Conservado (Nombre Largo) |
| :--- | :--- | :--- |
| \DAN2303288N6\ | [ID 155] DANOMATIC | **[ID 89] DANOMATIC S.A.S. DE C.V** |
| \GIZ220526NWA\ | [ID 109] IZGAAN | **[ID 160] GRUPO IZGAAN SA DE CV** |
| \MSC190128GB3\ | [ID 124] MULTIMODAL | **[ID 188] MULTIMODAL SOLUTIONS CARGO SRL  DE CV** |
| \SODL680323248\ | [ID 113] JOSE LUIS SORIANO | **[ID 164] JOSE LUIS SORIANO DOMINGUEZ** |
| \MRE7506242K4\ | [ID 167] MATERIALES REFRACTARIOS | **[ID 122] MATERIALES REFRACTARIOS SA DE CV** |
| \JMR200213H37\ | [ID 114] JUNAVEM | **[ID 165] JUNAVEM MANTENIMIENTO, REMODELACION Y CONSTRUCCION** |
| \SEZ151015KZ6\ | [ID 97] EZCA | **[ID 157] SOLUCIONES EZCA** |
| \REP050714ST4\ | [ID 134] RAAL | **[ID 171] RAAL EDIFICACIONES Y PROYECTOS** |
| \IEC170712SV1\ | [ID 107] INGENIEROS ESPECIALIZADOS EN CONTROL DE PLAGAS | **[ID 186] INGENIEROS ESPECIALIZADOS EN CONTROL DE PLAGAS, JARDINERIA Y LIMPIEZA** |
| \RID0705187E3\ | [ID 108] ISLA DE AGUA | **[ID 162] RESIDENCIAL ISLA DE AGUA** |
| \YSC2012088H7\ | [ID 148] YAÑEZ | **[ID 176] YAÑEZ SOLUCIONES CONTABLES** |
| \SLT211129NM4\ | [ID 142] TAMMSSA | **[ID 173] SERVICIOS LOGISTICOS Y DE TRANSPORTE TAMMSSA** |
| \ROSJ720512RT2\ | [ID 110] JAIME SANTIAGO ROBLES | **[ID 163] JAIME SANTIAGO ROBLES SALINAS** |
| \GAMA720124N83\ | [ID 75] ANTONIA GARRIDO | **[ID 151] ANTONIA GARRIDO MARTINEZ** |
| \RCP200928S68\ | [ID 137] RH CONSULTORES | **[ID 190] RH CONSULTORES PATRIMONIALES Y ASOCIADOS** |
| \GBM210625CZ7\ | [ID 100] GOLDEN BEAUTY | **[ID 159] GOLDEN BEAUTY M&P** |
| \FCA171123F58\ | [ID 98] FAUS | **[ID 158] FAUS CONSULTORIA, AGENTE DE SEGUROS** |
| \POFA7203284P5\ | [ID 74] ANA LILIA JANETH PORRAS | **[ID 150] ANA LILIA JANETH PORRAS FIGUEROA** |
| \PPO211220QC7\ | [ID 49] PROMO | **[ID 169] PROMOTORA PORTOFINO** |
| \HSI141015N64\ | [ID 104] HOLDING DE SERVICIOS | **[ID 161] HOLDING DE SERVICIOS INTERAMERICANOS** |
| \CSB190517GY4\ | [ID 154] CAMINO DEL SOL BAJA SUR | **[ID 82] CAMINO DEL SOL BAJA SUR SRL DE CV** |
| \QQS130207J66\ | [ID 170] QST QUALITY STANDARD TECHNOLOGY | **[ID 133] QST QUALITY STANDARD TECHNOLOGY SA DE CV** |

---

## 4. Métricas Finales

* **Clientes antes de depuración:** 115
* **Registros redundantes eliminados:** 22
* **Clientes únicos activos en BD:** 93
* **Transacciones / cotizaciones afectadas:** 0 (todas consolidadas en el cliente definitivo).

---

## 5. Enlaces Relacionados
- [[MOC Cotizador]]
- [[Arquitectura de Cotización y Facturación]]
- [[2026-08-28_Walkthrough_Bandejas_Historial_y_Clientes]]
