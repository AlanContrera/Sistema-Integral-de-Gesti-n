import React from 'react';

const PDFEntrevistaInicial = React.forwardRef(({ candidato, entrevistaInicial, entrevistaProfunda, vacante }, ref) => {
    return (
        <div ref={ref} className="excel-report-container" style={{ width: '210mm', padding: '10mm', backgroundColor: '#FFF', boxSizing: 'border-box' }}>
<table style={{ borderCollapse: "collapse", width: "100%", fontFamily: "Arial, sans-serif", fontSize: "10px", tableLayout: "fixed" }}>
<tbody>
  <colgroup>
    <col style={{ width: "190.53125px" }} />
    <col style={{ width: "305.6484375px" }} />
    <col style={{ width: "210.765625px" }} />
    <col style={{ width: "190.53125px" }} />
  </colgroup>
  <tr style={{ height: "18px", pageBreakInside: "avoid" }}>
    <td colSpan="4"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#FFFFFF", fontSize: "14pt", backgroundColor: "#1F4E78", textAlign: "center", verticalAlign: "top" }}>ENTREVISTA INICIAL / PRIMER CONTACTO</td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#D9EAF7", verticalAlign: "middle" }}>Puesto</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#D9EAF7", textAlign: "center", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#D9EAF7", verticalAlign: "top" }}>Ubicación</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", backgroundColor: "#D9EAF7", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#D9EAF7", verticalAlign: "middle" }}>Sueldo propuesto</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", backgroundColor: "#D9EAF7", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#D9EAF7", verticalAlign: "top" }}>Promedio mercado ubicación</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", backgroundColor: "#D9EAF7", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "32.55px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#D9EAF7", verticalAlign: "middle" }}>Objetivo</td>
    <td colSpan="3"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", backgroundColor: "#D9EAF7", verticalAlign: "top" }}>Validar fit básico, disponibilidad, experiencia crítica y expectativa salarial antes de avanzar a entrevista profunda.</td>
  </tr>
  <tr style={{ height: "22.05px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#FFFFFF", fontSize: "11pt", backgroundColor: "#1F4E78", verticalAlign: "middle" }}>Nombre del candidato</td>
    <td colSpan="3"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", color: "#000000", fontSize: "11pt", verticalAlign: "middle" }}>Candidato 01</td>
  </tr>
  <tr style={{ height: "28.8px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#FFFFFF", fontSize: "11pt", backgroundColor: "#5B9BD5", verticalAlign: "top" }}>#</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#FFFFFF", fontSize: "11pt", backgroundColor: "#5B9BD5", textAlign: "center", verticalAlign: "middle" }}>Pregunta clave</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#FFFFFF", fontSize: "11pt", backgroundColor: "#5B9BD5", textAlign: "center", verticalAlign: "middle" }}>Qué validar</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#FFFFFF", fontSize: "11pt", backgroundColor: "#5B9BD5", textAlign: "center", verticalAlign: "top" }}>Respuesta / notas del candidato</td>
  </tr>
  <tr style={{ height: "82.95px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}>1</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}>Selecciona primero un puesto en Perfilador!B11</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}>Experiencia mínima y estabilidad laboral.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
  </tr>
  <tr style={{ height: "28.8px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}>2</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}>¿Cuántos años de experiencia tienes en funciones similares?</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}>Cumplimiento de experiencia mínima.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}>3</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}>¿Cuál es tu escolaridad máxima comprobable?</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}>Escolaridad mínima requerida.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
  </tr>
  <tr style={{ height: "28.8px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}>4</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}>¿Qué carrera, especialidad o formación tienes relacionada con el puesto?</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}>Carrera / especialidad requerida.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
  </tr>
  <tr style={{ height: "28.8px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}>5</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}>¿Qué software, herramientas, equipo o sistemas manejas relacionados con el puesto?</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}>Software y herramientas requeridas.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
  </tr>
  <tr style={{ height: "28.8px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}>6</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}>¿Cómo manejas presión, urgencias, cambios de prioridad o incidencias durante la operación?</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}>Competencias blandas y reacción ante problemas.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
  </tr>
  <tr style={{ height: "28.8px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}>7</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}>¿Cuál fue un logro o indicador importante que cumpliste en tu último empleo?</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}>Orientación a resultados y KPIs.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
  </tr>
  <tr style={{ height: "28.8px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}>8</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}>La vacante está ubicada en la zona indicada. ¿Te queda viable el traslado y en qué tiempo llegarías?</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}>Viabilidad de zona, traslado y puntualidad.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
  </tr>
  <tr style={{ height: "43.2px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}>9</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}>La oferta considerada es de $0 y el mercado de referencia es . ¿Tu expectativa salarial está dentro de este rango?</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}>Alineación salarial y negociación.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
  </tr>
  <tr style={{ height: "28.8px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}>10</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}>¿Por qué te interesa esta vacante y qué tendría que pasar para que aceptes una oferta?</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}>Motivadores, riesgo de rechazo y cierre.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td colSpan="4"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#FFFFFF", fontSize: "11pt", backgroundColor: "#1F4E78", verticalAlign: "top" }}>Resumen de señales clave del perfilador</td>
  </tr>
  <tr style={{ height: "75.45px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}>Funciones sugeridas</td>
    <td colSpan="3"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "left", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "78.45px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}>Responsabilidades críticas</td>
    <td colSpan="3"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "left", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "73.5px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}>Competencias técnicas</td>
    <td colSpan="3"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "left", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "174.45px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}>Competencias blandas</td>
    <td colSpan="3"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "left", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "73.95px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}>Factores clave de éxito</td>
    <td colSpan="3"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "left", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "28.8px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#E2F0D9", verticalAlign: "middle" }}>Resultado del primer contacto</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#FFF2CC", textAlign: "center", verticalAlign: "middle" }}>Pendiente: faltan respuestas</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#FFF2CC", verticalAlign: "middle" }}>Siguiente paso</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#FFF2CC", textAlign: "center", verticalAlign: "middle" }}>Completar información crítica antes de decidir</td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td colSpan="4"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#FFFFFF", fontSize: "11pt", backgroundColor: "#1F4E78", textAlign: "center" }}>ANÁLISIS AUTOMÁTICO DE VIABILIDAD</td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt" }}>Respuestas capturadas</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}>0 de 10</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt" }}>Mínimo recomendado</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}>8 de 10</td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt" }}>Señales positivas detectadas</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt" }}>Señales de riesgo detectadas</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "72px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#FFFFFF", fontSize: "11pt", backgroundColor: "#1F4E78", textAlign: "center", verticalAlign: "middle" }}>Detalle señales positivas</td>
    <td colSpan="3"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "72px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#FFFFFF", fontSize: "11pt", backgroundColor: "#C00000", textAlign: "center", verticalAlign: "middle" }}>Detalle señales de riesgo</td>
    <td colSpan="3"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}></td>
  </tr>
  <tr style={{ height: "36px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}>Resultado sugerido</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}>Pendiente: faltan respuestas</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}>Siguiente paso sugerido</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", backgroundColor: "#FFF2CC", textAlign: "center", verticalAlign: "middle" }}>Completar información crítica antes de decidir</td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", textAlign: "left", verticalAlign: "middle" }}>Justificación automática</td>
    <td colSpan="3"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", backgroundColor: "#FFF2CC", textAlign: "left", verticalAlign: "top" }}>Evaluación automática: 0 de 10 respuestas capturadas. Factores críticos: Pendiente de validar; escolaridad , experiencia , carrera , herramientas . Riesgos detectados: 0. Recomendación: Pendiente: faltan respuestas. Siguiente paso: Completar información crítica antes de decidir</td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt" }}>Decisión final del reclutador</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", backgroundColor: "#FFF2CC" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#FFF2CC" }}>Comentarios finales</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", backgroundColor: "#FFF2CC" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td colSpan="4"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#FFFFFF", fontSize: "11pt", backgroundColor: "#1F4E78", textAlign: "center" }}>FACTORES CRÍTICOS DEL PERFILADOR</td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt" }}>Escolaridad mínima</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt" }}>Validar con respuesta pregunta 3</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt" }}>Experiencia mínima</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt" }}>Validar con respuesta pregunta 2</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center" }}></td>
  </tr>
  <tr style={{ height: "57.6px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", textAlign: "left", verticalAlign: "middle" }}>Carrera / especialidad</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", verticalAlign: "top" }}>• Ingenieria<br />• Mecatronica<br />• Robotica<br />• Automatización y Control</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", textAlign: "left", verticalAlign: "middle" }}>Validar con respuesta pregunta 4</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
  </tr>
  <tr style={{ height: "62.55px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", textAlign: "left", verticalAlign: "middle" }}>Software / herramientas</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", verticalAlign: "middle" }}>Validar con respuesta pregunta 5</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt" }}>Resultado factores críticos</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}>Pendiente de validar</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt" }}>Impacto en viabilidad</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}>Considerable</td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td colSpan="4"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#FFFFFF", fontSize: "11pt", backgroundColor: "#1F4E78", textAlign: "center" }}>AGENDA DE ENTREVISTA PROFUNDA</td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#D9EAF7" }}>¿Aplica agenda?</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", backgroundColor: "#FFF2CC", textAlign: "center" }}>No agendar</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#D9EAF7" }}>Estatus agenda</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", backgroundColor: "#FFF2CC" }}>No aplica</td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#D9EAF7" }}>Fecha entrevista profunda</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#D9EAF7" }}>Hora</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#D9EAF7" }}>Entrevistador / responsable</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#D9EAF7" }}>Modalidad</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#D9EAF7" }}>Liga / ubicación</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#D9EAF7" }}>Confirmación enviada</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#D9EAF7" }}>Notas de agenda</td>
    <td colSpan="3"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
</tbody>
</table>
        </div>
    );
});
export default PDFEntrevistaInicial;
