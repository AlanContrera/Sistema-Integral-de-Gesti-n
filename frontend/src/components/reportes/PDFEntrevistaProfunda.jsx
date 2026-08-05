import React from 'react';

const PDFEntrevistaProfunda = React.forwardRef(({ candidato, entrevistaInicial, entrevistaProfunda, vacante }, ref) => {
  if (!candidato || !entrevistaProfunda) return null;

  const rubros = Array.isArray(entrevistaProfunda.rubros) ? entrevistaProfunda.rubros : [];

  // --- ESTILOS CORPORATE PREMIUM ---
  const labelStyle = {
    backgroundColor: 'transparent', color: '#64748B', fontWeight: '700', padding: '4px 6px', 
    borderBottom: '1px solid #E2E8F0', width: '25%', verticalAlign: 'top', fontSize: '9px', textTransform: 'uppercase'
  };
  const valueStyle = {
    backgroundColor: 'transparent', color: '#0F172A', padding: '4px 6px', borderBottom: '1px solid #E2E8F0', 
    width: '25%', verticalAlign: 'top', whiteSpace: 'pre-wrap', fontSize: '10px'
  };
  const tableHeaderStyle = {
    backgroundColor: 'transparent', color: '#1F4E78', padding: '0px 0px 4px 0px', fontSize: '12px',
    textAlign: 'left', borderBottom: '2px solid #1F4E78', textTransform: 'uppercase', letterSpacing: '1px'
  };

  const renderFila4 = (l1, v1, l2, v2) => (
    <tr style={{ pageBreakInside: 'avoid' }}>
      <td style={{...labelStyle, width: '25%'}}>{l1}</td>
      <td style={{...valueStyle, width: '25%'}}>{v1 || ''}</td>
      <td style={{...labelStyle, width: '25%'}}>{l2}</td>
      <td style={{...valueStyle, width: '25%'}}>{v2 || ''}</td>
    </tr>
  );

  const getSemaforoColor = (s) => {
    switch (s?.toLowerCase()) {
      case 'verde': return '#16A34A';
      case 'amarillo': return '#D97706';
      case 'rojo': return '#DC2626';
      default: return '#64748B';
    }
  };

  const semColor = getSemaforoColor(entrevistaProfunda.semaforo);
  const nombrePuesto = vacante ? (vacante.nombre_puesto || vacante.puesto_nombre) : 'N/A';

  return (
    <div ref={ref} style={{ width: '100%', padding: '10mm', backgroundColor: '#FFFFFF', minHeight: '100%', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* ENCABEZADO IDÉNTICO AL EXCEL */}
        <div style={{ backgroundColor: '#1F4E78', padding: '6px', textAlign: 'center', marginBottom: '10px' }}>
          <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', color: '#FFFFFF', letterSpacing: '1px' }}>
            FORMULARIO DE ENTREVISTA PROFUNDA / EVALUACIÓN PARA ENVÍO AL CLIENTE
          </h2>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Inter', Arial, sans-serif", marginBottom: '16px' }}>
          <tbody>
            <tr>
              <td style={{...labelStyle, width: '15%'}}>Puesto</td>
              <td style={{...valueStyle, width: '35%', fontWeight: 'bold'}}>{nombrePuesto}</td>
              <td style={{...labelStyle, width: '20%'}}>Ubicación</td>
              <td style={{...valueStyle, width: '30%'}}>{vacante?.municipio_nombre || ''}</td>
            </tr>
            <tr>
              <td style={labelStyle}>Sueldo propuesto</td>
              <td style={valueStyle}>{vacante?.sueldo_ofertado ? `$${vacante.sueldo_ofertado}` : ''}</td>
              <td style={labelStyle}>Promedio mercado</td>
              <td style={valueStyle}>{vacante?.sueldo_mercado ? `$${vacante.sueldo_mercado}` : ''}</td>
            </tr>
            <tr>
              <td style={labelStyle}>Objetivo</td>
              <td colSpan="3" style={{...valueStyle, width: '85%'}}>Evaluar con evidencia el dominio técnico, experiencia, actitud, salario y viabilidad logística para decidir si el candidato debe enviarse a entrevista con el cliente.</td>
            </tr>
            <tr>
              <td style={{...labelStyle, backgroundColor: '#1F4E78', color: '#FFF'}}>Nombre candidato</td>
              <td colSpan="3" style={{...valueStyle, width: '85%', fontWeight: 'bold', fontSize: '12px'}}>{candidato.nombre_completo}</td>
            </tr>
          </tbody>
        </table>

        {/* TABLA DE EVALUACIÓN TÉCNICA (DINÁMICA) */}
        <div style={{ marginBottom: '16px', pageBreakInside: 'avoid' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Inter', Arial, sans-serif" }}>
            <thead>
              <tr>
                <th colSpan="6" style={tableHeaderStyle}>DETALLE DE EVALUACIÓN TÉCNICA Y COMPETENCIAL</th>
              </tr>
              <tr>
                <th style={{ backgroundColor: '#1F4E78', color: '#FFF', padding: '4px', fontSize: '9px', width: '5%', textAlign: 'center' }}>#</th>
                <th style={{ backgroundColor: '#1F4E78', color: '#FFF', padding: '4px', fontSize: '9px', width: '20%', textAlign: 'left' }}>Factor a evaluar</th>
                <th style={{ backgroundColor: '#1F4E78', color: '#FFF', padding: '4px', fontSize: '9px', width: '25%', textAlign: 'left' }}>Pregunta / Criterio esperado</th>
                <th style={{ backgroundColor: '#1F4E78', color: '#FFF', padding: '4px', fontSize: '9px', width: '15%', textAlign: 'center' }}>Nivel</th>
                <th style={{ backgroundColor: '#1F4E78', color: '#FFF', padding: '4px', fontSize: '9px', width: '10%', textAlign: 'center' }}>Puntaje</th>
                <th style={{ backgroundColor: '#1F4E78', color: '#FFF', padding: '4px', fontSize: '9px', width: '25%', textAlign: 'left' }}>Evidencia / Notas del candidato</th>
              </tr>
            </thead>
            <tbody>
              {rubros.length > 0 ? rubros.map((item, index) => {
                 let puntaje = 0;
                 const lvl = item.nivel?.toLowerCase() || '';
                 if (lvl === 'experto') puntaje = 3;
                 else if (lvl === 'intermedio') puntaje = 2;
                 else if (lvl === 'basico') puntaje = 1;

                 return (
                   <tr key={index} style={{ pageBreakInside: 'avoid' }}>
                     <td style={{ borderBottom: '1px solid #E2E8F0', padding: '6px 4px', fontSize: '9px', fontWeight: 'bold', color: '#1F4E78', textAlign: 'center', verticalAlign: 'top' }}>
                       {index + 1}
                     </td>
                     <td style={{ borderBottom: '1px solid #E2E8F0', padding: '6px 4px', fontSize: '9px', fontWeight: 'bold', color: '#1F4E78', verticalAlign: 'top' }}>
                       {item.rubro}
                     </td>
                     <td style={{ borderBottom: '1px solid #E2E8F0', padding: '6px 4px', fontSize: '9px', color: '#64748B', verticalAlign: 'top', fontStyle: 'italic' }}>
                       {item.pregunta || item.criterio_evaluacion || 'Evaluar dominio, casos de uso reales y capacidad de resolución.'}
                     </td>
                     <td style={{ borderBottom: '1px solid #E2E8F0', padding: '6px 4px', fontSize: '10px', color: '#0F172A', textAlign: 'center', verticalAlign: 'top', textTransform: 'capitalize', fontWeight: 'bold' }}>
                       {item.nivel || 'Nulo'}
                     </td>
                     <td style={{ borderBottom: '1px solid #E2E8F0', padding: '6px 4px', fontSize: '10px', color: '#0F172A', textAlign: 'center', verticalAlign: 'top' }}>
                       {puntaje}
                     </td>
                     <td style={{ borderBottom: '1px solid #E2E8F0', padding: '6px 4px', fontSize: '9px', color: '#0F172A', verticalAlign: 'top', whiteSpace: 'pre-wrap', backgroundColor: '#F8FAFC' }}>
                       {item.notas || ''}
                     </td>
                   </tr>
                 );
              }) : (
                 <tr>
                   <td colSpan="6" style={{ padding: '10px', textAlign: 'center', fontSize: '10px', color: '#64748B', borderBottom: '1px solid #E2E8F0' }}>
                     No se han registrado evaluaciones de rubros en la base de datos (El JSON está vacío).
                   </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* RESULTADO Y ANÁLISIS EJECUTIVO */}
        <div style={{ marginBottom: '16px', pageBreakInside: 'avoid' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Inter', Arial, sans-serif" }}>
            <tbody>
              <tr>
                <td colSpan="4" style={tableHeaderStyle}>RESULTADO OBTENIDO DEL CANDIDATO EN ENTREVISTA PROFUNDA</td>
              </tr>
              <tr>
                <td style={{...labelStyle, width: '25%'}}>Puntaje total</td>
                <td style={{...valueStyle, width: '25%', fontWeight: 'bold'}}>{entrevistaProfunda.puntaje_total}</td>
                <td style={{...labelStyle, width: '25%'}}>Porcentaje de fit</td>
                <td style={{...valueStyle, width: '25%', fontWeight: 'bold'}}>{entrevistaProfunda.porcentaje}%</td>
              </tr>
              <tr>
                <td style={labelStyle}>Semáforo automático</td>
                <td style={{...valueStyle, fontWeight: 'bold', color: semColor}}>{entrevistaProfunda.semaforo?.toUpperCase() || 'PENDIENTE'}</td>
                <td style={labelStyle}>Decisión sugerida</td>
                <td style={{...valueStyle, fontWeight: 'bold', color: semColor}}>{entrevistaProfunda.resultado_sugerido || 'Revisar brechas'}</td>
              </tr>
            </tbody>
          </table>

          {/* Bloques de Resumen Ejecutivo (Azul y Rojo/Amarillo) */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '8px', pageBreakInside: 'avoid' }}>
            <tbody>
              <tr>
                <td style={{ backgroundColor: '#1F4E78', color: '#FFF', padding: '8px', fontSize: '10px', fontWeight: 'bold', width: '25%', border: '1px solid #FFF', verticalAlign: 'top' }}>
                  Fortalezas y Dominio Técnico (Resumen Ejecutivo)
                </td>
                <td style={{ backgroundColor: '#F8FAFC', padding: '8px', fontSize: '10px', color: '#0F172A', width: '75%', border: '1px solid #E2E8F0', whiteSpace: 'pre-wrap', verticalAlign: 'top' }}>
                  {entrevistaProfunda.fortalezas || '• Sin fortalezas registradas.'}
                </td>
              </tr>
              <tr>
                <td style={{ backgroundColor: '#C00000', color: '#FFF', padding: '8px', fontSize: '10px', fontWeight: 'bold', width: '25%', border: '1px solid #FFF', verticalAlign: 'top' }}>
                  Brechas o Áreas de Riesgo (Desarrollo)
                </td>
                <td style={{ backgroundColor: '#FEF2F2', padding: '8px', fontSize: '10px', color: '#991B1B', width: '75%', border: '1px solid #E2E8F0', whiteSpace: 'pre-wrap', verticalAlign: 'top' }}>
                  {entrevistaProfunda.brechas || '• Sin brechas críticas detectadas.'}
                </td>
              </tr>
            </tbody>
          </table>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '8px', pageBreakInside: 'avoid' }}>
            <tbody>
              <tr>
                <td style={{...labelStyle, width: '25%'}}>Análisis general y Expectativa Salarial</td>
                <td colSpan="3" style={{...valueStyle, width: '75%', backgroundColor: '#FEF9C3'}}>{entrevistaProfunda.analisis_ejecutivo || 'Sin análisis ejecutivo.'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* AGENDA DE ENTREVISTA CON CLIENTE */}
        <div style={{ marginBottom: '16px', pageBreakInside: 'avoid' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Inter', Arial, sans-serif" }}>
            <thead>
              <tr>
                <th colSpan="4" style={tableHeaderStyle}>AGENDA DE ENTREVISTA CON CLIENTE</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{...labelStyle, width: '20%'}}>¿Aplica agenda?</td>
                <td style={{...valueStyle, width: '30%', backgroundColor: entrevistaProfunda.agendar_cliente ? '#DCFCE7' : '#FEF2F2', color: entrevistaProfunda.agendar_cliente ? '#166534' : '#991B1B', fontWeight: 'bold'}}>
                  {entrevistaProfunda.agendar_cliente ? 'Sí agendar' : 'No agendar'}
                </td>
                <td style={{...labelStyle, width: '20%'}}>Estatus agenda</td>
                <td style={{...valueStyle, width: '30%'}}>{entrevistaProfunda.agendar_cliente ? 'En proceso' : 'No aplica'}</td>
              </tr>
              {entrevistaProfunda.agendar_cliente && (
                <>
                  <tr>
                    <td style={labelStyle}>Fecha entrevista</td>
                    <td style={valueStyle}>{entrevistaProfunda.fecha_entrevista_cliente || ''}</td>
                    <td style={labelStyle}>Hora</td>
                    <td style={valueStyle}>{entrevistaProfunda.hora_entrevista_cliente?.substring(0,5) || ''}</td>
                  </tr>
                  <tr>
                    <td style={labelStyle}>Entrevistador Cliente</td>
                    <td style={valueStyle}>Por definir</td>
                    <td style={labelStyle}>Modalidad</td>
                    <td style={valueStyle}>{entrevistaProfunda.modalidad_cliente || ''}</td>
                  </tr>
                  <tr>
                    <td style={labelStyle}>Liga / ubicación</td>
                    <td style={valueStyle}>Por definir</td>
                    <td style={labelStyle}>Confirmación enviada</td>
                    <td style={valueStyle}>Pendiente</td>
                  </tr>
                  <tr>
                    <td style={labelStyle}>Detalles / Comentarios</td>
                    <td colSpan="3" style={valueStyle}>{entrevistaProfunda.detalles_agenda_cliente || ''}</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
});

export default PDFEntrevistaProfunda;
