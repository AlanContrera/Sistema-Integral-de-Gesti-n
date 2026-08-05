import React from 'react';

const PDFPerfilador = React.forwardRef(({ candidato, entrevistaInicial, entrevistaProfunda, vacante }, ref) => {
    return (
        <div ref={ref} className="excel-report-container" style={{ width: '210mm', padding: '10mm', backgroundColor: '#FFF', boxSizing: 'border-box' }}>
<table style={{ borderCollapse: "collapse", width: "100%", fontFamily: "Arial, sans-serif", fontSize: "10px", tableLayout: "fixed" }}>
<tbody>
  <colgroup>
    <col style={{ width: "195.20703125px" }} />
    <col style={{ width: "179.6484375px" }} />
    <col style={{ width: "139.20703125px" }} />
    <col style={{ width: "248.8828125px" }} />
    <col style={{ width: "76.20703125px" }} />
  </colgroup>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td colSpan="4"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#FFFFFF", fontSize: "10pt", backgroundColor: "#1F4E78", textAlign: "center", verticalAlign: "top" }}>PERFILADOR DE PUESTO / LEVANTAMIENTO DE VACANTE</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "27.6px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Fecha de levantamiento</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", backgroundColor: "#FFFFFF", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Consultor responsable</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", backgroundColor: "#FFFFFF", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", backgroundColor: "#FFFFFF", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", backgroundColor: "#FFFFFF", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td colSpan="4"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F4E78", fontSize: "11pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>1. DATOS DEL CLIENTE</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Empresa</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", backgroundColor: "#FFFFFF", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Giro / industria</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", backgroundColor: "#FFFFFF", textAlign: "center", verticalAlign: "middle" }}>Industrial, Construccion</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word" }}>0</td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Contacto responsable</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", backgroundColor: "#FFFFFF", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Puesto del contacto</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", backgroundColor: "#FFFFFF", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Teléfono</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", backgroundColor: "#FFFFFF", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Correo</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", backgroundColor: "#FFFFFF", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "27.6px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", textAlign: "left", verticalAlign: "middle" }}>Ubicación de la vacante</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", color: "#000000", fontSize: "10pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Razón social / unidad de negocio</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", backgroundColor: "#FFFFFF", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Municipio o Alcaldia</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", color: "#000000", fontSize: "10pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Sitio Web</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", backgroundColor: "#FFFFFF", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td colSpan="4"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F4E78", fontSize: "11pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>2. DATOS GENERALES DEL PUESTO</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Nombre del puesto</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", color: "#000000", fontSize: "10pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Área / departamento</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", backgroundColor: "#FFFFFF", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Jefe directo</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Número de vacantes</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", backgroundColor: "#FFFFFF", textAlign: "center", verticalAlign: "middle" }}>1</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "27.6px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Motivo de la vacante</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", color: "#000000", fontSize: "10pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Fecha ideal de ingreso</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", backgroundColor: "#FFFFFF", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Nivel del puesto</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", color: "#000000", fontSize: "10pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Tipo de contratación</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", color: "#000000", fontSize: "10pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Sueldo Mensual Ofrecido</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#000000", fontSize: "10pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Periodicidad de pago</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", color: "#000000", fontSize: "10pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "27.6px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", textAlign: "left", verticalAlign: "middle" }}>Jornada</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F2937", fontSize: "10pt", textAlign: "center", verticalAlign: "middle" }}>Completa</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Prestaciones o tipo de Contración</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F2937", fontSize: "10pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "31.95px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", textAlign: "left", verticalAlign: "middle" }}>Pagos Adicionales</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F2937", fontSize: "10pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F2937", fontSize: "10pt", verticalAlign: "top" }}>Valor estimado mensual</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F2937", fontSize: "10pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "27.6px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", verticalAlign: "top" }}>Comparativo vs mercado por ubicación</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#000000", fontSize: "10pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", textAlign: "left", verticalAlign: "middle" }}>Promedio ajustado ubicación</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#000000", fontSize: "10pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", verticalAlign: "top" }}>Sueldo Minimo</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#000000", fontSize: "10pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", textAlign: "left", verticalAlign: "middle" }}>Sueldo Maximo</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#000000", fontSize: "10pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Sueldo promedio de mercado</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#000000", fontSize: "10pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Comparativo salarial</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td colSpan="4"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#FFFFFF", fontSize: "11pt", backgroundColor: "#1F4E78", verticalAlign: "top" }}>3. OBJETIVO DEL PUESTO</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>¿Para qué existe el puesto?</td>
    <td colSpan="3"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", backgroundColor: "#FFFFFF" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "27.6px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Principales resultados esperados</td>
    <td colSpan="3"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontStyle: "italic", fontSize: "10pt", backgroundColor: "#FFFFFF", verticalAlign: "top" }}>Comparativos actualizados con base en el catálogo interno de puestos: sueldo promedio tomado de Catálogos!A:B y ajuste por ubicación tomado de Catálogos!BD:BC.</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td colSpan="4"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F4E78", fontSize: "11pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>4. FUNCIONES Y RESPONSABILIDADES</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "117px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F4E78", fontSize: "11pt", backgroundColor: "#F2F2F2", textAlign: "center", verticalAlign: "middle" }}>Funciones diarias propuestas para el puesto</td>
    <td colSpan="3"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "left", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "178.95px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", textAlign: "center", verticalAlign: "middle" }}>Funciones diarias por el Cliente</td>
    <td colSpan="3"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", color: "#000000", fontSize: "11pt", backgroundColor: "#FFFFFF", textAlign: "left", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "229.95px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", textAlign: "center", verticalAlign: "middle" }}>Responsabilidades críticas Propuestasa para el Puesto</td>
    <td colSpan="3"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "left", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "229.95px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", textAlign: "center", verticalAlign: "middle" }}>Responsabilidades críticas requeridas por el Cliente</td>
    <td colSpan="3"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Indicadores o KPIs del puesto</td>
    <td colSpan="3"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", backgroundColor: "#FFFFFF" }}>Evaluación y dearrollo de personal. </td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", backgroundColor: "#FFFFFF", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", backgroundColor: "#FFFFFF", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td colSpan="4"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F4E78", fontSize: "11pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>5. PERFIL REQUERIDO</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Escolaridad mínima</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", textAlign: "center", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Carrera / especialidad</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", backgroundColor: "#FFFFFF", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Experiencia mínima</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Experiencia deseable</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", backgroundColor: "#FFFFFF", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Edad deseada</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", backgroundColor: "#FFFFFF", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Idioma requerido</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", backgroundColor: "#FFFFFF", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Software / herramientas</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", backgroundColor: "#FFFFFF", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Certificaciones</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", color: "#000000", fontSize: "10pt", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "27.6px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Disponibilidad para viajar</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", backgroundColor: "#FFFFFF", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Disponibilidad para rolar turnos</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", backgroundColor: "#FFFFFF", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", backgroundColor: "#FFFFFF", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", backgroundColor: "#FFFFFF", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td colSpan="4"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F4E78", fontSize: "11pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>6. COMPETENCIAS</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "130.5px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", textAlign: "center", verticalAlign: "middle" }}>Competencias técnicas Propuestas para el Cliente</td>
    <td colSpan="3"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "left", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "123px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#FFFFFF", textAlign: "center", verticalAlign: "middle" }}>Competencias técnicas solicitadas por el Cliente</td>
    <td colSpan="3"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "108.45px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", textAlign: "center", verticalAlign: "middle" }}>Competencias blandas Propuestas para el Cliente</td>
    <td colSpan="3"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "left", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "235.95px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", textAlign: "center", verticalAlign: "middle" }}>Competencias blandas por  el Cliente</td>
    <td colSpan="3"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "192.45px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", textAlign: "center", verticalAlign: "middle" }}>Factores clave de éxito "PROPUESTAS"</td>
    <td colSpan="3"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", textAlign: "left", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "27.6px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Factores clave de éxito Propuestas por el Cliente"</td>
    <td colSpan="3"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", backgroundColor: "#FFFFFF", textAlign: "center", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td colSpan="4"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F4E78", fontSize: "11pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>7. CONDICIONES LABORALES</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Sueldo bruto mensual</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", backgroundColor: "#FFFFFF", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Sueldo neto mensual</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", backgroundColor: "#FFFFFF", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Prestaciones</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", backgroundColor: "#FFFFFF", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Bonos / comisiones</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", backgroundColor: "#FFFFFF", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Horario</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", backgroundColor: "#FFFFFF", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Modalidad</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", backgroundColor: "#FFFFFF", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "27.6px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Zona de trabajo</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", backgroundColor: "#FFFFFF", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Herramientas proporcionadas</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", backgroundColor: "#FFFFFF", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", backgroundColor: "#FFFFFF", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", backgroundColor: "#FFFFFF", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td colSpan="4"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F4E78", fontSize: "11pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>8. PROCESO DE SELECCIÓN</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "27.6px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Entrevistas requeridas</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", backgroundColor: "#FFFFFF", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Evaluaciones requeridas</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", backgroundColor: "#FFFFFF", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "27.6px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Documentos necesarios</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", backgroundColor: "#FFFFFF", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Tiempo ideal de cobertura</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", backgroundColor: "#FFFFFF", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "41.4px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Quién toma la decisión final</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", backgroundColor: "#FFFFFF", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Número de candidatos esperados</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", backgroundColor: "#FFFFFF", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", backgroundColor: "#FFFFFF", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", backgroundColor: "#FFFFFF", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td colSpan="4"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F4E78", fontSize: "11pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>9. CRITERIOS DE DESCARTE</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Perfiles no aceptados</td>
    <td colSpan="3"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", backgroundColor: "#FFFFFF" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Experiencia no válida</td>
    <td colSpan="3"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", backgroundColor: "#FFFFFF" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "27.6px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Zonas no viables</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", backgroundColor: "#FFFFFF", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Pretensión salarial máxima</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", backgroundColor: "#FFFFFF", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", backgroundColor: "#FFFFFF", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", backgroundColor: "#FFFFFF", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td colSpan="4"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F4E78", fontSize: "11pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>10. ACUERDOS COMERCIALES</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Urgencia de la vacante</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", backgroundColor: "#FFFFFF", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Exclusividad</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", color: "#1F2937", fontSize: "10pt", textAlign: "center", verticalAlign: "middle" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Honorarios acordados</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "10pt", backgroundColor: "#FFFFFF", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Garantía</td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", color: "#000000", fontSize: "10pt", verticalAlign: "top" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
  <tr style={{ height: "15px", pageBreakInside: "avoid" }}>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontWeight: "bold", fontSize: "10pt", backgroundColor: "#F2F2F2", verticalAlign: "top" }}>Fecha compromiso de terna</td>
    <td colSpan="3"  style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt", backgroundColor: "#FFFFFF" }}></td>
    <td   style={{ border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "11pt" }}></td>
  </tr>
</tbody>
</table>
        </div>
    );
});
export default PDFPerfilador;
