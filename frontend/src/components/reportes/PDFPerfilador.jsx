import React from 'react';

const PDFPerfilador = React.forwardRef(({ vacante }, ref) => {
  if (!vacante) return null;

  // --- ESTILOS "CORPORATE PREMIUM" (Estilo Consultoría Big 4) ---
  const labelStyle = {
    backgroundColor: 'transparent', // Sin fondo
    color: '#64748B', // Gris azulado sutil
    fontWeight: '700',
    padding: '6px 4px', // Compacto pero respira
    borderBottom: '1px solid #E2E8F0', // SOLO borde inferior (esto le da el toque elegante)
    borderTop: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    width: '25%',
    verticalAlign: 'top',
    fontSize: '9px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const valueStyle = {
    backgroundColor: 'transparent',
    color: '#0F172A', // Texto casi negro, gran contraste
    padding: '6px 4px',
    borderBottom: '1px solid #E2E8F0', // SOLO borde inferior
    borderTop: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    width: '25%',
    verticalAlign: 'top',
    whiteSpace: 'pre-wrap',
    fontSize: '10px'
  };

  const valueFullStyle = {
    backgroundColor: 'transparent',
    color: '#0F172A',
    padding: '6px 4px',
    borderBottom: '1px solid #E2E8F0',
    borderTop: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    width: '75%',
    verticalAlign: 'top',
    whiteSpace: 'pre-wrap',
    fontSize: '10px'
  };

  const renderFila4 = (l1, v1, l2, v2) => (
    <tr>
      <td style={labelStyle}>{l1}</td>
      <td style={valueStyle}>{v1 || ''}</td>
      <td style={labelStyle}>{l2}</td>
      <td style={valueStyle}>{v2 || ''}</td>
    </tr>
  );

  const renderFila2 = (l1, v1) => (
    <tr>
      <td style={labelStyle}>{l1}</td>
      <td colSpan="3" style={valueFullStyle}>{v1 || ''}</td>
    </tr>
  );

  const SeccionTabla = ({ titulo, children }) => (
    // Espaciado sutil entre secciones
    <div style={{ marginBottom: '16px', pageBreakInside: 'avoid' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Inter', Arial, sans-serif" }}>
        <thead>
          <tr>
            <th colSpan="4" style={{
              backgroundColor: 'transparent', // Sin la caja oscura y pesada
              color: '#1F4E78', // Tu azul corporativo
              padding: '0px 0px 4px 0px', // Sin relleno inútil
              fontSize: '12px',
              textAlign: 'left',
              borderBottom: '2px solid #1F4E78', // Línea gruesa de acento en lugar de un cuadro entero
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              {titulo}
            </th>
          </tr>
        </thead>
        <tbody>
          {children}
        </tbody>
      </table>
    </div>
  );





  return (
    <div ref={ref} style={{ width: '100%', padding: '10mm', backgroundColor: '#FFFFFF', minHeight: '100%', boxSizing: 'border-box' }}>
      {/* maxWidth en 800px simula el ancho real de una hoja A4, evitando que se estire y deje huecos */}
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        <SeccionTabla titulo="1. Propuesta de Perfil de Puesto">
          {renderFila4('Cliente / Empresa', vacante.cliente, 'Fecha de levantamiento', vacante.fecha_creacion?.split('T')[0])}
          {renderFila4('Contacto responsable', vacante.contacto_responsable, 'Consultor responsable', 'Pendiente')}
          {renderFila4('Puesto propuesto', vacante.puesto_nombre || vacante.nombre_puesto, 'Área / Departamento', vacante.area_departamento)}
          {renderFila4('Ubicación', vacante.municipio_nombre, 'Nivel del puesto', vacante.nivel_puesto)}
          {renderFila4('Tipo de contratación', vacante.tipo_contratacion, 'Número de vacantes', vacante.numero_vacantes)}
          {renderFila4('Sueldo propuesto', vacante.sueldo_ofertado ? `$${vacante.sueldo_ofertado}` : '', 'Sueldo promedio mercado', vacante.sueldo_mercado ? `$${vacante.sueldo_mercado}` : '')}
          {renderFila4('Promedio mercado ubicación', '', 'Periodicidad de pago', vacante.periodicidad_pago)}
        </SeccionTabla>

        <SeccionTabla titulo="2. Resumen Ejecutivo del Perfil">
          {renderFila2('Objetivo del puesto', vacante.objetivo_puesto)}
          {renderFila2('Resultados esperados', vacante.resultados_esperados)}
          {renderFila2('Funciones principales sugeridas', vacante.funciones_diarias_sugeridas)}
          {renderFila2('Funciones diarias hechas por cliente', vacante.funciones_diarias_cliente)}
          {renderFila2('Responsabilidades críticas', vacante.responsabilidades_cliente || vacante.responsabilidades_sugeridas)}
          {renderFila2('Indicadores / KPIs', vacante.kpis)}
        </SeccionTabla>

        <SeccionTabla titulo="3. Perfil Requerido">
          {renderFila4('Escolaridad mínima', vacante.escolaridad_requerida, 'Carrera / especialidad', vacante.carrera_especialidad)}
          {renderFila4('Experiencia mínima', vacante.experiencia_minima ? `${vacante.experiencia_minima} años` : '', 'Experiencia deseable', vacante.experiencia_deseable)}
          {renderFila4('Edad deseada', vacante.edad_deseada, 'Idioma requerido', vacante.idioma_requerido)}
          {renderFila4('Software / herramientas', vacante.herramientas !== '[]' ? vacante.herramientas : '', 'Certificaciones', vacante.certificaciones)}
          {renderFila4('Disponibilidad para viajar', vacante.disponibilidad_viajar, 'Disponibilidad para rolar turnos', vacante.disponibilidad_rolar_turnos)}
        </SeccionTabla>

        <SeccionTabla titulo="4. Competencias y Factores de Éxito">
          {renderFila2('Competencias técnicas sugeridas', vacante.competencias_tecnicas_sugeridas)}
          {renderFila2('Competencias técnicas validadas por cliente', vacante.competencias_tecnicas_cliente)}
          {renderFila2('Competencias blandas', vacante.competencias_blandas_sugeridas || vacante.competencias_blandas_cliente)}
          {renderFila2('Factores clave de éxito sugeridos', vacante.factores_exito_sugeridos)}
          {renderFila2('Factores clave de éxito del cliente', vacante.factores_exito_cliente)}
        </SeccionTabla>

        <SeccionTabla titulo="5. Condiciones y Proceso">
          {renderFila4('Sueldo bruto mensual', vacante.sueldo_ofertado ? `$${vacante.sueldo_ofertado}` : '', 'Sueldo neto mensual', '')}
          {renderFila4('Prestaciones', vacante.prestaciones, 'Bonos / comisiones', vacante.pagos_adicionales)}
          {renderFila4('Horario', vacante.horario, 'Modalidad', vacante.modalidad)}
          {renderFila4('Zona de trabajo', vacante.municipio_nombre, 'Herramientas proporcionadas', vacante.herramientas_proporcionadas)}
          {renderFila4('Entrevistas requeridas', vacante.entrevistas_requeridas, 'Evaluaciones requeridas', vacante.evaluaciones_requeridas)}
          {renderFila4('Documentos necesarios', vacante.documentos_necesarios, 'Tiempo ideal de cobertura', vacante.tiempo_cobertura)}
        </SeccionTabla>

        <SeccionTabla titulo="6. Validación del Cliente">
          {renderFila4('¿Está de acuerdo con el perfil?', '', 'Fecha de validación', '')}
          {renderFila2('Comentarios o ajustes solicitados', '')}
          {renderFila4('Nombre y firma del cliente', '', 'Nombre y firma consultor', '')}
        </SeccionTabla>

        <SeccionTabla titulo="7. Propuesta Comercial">
          {renderFila4('Cliente / Empresa', vacante.cliente, 'Puesto a cubrir', vacante.puesto_nombre || vacante.nombre_puesto)}
          {renderFila4('Servicio propuesto', 'Reclutamiento y selección', 'Tipo de contratación', vacante.tipo_contratacion)}
          {renderFila4('Honorarios acordados', '', 'Garantía', '')}
          {renderFila4('Exclusividad', 'Sí', 'Fecha compromiso de terna', '')}
          {renderFila2('Alcance del servicio', `El servicio comprende el levantamiento y validación del perfil, publicación de vacantes, filtro curricular, entrevistas iniciales, entrevistas profundas, pruebas psicométricas (de acuerdo con el perfil del puesto), estudio socioeconómico, integración de terna (envío de candidatos al cliente para el puesto de ${vacante.puesto_nombre || ''}). La propuesta considera sueldo ofrecido $${vacante.sueldo_ofertado || '0'}, mercado promedio $0, rango de mercado $0 a $0, jornada ${vacante.jornada || 'Completa'} y prestaciones ${vacante.prestaciones || ''}.`)}
          {renderFila2('Compromisos del cliente', 'El cliente se compromete a validar el perfil, entregar retroalimentación oportuna, confirmar condiciones laborales y participar en entrevistas/decisiones dentro de los tiempos acordados. Una vez enviada la terna, el cliente se compromete a dar respuesta en un máximo de 3 días hábiles, indicando que candidatos desea que se envíen a entrevista.')}
          {renderFila2('Condiciones de aceptación', 'La aceptación de esta propuesta confirma el perfil, condiciones comerciales, garantía y alcance del servicio. Para la aplicación e inicio de la búsqueda, el cliente se compromete a realizar el pago del 50% del costo acordado a nuestra cuenta bancaria. Cualquier ajuste posterior deberá documentarse por escrito entre ambas partes.')}
          {renderFila2('Aceptación del cliente', 'De común acuerdo, el cliente autoriza el inicio del proceso bajo las condiciones aquí descritas.')}
          {renderFila4('Firma del cliente', '', 'Fecha', '')}
          {renderFila4('Firma consultor', '', 'Fecha', '')}
        </SeccionTabla>

        {/* AVISO DE PRIVACIDAD SIMPLIFICADO PARA REPORTE */}
        <div style={{ padding: '8px', border: '1px solid #000', marginTop: '5px', pageBreakInside: 'avoid', fontFamily: 'Arial, sans-serif' }}>
          <h4 style={{ margin: '0 0 5px 0', color: '#000', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>Aviso de Privacidad y Tratamiento de Datos</h4>
          <p style={{ margin: 0, color: '#000', fontSize: '10px', textAlign: 'justify', lineHeight: '1.2' }}>
            Partners & Masters informa que los datos personales, laborales, académicos, profesionales, referencias, resultados de entrevistas, evaluaciones psicométricas y estudios socioeconómicos recabados durante el proceso de reclutamiento serán utilizados exclusivamente para fines de evaluación, validación, integración de expediente, presentación de candidatos al cliente y seguimiento del proceso de selección. La información será tratada de forma confidencial y sólo será compartida con el cliente contratante cuando sea necesario para la evaluación de la vacante solicitada. El titular podrá solicitar acceso, rectificación, cancelación u oposición al tratamiento de sus datos personales a través de los medios de contacto de Partners & Masters. Al Contacto para privacidad: contacto@partners-masters.com | Tel. +52 81 1234 1234 | www.partners-masters.com
          </p>
        </div>
      </div>
    </div>
  );
});

export default PDFPerfilador;
