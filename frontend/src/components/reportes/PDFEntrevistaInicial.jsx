import React from 'react';

const PDFEntrevistaInicial = React.forwardRef(({ candidato, entrevistaInicial, vacante }, ref) => {
  if (!candidato || !entrevistaInicial) return null;

  const respuestas = entrevistaInicial.respuestas || {};

  // --- ESTILOS CORPORATE PREMIUM ---
  const labelStyle = {
    backgroundColor: 'transparent',
    color: '#64748B', 
    fontWeight: '700',
    padding: '4px 6px', 
    borderBottom: '1px solid #E2E8F0', 
    width: '25%', verticalAlign: 'top', fontSize: '9px', textTransform: 'uppercase'
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

  const renderFila2 = (l1, v1) => (
    <tr style={{ pageBreakInside: 'avoid' }}>
      <td style={{...labelStyle, width: '25%'}}>{l1}</td>
      <td colSpan="3" style={{...valueStyle, width: '75%'}}>{v1 || ''}</td>
    </tr>
  );

  const SeccionTabla = ({ titulo, children }) => (
    <div style={{ marginBottom: '12px', pageBreakInside: 'avoid' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Inter', Arial, sans-serif" }}>
        <thead>
          <tr>
            <th colSpan="4" style={tableHeaderStyle}>{titulo}</th>
          </tr>
        </thead>
        <tbody>
          {children}
        </tbody>
      </table>
    </div>
  );

  // --- TABLA DE PREGUNTAS CLAVE (ESTILO EXCEL EXACTO) ---
  const renderPregunta = (num, pregunta, validar, respuesta) => (
    <tr style={{ pageBreakInside: 'avoid' }}>
      <td style={{ borderBottom: '1px solid #E2E8F0', padding: '6px 4px', fontSize: '10px', fontWeight: 'bold', color: '#1F4E78', width: '5%', textAlign: 'center', verticalAlign: 'top' }}>
        {num}
      </td>
      <td style={{ borderBottom: '1px solid #E2E8F0', padding: '6px 4px', fontSize: '10px', color: '#0F172A', width: '40%', verticalAlign: 'top' }}>
        {pregunta}
      </td>
      <td style={{ borderBottom: '1px solid #E2E8F0', padding: '6px 4px', fontSize: '9px', color: '#64748B', width: '25%', verticalAlign: 'top', fontStyle: 'italic' }}>
        {validar}
      </td>
      <td style={{ borderBottom: '1px solid #E2E8F0', padding: '6px 4px', fontSize: '10px', color: '#0F172A', width: '30%', verticalAlign: 'top', whiteSpace: 'pre-wrap', backgroundColor: '#F8FAFC' }}>
        {respuesta || ''}
      </td>
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

  const semColor = getSemaforoColor(entrevistaInicial.semaforo);
  const nombrePuesto = vacante ? (vacante.nombre_puesto || vacante.puesto_nombre) : 'N/A';
  const nombreCliente = vacante ? vacante.cliente : 'N/A';

  return (
    <div ref={ref} style={{ width: '100%', padding: '10mm', backgroundColor: '#FFFFFF', minHeight: '100%', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* ENCABEZADO IDÉNTICO AL EXCEL */}
        <div style={{ backgroundColor: '#1F4E78', padding: '6px', textAlign: 'center', marginBottom: '10px' }}>
          <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', color: '#FFFFFF', letterSpacing: '1px' }}>
            ENTREVISTA INICIAL / PRIMER CONTACTO
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
              <td colSpan="3" style={{...valueStyle, width: '85%'}}>Validar fit básico, disponibilidad, experiencia crítica y expectativa salarial antes de avanzar a entrevista profunda.</td>
            </tr>
            <tr>
              <td style={{...labelStyle, backgroundColor: '#1F4E78', color: '#FFF'}}>Nombre candidato</td>
              <td colSpan="3" style={{...valueStyle, width: '85%', fontWeight: 'bold', fontSize: '12px'}}>{candidato.nombre_completo}</td>
            </tr>
          </tbody>
        </table>

        {/* TABLA DE CUESTIONARIO */}
        <div style={{ marginBottom: '16px', pageBreakInside: 'avoid' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Inter', Arial, sans-serif" }}>
            <thead>
              <tr>
                <th style={{ backgroundColor: '#1F4E78', color: '#FFF', padding: '4px', fontSize: '10px', width: '5%' }}>#</th>
                <th style={{ backgroundColor: '#1F4E78', color: '#FFF', padding: '4px', fontSize: '10px', width: '40%', textAlign: 'left' }}>Pregunta clave</th>
                <th style={{ backgroundColor: '#1F4E78', color: '#FFF', padding: '4px', fontSize: '10px', width: '25%', textAlign: 'left' }}>Qué validar</th>
                <th style={{ backgroundColor: '#1F4E78', color: '#FFF', padding: '4px', fontSize: '10px', width: '30%', textAlign: 'left' }}>Respuesta / notas del candidato</th>
              </tr>
            </thead>
            <tbody>
              {renderPregunta('1', 'Cuéntame brevemente tu experiencia más reciente relacionada con el puesto. Considera años de experiencia y responsabilidades principales.', 'Experiencia mínima y estabilidad laboral.', respuestas.f_experiencia || respuestas.p1)}
              {renderPregunta('2', '¿Cuántos años de experiencia tienes en funciones similares?', 'Cumplimiento de experiencia mínima.', respuestas.p2)}
              {renderPregunta('3', '¿Cuál es tu escolaridad máxima comprobable?', 'Escolaridad mínima requerida.', respuestas.f_escolaridad || respuestas.p3)}
              {renderPregunta('4', '¿Qué carrera, especialidad o formación tienes relacionada con el puesto?', 'Carrera / especialidad requerida.', respuestas.f_carrera || respuestas.p4)}
              {renderPregunta('5', '¿Qué software, herramientas, equipo o sistemas manejas relacionados con el puesto?', 'Software y herramientas requeridas.', respuestas.f_herramientas || respuestas.p5)}
              {renderPregunta('6', '¿Cómo manejas presión, urgencias, cambios de prioridad o incidencias durante la operación?', 'Competencias blandas y reacción ante problemas.', respuestas.p6)}
              {renderPregunta('7', '¿Cuál fue un logro o indicador importante que cumpliste en tu último empleo?', 'Orientación a resultados y KPIs.', respuestas.p7)}
              {renderPregunta('8', 'La vacante está ubicada en la zona indicada. ¿Te queda viable el traslado y en qué tiempo llegarías?', 'Viabilidad de zona, traslado y puntualidad.', respuestas.p8)}
              {renderPregunta('9', `La oferta considerada es de $${vacante?.sueldo_ofertado || '0'}. ¿Tu expectativa salarial está dentro de este rango?`, 'Alineación salarial y negociación.', respuestas.p9)}
              {renderPregunta('10', '¿Por qué te interesa esta vacante y qué tendría que pasar para que aceptes una oferta?', 'Motivadores, riesgo de rechazo y cierre.', respuestas.p10)}
            </tbody>
          </table>
        </div>

        {/* RESUMEN DE SEÑALES CLAVE */}
        <SeccionTabla titulo="Resumen de señales clave del perfilador">
          {renderFila2('Funciones sugeridas', vacante?.funciones_diarias_sugeridas || vacante?.funciones_diarias_cliente)}
          {renderFila2('Responsabilidades críticas', vacante?.responsabilidades_sugeridas || vacante?.responsabilidades_cliente)}
          {renderFila2('Competencias técnicas', vacante?.competencias_tecnicas_sugeridas || vacante?.competencias_tecnicas_cliente)}
          {renderFila2('Competencias blandas', vacante?.competencias_blandas_sugeridas || vacante?.competencias_blandas_cliente)}
          {renderFila2('Factores clave de éxito', vacante?.factores_exito_sugeridos || vacante?.factores_exito_cliente)}
        </SeccionTabla>

        {/* RESULTADO Y ANÁLISIS */}
        <div style={{ marginBottom: '16px', pageBreakInside: 'avoid' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Inter', Arial, sans-serif" }}>
            <tbody>
              <tr>
                <td style={{...labelStyle, width: '25%'}}>Resultado del primer contacto</td>
                <td style={{...valueStyle, width: '25%', fontWeight: 'bold', color: semColor}}>
                  {entrevistaInicial.resultado === 'viable' ? 'Viable' : (entrevistaInicial.resultado === 'no_viable' ? 'No Viable' : 'En Observación')}
                </td>
                <td style={{...labelStyle, width: '25%'}}>Siguiente paso</td>
                <td style={{...valueStyle, width: '25%'}}>{entrevistaInicial.resultado === 'viable' ? 'Avanzar a entrevista profunda' : 'Descartar o requerir más info'}</td>
              </tr>
              <tr>
                <td colSpan="4" style={tableHeaderStyle}>ANÁLISIS AUTOMÁTICO DE VIABILIDAD</td>
              </tr>
              <tr>
                <td style={labelStyle}>Respuestas capturadas</td>
                <td style={valueStyle}>{Object.keys(respuestas).length > 0 ? 'Completado' : 'Pendiente'}</td>
                <td style={labelStyle}>Semáforo detectado</td>
                <td style={{...valueStyle, fontWeight: 'bold', color: semColor}}>{entrevistaInicial.semaforo?.toUpperCase() || 'N/A'}</td>
              </tr>
            </tbody>
          </table>
          
          {/* Bloques de detalles (Simulando los cuadros Azul y Rojo del Excel) */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '8px' }}>
            <tbody>
              <tr>
                <td style={{ backgroundColor: '#1F4E78', color: '#FFF', padding: '8px', fontSize: '10px', fontWeight: 'bold', width: '25%', border: '1px solid #FFF' }}>
                  Detalle señales positivas
                </td>
                <td style={{ backgroundColor: '#F8FAFC', padding: '8px', fontSize: '10px', color: '#0F172A', width: '75%', border: '1px solid #E2E8F0' }}>
                  {entrevistaInicial.semaforo === 'verde' ? 'El candidato cumple con los factores críticos y mostró interés real en la oferta.' : 'Revisar respuestas para identificar fortalezas.'}
                </td>
              </tr>
              <tr>
                <td style={{ backgroundColor: '#C00000', color: '#FFF', padding: '8px', fontSize: '10px', fontWeight: 'bold', width: '25%', border: '1px solid #FFF' }}>
                  Detalle señales de riesgo
                </td>
                <td style={{ backgroundColor: '#FEF2F2', padding: '8px', fontSize: '10px', color: '#991B1B', width: '75%', border: '1px solid #E2E8F0' }}>
                  {entrevistaInicial.semaforo === 'rojo' ? 'Riesgo crítico detectado. No cumple factores innegociables o expectativa salarial.' : 'No se detectan riesgos críticos inmediatos.'}
                </td>
              </tr>
            </tbody>
          </table>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '8px' }}>
            <tbody>
              <tr>
                <td style={{...labelStyle, width: '25%'}}>Justificación automática</td>
                <td colSpan="3" style={{...valueStyle, width: '75%', backgroundColor: '#FEF9C3'}}>{entrevistaInicial.notas || 'Sin justificación automática disponible.'}</td>
              </tr>
              <tr>
                <td style={{...labelStyle, width: '25%'}}>Decisión final del reclutador</td>
                <td style={{...valueStyle, width: '25%'}}>{entrevistaInicial.resultado?.toUpperCase()}</td>
                <td style={{...labelStyle, width: '25%'}}>Comentarios finales</td>
                <td style={{...valueStyle, width: '25%'}}>{entrevistaInicial.notas}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* FACTORES CRÍTICOS DEL PERFILADOR */}
        <div style={{ marginBottom: '16px', pageBreakInside: 'avoid' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Inter', Arial, sans-serif" }}>
            <thead>
              <tr>
                <th colSpan="4" style={tableHeaderStyle}>FACTORES CRÍTICOS DEL PERFILADOR</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{...labelStyle, width: '20%'}}>Escolaridad mínima</td>
                <td style={{...valueStyle, width: '30%'}}>{vacante?.escolaridad_requerida}</td>
                <td style={{...labelStyle, width: '20%'}}>Validar con pregunta 3</td>
                <td style={{...valueStyle, width: '30%', backgroundColor: '#F8FAFC'}}>{respuestas.f_escolaridad || respuestas.p3}</td>
              </tr>
              <tr>
                <td style={{...labelStyle, width: '20%'}}>Experiencia mínima</td>
                <td style={{...valueStyle, width: '30%'}}>{vacante?.experiencia_minima} años</td>
                <td style={{...labelStyle, width: '20%'}}>Validar con pregunta 2</td>
                <td style={{...valueStyle, width: '30%', backgroundColor: '#F8FAFC'}}>{respuestas.f_experiencia || respuestas.p1}</td>
              </tr>
              <tr>
                <td style={{...labelStyle, width: '20%'}}>Carrera / especialidad</td>
                <td style={{...valueStyle, width: '30%'}}>{vacante?.carrera_especialidad}</td>
                <td style={{...labelStyle, width: '20%'}}>Validar con pregunta 4</td>
                <td style={{...valueStyle, width: '30%', backgroundColor: '#F8FAFC'}}>{respuestas.f_carrera || respuestas.p4}</td>
              </tr>
              <tr>
                <td style={{...labelStyle, width: '20%'}}>Software / herramientas</td>
                <td style={{...valueStyle, width: '30%'}}>{vacante?.herramientas !== '[]' ? vacante?.herramientas : ''}</td>
                <td style={{...labelStyle, width: '20%'}}>Validar con pregunta 5</td>
                <td style={{...valueStyle, width: '30%', backgroundColor: '#F8FAFC'}}>{respuestas.f_herramientas || respuestas.p5}</td>
              </tr>
              <tr>
                <td style={{...labelStyle, width: '20%'}}>Resultado factores críticos</td>
                <td style={{...valueStyle, width: '30%', fontWeight: 'bold'}}>{entrevistaInicial.semaforo === 'verde' ? 'Cumple' : 'Revisión Necesaria'}</td>
                <td style={{...labelStyle, width: '20%'}}>Impacto en viabilidad</td>
                <td style={{...valueStyle, width: '30%', backgroundColor: '#FEF9C3', fontWeight: 'bold'}}>Considerable</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* AGENDA DE ENTREVISTA PROFUNDA */}
        <div style={{ marginBottom: '16px', pageBreakInside: 'avoid' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Inter', Arial, sans-serif" }}>
            <thead>
              <tr>
                <th colSpan="4" style={tableHeaderStyle}>AGENDA DE ENTREVISTA PROFUNDA</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{...labelStyle, width: '20%'}}>¿Aplica agenda?</td>
                <td style={{...valueStyle, width: '30%', backgroundColor: entrevistaInicial.agenda_entrevista_profunda ? '#DCFCE7' : '#FEF2F2', color: entrevistaInicial.agenda_entrevista_profunda ? '#166534' : '#991B1B', fontWeight: 'bold'}}>
                  {entrevistaInicial.agenda_entrevista_profunda ? 'Sí agendar' : 'No agendar'}
                </td>
                <td style={{...labelStyle, width: '20%'}}>Estatus agenda</td>
                <td style={{...valueStyle, width: '30%'}}>{entrevistaInicial.agenda_entrevista_profunda ? 'Agendada' : 'No aplica'}</td>
              </tr>
              {entrevistaInicial.agenda_entrevista_profunda && (
                <>
                  <tr>
                    <td style={labelStyle}>Fecha entrevista</td>
                    <td style={valueStyle}>{entrevistaInicial.fecha_agenda?.split('T')[0] || ''}</td>
                    <td style={labelStyle}>Hora</td>
                    <td style={valueStyle}>{entrevistaInicial.fecha_agenda?.split('T')[1]?.substring(0,5) || ''}</td>
                  </tr>
                  <tr>
                    <td style={labelStyle}>Entrevistador</td>
                    <td style={valueStyle}>Por definir</td>
                    <td style={labelStyle}>Modalidad</td>
                    <td style={valueStyle}>Por definir</td>
                  </tr>
                  <tr>
                    <td style={labelStyle}>Liga / ubicación</td>
                    <td style={valueStyle}>Por definir</td>
                    <td style={labelStyle}>Confirmación enviada</td>
                    <td style={valueStyle}>Pendiente</td>
                  </tr>
                  <tr>
                    <td style={labelStyle}>Notas de agenda</td>
                    <td colSpan="3" style={valueFullStyle}></td>
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

export default PDFEntrevistaInicial;
