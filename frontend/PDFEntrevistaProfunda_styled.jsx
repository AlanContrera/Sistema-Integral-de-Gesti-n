import React from 'react';

const PDFEntrevistaProfunda = React.forwardRef(({ candidato, entrevistaInicial, entrevistaProfunda, vacante }, ref) => {
    return (
        <div ref={ref} className="excel-report-container" style={{ width: '210mm', padding: '10mm', backgroundColor: '#FFF', boxSizing: 'border-box' }}>
<table style={{ borderCollapse: "collapse", width: "100%", fontFamily: "Arial, sans-serif", fontSize: "10px", tableLayout: "fixed" }}>
<tbody>
  <colgroup>
    <col style={{ width: "131.44140625px" }} />
    <col style={{ width: "229.44140625px" }} />
    <col style={{ width: "386.53125px" }} />
    <col style={{ width: "140px" }} />
    <col style={{ width: "152.44140625px" }} />
    <col style={{ width: "178.08984375px" }} />
    <col style={{ width: "188.20703125px" }} />
  </colgroup>
  <tr style={{ height: "18px", pageBreakInside: "avoid" }}>
    <td colSpan="7"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#FFFFFF", fontSize: "14pt", backgroundColor: "#1F4E78", textAlign: "center", verticalAlign: "top" }}>FORMULARIO DE ENTREVISTA PROFUNDA / EVALUACIÓN PARA ENVÍO AL CLIENTE</td>
  </tr>
  <tr style={{ height: "51.45px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#D9EAF7", textAlign: "left" }}>Puesto</td>
    <td colSpan="2"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", backgroundColor: "#D9EAF7", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#D9EAF7", textAlign: "left", verticalAlign: "middle" }}>Ubicación</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", backgroundColor: "#D9EAF7", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#D9EAF7", textAlign: "center", verticalAlign: "middle" }}>Fecha</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", backgroundColor: "#D9EAF7", textAlign: "center", verticalAlign: "middle" }}>Wed Jul 22 2026 18:00:00 GMT-0600 (hora estándar central)</td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#D9EAF7", textAlign: "left" }}>Sueldo propuesto</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#D9EAF7", textAlign: "left" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", backgroundColor: "#D9EAF7", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#D9EAF7", verticalAlign: "middle" }}>Promedio mercado</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", backgroundColor: "#D9EAF7", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#D9EAF7", textAlign: "center", verticalAlign: "middle" }}>Resultado inicial</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", backgroundColor: "#D9EAF7", textAlign: "center", verticalAlign: "middle" }}>Pendiente: faltan respuestas</td>
  </tr>
  <tr style={{ height: "14.55px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#D9EAF7", textAlign: "left" }}>Objetivo</td>
    <td colSpan="6"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#D9EAF7", textAlign: "center", verticalAlign: "top" }}>Evaluar con evidencia el dominio técnico, experiencia, actitud, salario y viabilidad logística para decidir si el candidato debe enviarse a entrevista con el cliente.</td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td colSpan="7"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#FFFFFF", fontSize: "11pt", backgroundColor: "#1F4E78", textAlign: "center" }}>DATOS DEL CANDIDATO Y ENTREVISTA</td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#D9EAF7", textAlign: "left" }}>Nombre</td>
    <td colSpan="3"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center" }}>Candidato 01</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#D9EAF7", textAlign: "center", verticalAlign: "top" }}>Teléfono / correo</td>
    <td colSpan="2"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#D9EAF7", textAlign: "left" }}>Zona / traslado</td>
    <td colSpan="3"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#D9EAF7", textAlign: "center", verticalAlign: "top" }}>Hora entrevista</td>
    <td colSpan="2"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#D9EAF7", textAlign: "left" }}>Entrevistador</td>
    <td colSpan="3"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#D9EAF7", textAlign: "center", verticalAlign: "top" }}>Disponibilidad ingreso</td>
    <td colSpan="2"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "28.8px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#FFFFFF", fontSize: "11pt", backgroundColor: "#1F4E78", textAlign: "center", verticalAlign: "middle" }}>#</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#FFFFFF", fontSize: "11pt", backgroundColor: "#1F4E78", textAlign: "center", verticalAlign: "middle" }}>Paquete / rubro</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#FFFFFF", fontSize: "11pt", backgroundColor: "#1F4E78", textAlign: "center", verticalAlign: "middle" }}>Pregunta / criterio evaluado</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#FFFFFF", fontSize: "11pt", backgroundColor: "#1F4E78", textAlign: "center", verticalAlign: "middle" }}>Evidencia esperada</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#FFFFFF", fontSize: "11pt", backgroundColor: "#1F4E78", textAlign: "center", verticalAlign: "middle" }}>Nivel expresado por candidato</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#FFFFFF", fontSize: "11pt", backgroundColor: "#1F4E78", textAlign: "center", verticalAlign: "middle" }}>Puntaje automático</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#FFFFFF", fontSize: "11pt", backgroundColor: "#1F4E78", textAlign: "center", verticalAlign: "middle" }}>Notas / evidencia del candidato</td>
  </tr>
  <tr style={{ height: "72px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}>1</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F1F1F", fontSize: "11pt", backgroundColor: "#D9EAF7", textAlign: "center", verticalAlign: "middle" }}>Actividad crítica general</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "left", verticalAlign: "middle" }}>Selecciona primero un puesto en Perfilador!B11</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "top" }}>Debe explicar proceso, herramientas, riesgos, entregables, indicadores y resultado.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "86.4px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#EAF4EA", textAlign: "center", verticalAlign: "middle" }}>2</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F1F1F", fontSize: "11pt", backgroundColor: "#E2F0D9", textAlign: "center", verticalAlign: "middle" }}>Funciones principales</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "left", verticalAlign: "middle" }}>Sobre la función: función crítica del puesto. ¿La has realizado directamente? Indica frecuencia, nivel de autonomía, herramientas utilizadas, problema resuelto y resultado medible.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "top" }}>Debe evidenciar experiencia práctica, alcance real, frecuencia, autonomía y resultados comprobables.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "86.4px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#EAF4EA", textAlign: "center", verticalAlign: "middle" }}>3</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F1F1F", fontSize: "11pt", backgroundColor: "#E2F0D9", textAlign: "center", verticalAlign: "middle" }}>Funciones principales</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "left", verticalAlign: "middle" }}>Sobre la función: función crítica del puesto. ¿La has realizado directamente? Indica frecuencia, nivel de autonomía, herramientas utilizadas, problema resuelto y resultado medible.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "top" }}>Debe evidenciar experiencia práctica, alcance real, frecuencia, autonomía y resultados comprobables.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "86.4px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#EAF4EA", textAlign: "center", verticalAlign: "middle" }}>4</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F1F1F", fontSize: "11pt", backgroundColor: "#E2F0D9", textAlign: "center", verticalAlign: "middle" }}>Funciones principales</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "left", verticalAlign: "middle" }}>Sobre la función: función crítica del puesto. ¿La has realizado directamente? Indica frecuencia, nivel de autonomía, herramientas utilizadas, problema resuelto y resultado medible.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "top" }}>Debe evidenciar experiencia práctica, alcance real, frecuencia, autonomía y resultados comprobables.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "86.4px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#EAF4EA", textAlign: "center", verticalAlign: "middle" }}>5</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F1F1F", fontSize: "11pt", backgroundColor: "#E2F0D9", textAlign: "center", verticalAlign: "middle" }}>Funciones principales</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "left", verticalAlign: "middle" }}>Sobre la función: función crítica del puesto. ¿La has realizado directamente? Indica frecuencia, nivel de autonomía, herramientas utilizadas, problema resuelto y resultado medible.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "top" }}>Debe evidenciar experiencia práctica, alcance real, frecuencia, autonomía y resultados comprobables.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "86.4px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#EAF4EA", textAlign: "center", verticalAlign: "middle" }}>6</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F1F1F", fontSize: "11pt", backgroundColor: "#E2F0D9", textAlign: "center", verticalAlign: "middle" }}>Funciones principales</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "left", verticalAlign: "middle" }}>Sobre la función: función crítica del puesto. ¿La has realizado directamente? Indica frecuencia, nivel de autonomía, herramientas utilizadas, problema resuelto y resultado medible.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "top" }}>Debe evidenciar experiencia práctica, alcance real, frecuencia, autonomía y resultados comprobables.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "86.4px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#EAF4EA", textAlign: "center", verticalAlign: "middle" }}>7</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F1F1F", fontSize: "11pt", backgroundColor: "#FCE4D6", textAlign: "center", verticalAlign: "middle" }}>Responsabilidades críticas</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "left", verticalAlign: "middle" }}>Respecto a la responsabilidad: responsabilidad crítica del puesto. Cuéntame un caso real donde fuiste responsable. ¿Qué ocurrió, qué decisión tomaste, con quién coordinaste, qué evidencia dejaste y cómo cerraste el pendiente?</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "top" }}>Debe demostrar criterio, responsabilidad, coordinación, trazabilidad y cierre efectivo.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "86.4px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#EAF4EA", textAlign: "center", verticalAlign: "middle" }}>8</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F1F1F", fontSize: "11pt", backgroundColor: "#FCE4D6", textAlign: "center", verticalAlign: "middle" }}>Responsabilidades críticas</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "left", verticalAlign: "middle" }}>Respecto a la responsabilidad: responsabilidad crítica del puesto. Cuéntame un caso real donde fuiste responsable. ¿Qué ocurrió, qué decisión tomaste, con quién coordinaste, qué evidencia dejaste y cómo cerraste el pendiente?</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "top" }}>Debe demostrar criterio, responsabilidad, coordinación, trazabilidad y cierre efectivo.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "86.4px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#EAF4EA", textAlign: "center", verticalAlign: "middle" }}>9</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F1F1F", fontSize: "11pt", backgroundColor: "#FCE4D6", textAlign: "center", verticalAlign: "middle" }}>Responsabilidades críticas</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "left", verticalAlign: "middle" }}>Respecto a la responsabilidad: responsabilidad crítica del puesto. Cuéntame un caso real donde fuiste responsable. ¿Qué ocurrió, qué decisión tomaste, con quién coordinaste, qué evidencia dejaste y cómo cerraste el pendiente?</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "top" }}>Debe demostrar criterio, responsabilidad, coordinación, trazabilidad y cierre efectivo.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "86.4px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#EAF4EA", textAlign: "center", verticalAlign: "middle" }}>10</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F1F1F", fontSize: "11pt", backgroundColor: "#FCE4D6", textAlign: "center", verticalAlign: "middle" }}>Responsabilidades críticas</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "left", verticalAlign: "middle" }}>Respecto a la responsabilidad: responsabilidad crítica del puesto. Cuéntame un caso real donde fuiste responsable. ¿Qué ocurrió, qué decisión tomaste, con quién coordinaste, qué evidencia dejaste y cómo cerraste el pendiente?</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "top" }}>Debe demostrar criterio, responsabilidad, coordinación, trazabilidad y cierre efectivo.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "86.4px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#EAF4EA", textAlign: "center", verticalAlign: "middle" }}>11</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F1F1F", fontSize: "11pt", backgroundColor: "#FCE4D6", textAlign: "center", verticalAlign: "middle" }}>Responsabilidades críticas</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "left", verticalAlign: "middle" }}>Respecto a la responsabilidad: responsabilidad crítica del puesto. Cuéntame un caso real donde fuiste responsable. ¿Qué ocurrió, qué decisión tomaste, con quién coordinaste, qué evidencia dejaste y cómo cerraste el pendiente?</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "top" }}>Debe demostrar criterio, responsabilidad, coordinación, trazabilidad y cierre efectivo.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "72px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#EAF4EA", textAlign: "center", verticalAlign: "middle" }}>12</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F1F1F", fontSize: "11pt", backgroundColor: "#DDEBF7", textAlign: "center", verticalAlign: "middle" }}>Competencias técnicas</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "left", verticalAlign: "middle" }}>En la competencia técnica: competencia técnica requerida. ¿Qué nivel tienes, dónde la aplicaste, qué problemas resolviste, qué errores comunes evitarías y qué evidencia puedes compartir?</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "top" }}>Debe demostrar dominio real, ejemplos aplicados, riesgos técnicos y evidencia de uso.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "72px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#EAF4EA", textAlign: "center", verticalAlign: "middle" }}>13</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F1F1F", fontSize: "11pt", backgroundColor: "#DDEBF7", textAlign: "center", verticalAlign: "middle" }}>Competencias técnicas</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "left", verticalAlign: "middle" }}>En la competencia técnica: competencia técnica requerida. ¿Qué nivel tienes, dónde la aplicaste, qué problemas resolviste, qué errores comunes evitarías y qué evidencia puedes compartir?</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "top" }}>Debe demostrar dominio real, ejemplos aplicados, riesgos técnicos y evidencia de uso.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "72px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#EAF4EA", textAlign: "center", verticalAlign: "middle" }}>14</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F1F1F", fontSize: "11pt", backgroundColor: "#DDEBF7", textAlign: "center", verticalAlign: "middle" }}>Competencias técnicas</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "left", verticalAlign: "middle" }}>En la competencia técnica: competencia técnica requerida. ¿Qué nivel tienes, dónde la aplicaste, qué problemas resolviste, qué errores comunes evitarías y qué evidencia puedes compartir?</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "top" }}>Debe demostrar dominio real, ejemplos aplicados, riesgos técnicos y evidencia de uso.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "72px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#EAF4EA", textAlign: "center", verticalAlign: "middle" }}>15</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F1F1F", fontSize: "11pt", backgroundColor: "#DDEBF7", textAlign: "center", verticalAlign: "middle" }}>Competencias técnicas</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "left", verticalAlign: "middle" }}>En la competencia técnica: competencia técnica requerida. ¿Qué nivel tienes, dónde la aplicaste, qué problemas resolviste, qué errores comunes evitarías y qué evidencia puedes compartir?</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "top" }}>Debe demostrar dominio real, ejemplos aplicados, riesgos técnicos y evidencia de uso.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "72px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#EAF4EA", textAlign: "center", verticalAlign: "middle" }}>16</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F1F1F", fontSize: "11pt", backgroundColor: "#DDEBF7", textAlign: "center", verticalAlign: "middle" }}>Competencias técnicas</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "left", verticalAlign: "middle" }}>En la competencia técnica: competencia técnica requerida. ¿Qué nivel tienes, dónde la aplicaste, qué problemas resolviste, qué errores comunes evitarías y qué evidencia puedes compartir?</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "top" }}>Debe demostrar dominio real, ejemplos aplicados, riesgos técnicos y evidencia de uso.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "72px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#EAF4EA", textAlign: "center", verticalAlign: "middle" }}>17</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F1F1F", fontSize: "11pt", backgroundColor: "#EADCF8", textAlign: "center", verticalAlign: "middle" }}>Herramientas / software</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "left", verticalAlign: "middle" }}>Para la herramienta/sistema: Herramientas, equipo o sistemas requeridos para el puesto. ¿Qué tanto lo dominas, qué tareas has hecho, qué limitaciones reconoces y qué resultado entregaste?</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "top" }}>Debe explicar uso práctico, nivel de dominio, casos reales, límites y resultados entregados.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "72px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#EAF4EA", textAlign: "center", verticalAlign: "middle" }}>18</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F1F1F", fontSize: "11pt", backgroundColor: "#EADCF8", textAlign: "center", verticalAlign: "middle" }}>Herramientas / software</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "left", verticalAlign: "middle" }}>Para la herramienta/sistema: Procedimientos y controles operativos. ¿Qué tanto lo dominas, qué tareas has hecho, qué limitaciones reconoces y qué resultado entregaste?</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "top" }}>Debe explicar uso práctico, nivel de dominio, casos reales, límites y resultados entregados.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "72px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#EAF4EA", textAlign: "center", verticalAlign: "middle" }}>19</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F1F1F", fontSize: "11pt", backgroundColor: "#EADCF8", textAlign: "center", verticalAlign: "middle" }}>Herramientas / software</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "left", verticalAlign: "middle" }}>Para la herramienta/sistema: Documentación y evidencias del trabajo. ¿Qué tanto lo dominas, qué tareas has hecho, qué limitaciones reconoces y qué resultado entregaste?</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "top" }}>Debe explicar uso práctico, nivel de dominio, casos reales, límites y resultados entregados.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "72px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#EAF4EA", textAlign: "center", verticalAlign: "middle" }}>20</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F1F1F", fontSize: "11pt", backgroundColor: "#EADCF8", textAlign: "center", verticalAlign: "middle" }}>Herramientas / software</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "left", verticalAlign: "middle" }}>Para la herramienta/sistema: Comunicación y seguimiento con áreas involucradas. ¿Qué tanto lo dominas, qué tareas has hecho, qué limitaciones reconoces y qué resultado entregaste?</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "top" }}>Debe explicar uso práctico, nivel de dominio, casos reales, límites y resultados entregados.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "72px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}>21</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F1F1F", fontSize: "11pt", backgroundColor: "#FCE4D6", textAlign: "center", verticalAlign: "middle" }}>Experiencia mínima</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "left", verticalAlign: "middle" }}>Confirma tu experiencia para el puesto: años, empresas, funciones similares, responsabilidades principales, logros y evidencia comprobable.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "top" }}>Debe cumplir o justificar experiencia mínima, estabilidad, responsabilidades y logros medibles.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "72px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}>22</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F1F1F", fontSize: "11pt", backgroundColor: "#E2F0D9", textAlign: "center", verticalAlign: "middle" }}>Escolaridad</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "left", verticalAlign: "middle" }}>Confirma tu escolaridad y formación: carrera, institución, estatus, comprobante disponible y relación con la vacante</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "top" }}>Debe cumplir escolaridad/carrera o explicar brecha, avance y comprobantes disponibles.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "72px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#EAF4EA", textAlign: "center", verticalAlign: "middle" }}>23</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F1F1F", fontSize: "11pt", backgroundColor: "#FFF2CC", textAlign: "center", verticalAlign: "middle" }}>Competencias blandas</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "left", verticalAlign: "middle" }}>Sobre Comunicación clara y profesional con clientes, candidatos y áreas internas: dame un ejemplo conductual concreto. ¿Cuál fue la situación, qué acción tomaste, qué resultado generaste y qué aprendiste?</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "top" }}>Debe dar un ejemplo tipo STAR: situación, acción, resultado, aprendizaje y evidencia conductual.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "72px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#EAF4EA", textAlign: "center", verticalAlign: "middle" }}>24</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F1F1F", fontSize: "11pt", backgroundColor: "#FFF2CC", textAlign: "center", verticalAlign: "middle" }}>Competencias blandas</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "left", verticalAlign: "middle" }}>Sobre Organización, seguimiento y sentido de urgencia: dame un ejemplo conductual concreto. ¿Cuál fue la situación, qué acción tomaste, qué resultado generaste y qué aprendiste?</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "top" }}>Debe dar un ejemplo tipo STAR: situación, acción, resultado, aprendizaje y evidencia conductual.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "72px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#EAF4EA", textAlign: "center", verticalAlign: "middle" }}>25</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F1F1F", fontSize: "11pt", backgroundColor: "#FFF2CC", textAlign: "center", verticalAlign: "middle" }}>Competencias blandas</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "left", verticalAlign: "middle" }}>Sobre Trabajo colaborativo y coordinación transversal: dame un ejemplo conductual concreto. ¿Cuál fue la situación, qué acción tomaste, qué resultado generaste y qué aprendiste?</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "top" }}>Debe dar un ejemplo tipo STAR: situación, acción, resultado, aprendizaje y evidencia conductual.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "72px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#EAF4EA", textAlign: "center", verticalAlign: "middle" }}>26</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F1F1F", fontSize: "11pt", backgroundColor: "#FFF2CC", textAlign: "center", verticalAlign: "middle" }}>Competencias blandas</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "left", verticalAlign: "middle" }}>Sobre Manejo de presión, prioridades e incidencias: dame un ejemplo conductual concreto. ¿Cuál fue la situación, qué acción tomaste, qué resultado generaste y qué aprendiste?</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "top" }}>Debe dar un ejemplo tipo STAR: situación, acción, resultado, aprendizaje y evidencia conductual.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "72px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#EAF4EA", textAlign: "center", verticalAlign: "middle" }}>27</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F1F1F", fontSize: "11pt", backgroundColor: "#FFF2CC", textAlign: "center", verticalAlign: "middle" }}>Competencias blandas</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "left", verticalAlign: "middle" }}>Sobre Atención al detalle y calidad documental: dame un ejemplo conductual concreto. ¿Cuál fue la situación, qué acción tomaste, qué resultado generaste y qué aprendiste?</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "top" }}>Debe dar un ejemplo tipo STAR: situación, acción, resultado, aprendizaje y evidencia conductual.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "72px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#EAF4EA", textAlign: "center", verticalAlign: "middle" }}>28</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F1F1F", fontSize: "11pt", backgroundColor: "#FFF2CC", textAlign: "center", verticalAlign: "middle" }}>Competencias blandas</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "left", verticalAlign: "middle" }}>Sobre Confidencialidad, ética y criterio profesional: dame un ejemplo conductual concreto. ¿Cuál fue la situación, qué acción tomaste, qué resultado generaste y qué aprendiste?</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "top" }}>Debe dar un ejemplo tipo STAR: situación, acción, resultado, aprendizaje y evidencia conductual.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "72px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#EAF4EA", textAlign: "center", verticalAlign: "middle" }}>29</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F1F1F", fontSize: "11pt", backgroundColor: "#DDEBF7", textAlign: "center", verticalAlign: "middle" }}>Factores clave de éxito</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "left", verticalAlign: "middle" }}>Para el factor Cumplimiento de entregables en tiempo y forma: ¿qué evidencia tienes de haberlo cumplido antes y cómo lo aplicarías durante los primeros 90 días?</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "top" }}>Debe mostrar evidencia previa, indicador asociado, forma de seguimiento y aplicación al cliente.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "72px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#EAF4EA", textAlign: "center", verticalAlign: "middle" }}>30</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F1F1F", fontSize: "11pt", backgroundColor: "#DDEBF7", textAlign: "center", verticalAlign: "middle" }}>Factores clave de éxito</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "left", verticalAlign: "middle" }}>Para el factor Calidad, seguridad y trazabilidad en la ejecución: ¿qué evidencia tienes de haberlo cumplido antes y cómo lo aplicarías durante los primeros 90 días?</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "top" }}>Debe mostrar evidencia previa, indicador asociado, forma de seguimiento y aplicación al cliente.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "72px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#EAF4EA", textAlign: "center", verticalAlign: "middle" }}>31</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F1F1F", fontSize: "11pt", backgroundColor: "#DDEBF7", textAlign: "center", verticalAlign: "middle" }}>Factores clave de éxito</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "left", verticalAlign: "middle" }}>Para el factor Comunicación oportuna de avances, riesgos e incidencias: ¿qué evidencia tienes de haberlo cumplido antes y cómo lo aplicarías durante los primeros 90 días?</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "top" }}>Debe mostrar evidencia previa, indicador asociado, forma de seguimiento y aplicación al cliente.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "72px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#EAF4EA", textAlign: "center", verticalAlign: "middle" }}>32</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F1F1F", fontSize: "11pt", backgroundColor: "#DDEBF7", textAlign: "center", verticalAlign: "middle" }}>Factores clave de éxito</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "left", verticalAlign: "middle" }}>Para el factor Evidencia documental completa y ordenada: ¿qué evidencia tienes de haberlo cumplido antes y cómo lo aplicarías durante los primeros 90 días?</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "top" }}>Debe mostrar evidencia previa, indicador asociado, forma de seguimiento y aplicación al cliente.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "72px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#EAF4EA", textAlign: "center", verticalAlign: "middle" }}>33</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F1F1F", fontSize: "11pt", backgroundColor: "#DDEBF7", textAlign: "center", verticalAlign: "middle" }}>Factores clave de éxito</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "left", verticalAlign: "middle" }}>Para el factor Servicio confiable y alineado al cliente: ¿qué evidencia tienes de haberlo cumplido antes y cómo lo aplicarías durante los primeros 90 días?</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "top" }}>Debe mostrar evidencia previa, indicador asociado, forma de seguimiento y aplicación al cliente.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "72px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#EAF4EA", textAlign: "center", verticalAlign: "middle" }}>34</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F1F1F", fontSize: "11pt", backgroundColor: "#DDEBF7", textAlign: "center", verticalAlign: "middle" }}>Factores clave de éxito</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "left", verticalAlign: "middle" }}>Para el factor Resultados medibles del puesto: ¿qué evidencia tienes de haberlo cumplido antes y cómo lo aplicarías durante los primeros 90 días?</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "top" }}>Debe mostrar evidencia previa, indicador asociado, forma de seguimiento y aplicación al cliente.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "86.4px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#EAF4EA", textAlign: "center", verticalAlign: "middle" }}>35</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F1F1F", fontSize: "11pt", backgroundColor: "#FCE4D6", textAlign: "center", verticalAlign: "middle" }}>Alineación salarial</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "left", verticalAlign: "middle" }}>La oferta considerada es de $0 y el mercado de referencia es . ¿Tu expectativa salarial está alineada? ¿Qué condiciones necesitas para aceptar y mantenerte en el proceso?</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "top" }}>Debe confirmar aceptación, expectativa económica, rango negociable y riesgo de rechazo.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "72px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}>36</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F1F1F", fontSize: "11pt", backgroundColor: "#E7E6E6", textAlign: "center", verticalAlign: "middle" }}>Traslado / disponibilidad</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "left", verticalAlign: "middle" }}>Considerando la ubicación pendiente de definir, ¿cuánto tiempo harías de traslado, qué ruta usarías, qué riesgos ves y cómo asegurarías puntualidad?</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "top" }}>Debe confirmar viabilidad real de zona, traslado, horario, puntualidad y disponibilidad.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "72px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}>37</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F1F1F", fontSize: "11pt", backgroundColor: "#E2F0D9", textAlign: "center", verticalAlign: "middle" }}>Plan 30-60-90</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "left", verticalAlign: "middle" }}>Para el puesto de la vacante, plantea tu plan 30-60-90 días: qué aprenderías, qué estabilizarías, qué entregables priorizarías y qué indicador reportarías.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "top" }}>Debe mostrar prioridades de arranque, aprendizaje, estabilización, mejora e indicadores.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td colSpan="7"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#FFFFFF", fontSize: "11pt", backgroundColor: "#1F4E78", textAlign: "center" }}>RESUMEN AUTOMÁTICO — ENVÍO A ENTREVISTA PRESENCIAL CON CLIENTE</td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#D9EAF7", textAlign: "center", verticalAlign: "top" }}>Puntaje obtenido</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#FFFFFF", fontSize: "11pt", backgroundColor: "#5B9BD5", textAlign: "center", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#D9EAF7", textAlign: "center", verticalAlign: "top" }}>Puntaje máximo</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#FFFFFF", fontSize: "11pt", backgroundColor: "#5B9BD5", textAlign: "center", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#D9EAF7", textAlign: "center", verticalAlign: "top" }}>Porcentaje</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#FFFFFF", fontSize: "11pt", backgroundColor: "#5B9BD5", textAlign: "center", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#FFFFFF", fontSize: "11pt", backgroundColor: "#5B9BD5", textAlign: "center", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#D9EAF7", verticalAlign: "top" }}>Nulos</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#D9EAF7", verticalAlign: "top" }}>Básicos</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#D9EAF7", verticalAlign: "top" }}>Intermedios</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#D9EAF7", verticalAlign: "top" }}>Expertos</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#D9EAF7", verticalAlign: "top" }}>Preguntas evaluadas</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#D9EAF7", verticalAlign: "top" }}>Mínimo recomendado</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>0.7</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#D9EAF7" }}>Resultado sugerido</td>
    <td colSpan="6"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}>Pendiente: faltan evaluaciones</td>
  </tr>
  <tr style={{ height: "28.8px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#D9EAF7", verticalAlign: "top" }}>Siguiente paso sugerido</td>
    <td colSpan="6"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}>Completar niveles y notas antes de presentar al cliente.</td>
  </tr>
  <tr style={{ height: "28.8px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#D9EAF7", verticalAlign: "top" }}>Justificación automática</td>
    <td colSpan="6"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}>Aún no hay suficientes evaluaciones para emitir recomendación confiable.</td>
  </tr>
  <tr style={{ height: "28.8px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#D9EAF7", verticalAlign: "top" }}>Decisión final del entrevistador</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#F2F2F2", textAlign: "left", verticalAlign: "middle" }}>Comentarios finales</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#D9EAF7" }}>Semáforo</td>
    <td colSpan="6"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}>Pendiente: faltan evaluaciones</td>
  </tr>
  <tr style={{ height: "28.8px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt" }}>Siguiente paso sugerido</td>
    <td colSpan="6"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}>No enviar al cliente todavía.</td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td colSpan="7"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#FFFFFF", fontSize: "11pt", backgroundColor: "#1F4E78" }}>ANÁLISIS EJECUTIVO PARA CLIENTE</td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td colSpan="7"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", backgroundColor: "#D9EAF7" }}>Análisis ejecutivo para cliente: se evaluaron 0 rubros con 0% de cumplimiento (0 de 0 puntos). Distribución: 0 experto(s), 0 intermedio(s), 0 básico(s), 0 nulo(s). Decisión sugerida: Pendiente: faltan evaluaciones. Completar niveles y notas antes de presentar al cliente.</td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td colSpan="3"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#E2F0D9" }}>Fortalezas principales</td>
    <td colSpan="4"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#FCE4D6" }}>Riesgos / brechas a validar</td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td colSpan="3" rowSpan="3" style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}>• Sin fortalezas calificadas todavía.</td>
    <td colSpan="4" rowSpan="3" style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}>• Sin riesgos críticos calificados todavía.</td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td colSpan="7"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#FFF2CC" }}>Notas/evidencia capturada</td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td colSpan="7"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}>• Traslado / disponibilidad: 0</td>
  </tr>
</tbody>
</table>
        </div>
    );
});
export default PDFEntrevistaProfunda;
