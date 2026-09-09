---
tags: [documentación, walkthrough, auditoria, cotizador]
date: 2026-09-09
---

# Auditoría de Clientes Sin Correo Electrónico

## 1. Resumen Ejecutivo

Se ejecutó una consulta directa sobre la base de datos PostgreSQL (`sig_db`) en el modelo `apps.cotizador.models.Cliente` para auditar la integridad de los datos de contacto. De un total de **161 clientes registrados**, se identificaron **42 clientes sin correo electrónico** (campo `correo` vacío o nulo).

> [!IMPORTANT]
> Los 42 clientes listados no pueden recibir cotizaciones ni notificaciones automáticas por correo electrónico hasta que se capture su dirección de contacto principal.

---

## 2. Métricas Generales

| Métrica | Cantidad | Porcentaje |
| :--- | :--- | :--- |
| Clientes totales en BD | 161 | 100% |
| Clientes con correo registrado | 119 | 73.91% |
| Clientes sin correo electrónico | 42 | 26.09% |

---

## 3. Listado Detallado de Clientes Sin Correo Electrónico

| ID | Empresa / Razón Social | RFC | Estatus Correo |
| :--- | :--- | :--- | :--- |
| 210 | ALARMAS Y MONITOREO COMPUTARIZADO | AMC060619U58 | Faltante |
| 212 | ASOCIACION MEXICANA DE GERONTOLOGIA Y GERIATRIA | AMG840831Q93 | Faltante |
| 213 | BECTON DICKINSON DE MEXICO SA DE CV | BDM571004IZ6 | Faltante |
| 214 | CANADIAN TOWERS & FIBER OPTICS | CTA180409RA6 | Faltante |
| 215 | CARCAMOVIL MEXICO | CME220205UD7 | Faltante |
| 216 | CARLOS ALBERTO MARTINEZ VELAZQUEZ | MAVC921222IW1 | Faltante |
| 217 | CARLOS ALVARADO SANCHEZ | AASC870611D60 | Faltante |
| 218 | COMPACTOR FACTORY | CFA2505279M2 | Faltante |
| 221 | CONSTRUCTORA Y MATERIALES GRUPO OLIVARES | CMG131014MV3 | Faltante |
| 224 | DESARROLLO Y PROYECTO NOVATEC | DPN240624469 | Faltante |
| 225 | DRENLAND DE MEXICO | DME170417KM9 | Faltante |
| 226 | ECO URBANA CLEAN | EUC190524MB7 | Faltante |
| 227 | EDGAR ALFREDO MORAN RAMOS | MORE760421PF7 | Faltante |
| 228 | EDUCACION SUPERIOR GRUPO G8D | ESG1711139N2 | Faltante |
| 230 | FABIOLA LIZETTE DURAN FOSTER | DUFF860209PA0 | Faltante |
| 231 | FUERTE AMARETI | FAM231116F7A | Faltante |
| 232 | GOBIERNO DEL ESTADO DE MEXICO | GEM850101BJ3 | Faltante |
| 233 | GRUPO ALTOZANO | ANT101129HE8 | Faltante |
| 234 | HOGARIKA | HOG240215GQ0 | Faltante |
| 236 | INDI OPERACIONES | IOP130131393 | Faltante |
| 238 | INMOBILIARIA BELEVI S.A. DE C.V. | IBE121219BL4 | Faltante |
| 243 | ITZEL NAYELI OCHOA HERNANDEZ | OOHI900802BC2 | Faltante |
| 244 | JAIR MOISES GAYTAN GUTIERREZ | GAGJ800430H61 | Faltante |
| 245 | JAVIER LEZAMA SANTOS | LESJ761011UB7 | Faltante |
| 246 | JAVIER RUIZ REYES | RURJ820502PT9 | Faltante |
| 247 | JD ROMO JOEL ALCANTARA CHAVEZ | AACJ700403MB0 | Faltante |
| 248 | JESUS TREJO DOMINGUEZ | TEDJ800706QA3 | Faltante |
| 250 | JULIO CESAR HERNANDEZ RIOS | HERJ570619J94 | Faltante |
| 251 | LUIS ENRIQUE HERNANDEZ CARRO | HECL920728NT4 | Faltante |
| 255 | NUEVA PASION AUTOMOTRIZ | NPA200130LGA | Faltante |
| 256 | OLSA SISTEMAS DE ILUMINACION AUTOMOTRIZ | OSI110103Q79 | Faltante |
| 257 | PENTAFON HR | PCG2203316I0 | Faltante |
| 258 | PENTAFONINT | PEN060911S27 | Faltante |
| 260 | PROVEDORES INDUSTRIALES CHIMALHUACAN | PIC050818AX8 | Faltante |
| 261 | SIEGFRIED RHEIN | SRH941004ERA | Faltante |
| 265 | STRONG PARTS | SPA111014DJ5 | Faltante |
| 266 | TEXCO35 | TTC241211VB9 | Faltante |
| 268 | U547 | UXX2406177X7 | Faltante |
| 269 | UNIVERSIDAD CUAUHTEMOC PLANTEL QUERETARO | UCP930917CB1 | Faltante |
| 271 | VICTOR MANUEL LOPEZ VARGAS | LOVV741226D5A | Faltante |
| 273 | WIM SOLUCIONES INDUSTRIALES | WSI180801UXA | Faltante |
| 274 | YANET HERNANDEZ YAÑEZ | HEYY771125RA7 | Faltante |

---

## 4. Enlaces Relacionados
- [[MOC Cotizador]]
- [[2026-09-02_Walkthrough_Depuracion_Clientes]]
- [[Arquitectura de Cotización y Facturación]]
