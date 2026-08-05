// Archivo: frontend/src/pages/reclutamiento/DocumentoReclutamiento.jsx
import React from 'react';
import { Briefcase, Target, GraduationCap, Award, DollarSign, CheckSquare, FileText, ShieldAlert } from 'lucide-react';

const DocumentoPerfilador = ({ vacante }) => {
    if (!vacante) return null;

    // --- ESTILOS COMPACTOS ADAPTADOS A TU PALETA ---
    const labelStyle = {
        backgroundColor: '#E5EDF1', // El gris azulado claro
        color: '#334155', // Texto principal
        fontWeight: '800',
        padding: '6px 10px', // Reducido para evitar scroll
        borderBottom: '1px solid #CBD5E1',
        borderRight: '1px solid #CBD5E1',
        width: '20%',
        verticalAlign: 'top',
        fontSize: '11px', // Más pequeño
        textTransform: 'uppercase'
    };

    const valueStyle = {
        backgroundColor: '#FFF',
        color: '#334155',
        padding: '6px 10px', // Reducido
        borderBottom: '1px solid #CBD5E1',
        borderRight: '1px solid #CBD5E1',
        width: '30%',
        verticalAlign: 'top',
        whiteSpace: 'pre-wrap',
        fontSize: '12px' // Más pequeño
    };

    const valueFullStyle = {
        backgroundColor: '#FFF',
        color: '#334155',
        padding: '6px 10px',
        borderBottom: '1px solid #CBD5E1',
        width: '80%',
        verticalAlign: 'top',
        whiteSpace: 'pre-wrap',
        fontSize: '12px'
    };

    // Funciones de renderizado de celdas
    const renderFila4 = (l1, v1, l2, v2) => (
        <tr>
            <td style={labelStyle}>{l1}</td>
            <td style={valueStyle}>{v1 || 'Pendiente'}</td>
            <td style={labelStyle}>{l2}</td>
            <td style={{ ...valueStyle, borderRight: 'none' }}>{v2 || 'Pendiente'}</td>
        </tr>
    );

    const renderFila2 = (l1, v1) => (
        <tr>
            <td style={labelStyle}>{l1}</td>
            <td colSpan="3" style={valueFullStyle}>{v1 || 'Pendiente'}</td>
        </tr>
    );

    // Componente "Tarjeta" compacta
    const SeccionTabla = ({ titulo, icono, children }) => (
        <div style={{ backgroundColor: '#FFF', borderRadius: '8px', overflow: 'hidden', border: '1px solid #96C2DB', boxShadow: '0 2px 4px rgba(150, 194, 219, 0.1)', marginBottom: '16px' }}>
            {/* Cabecera compacta */}
            <div style={{ backgroundColor: '#96C2DB', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {React.cloneElement(icono, { color: '#FFF', size: 16 })}
                <h3 style={{ margin: 0, color: '#FFF', fontSize: '13px', fontWeight: '800', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                    {titulo}
                </h3>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Inter', sans-serif" }}>
                <tbody>
                    {children}
                </tbody>
            </table>
        </div>
    );

    return (
        <div style={{ width: '100%', padding: '16px', backgroundColor: '#F1F5F9', minHeight: '100%' }}>

            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

                <SeccionTabla titulo="Propuesta de Perfil de Puesto" icono={<Briefcase />}>
                    {renderFila4('Cliente / Empresa', vacante.cliente, 'Fecha de levantamiento', vacante.fecha_creacion?.split('T')[0])}
                    {renderFila4('Contacto responsable', vacante.contacto_responsable, 'Consultor responsable', 'Pendiente')}
                    {renderFila4('Puesto propuesto', vacante.puesto_nombre || vacante.nombre_puesto, 'Área / Departamento', vacante.area_departamento)}
                    {renderFila4('Ubicación', vacante.municipio_nombre, 'Nivel del puesto', vacante.nivel_puesto)}
                    {renderFila4('Tipo de contratación', vacante.tipo_contratacion, 'Número de vacantes', vacante.numero_vacantes)}
                    {renderFila4('Sueldo propuesto', vacante.sueldo_ofertado ? `$${vacante.sueldo_ofertado}` : 'Pendiente', 'Sueldo promedio mercado', vacante.sueldo_mercado ? `$${vacante.sueldo_mercado}` : 'Pendiente')}
                    {renderFila4('Promedio mercado ubicación', 'Pendiente', 'Periodicidad de pago', vacante.periodicidad_pago)}
                </SeccionTabla>

                <SeccionTabla titulo="Resumen Ejecutivo del Perfil" icono={<Target />}>
                    {renderFila2('Objetivo del puesto', vacante.objetivo_puesto)}
                    {renderFila2('Resultados esperados', vacante.resultados_esperados)}
                    {renderFila2('Funciones principales sugeridas', vacante.funciones_diarias_sugeridas)}
                    {renderFila2('Funciones diarias hechas por cliente', vacante.funciones_diarias_cliente)}
                    {renderFila2('Responsabilidades críticas', vacante.responsabilidades_cliente || vacante.responsabilidades_sugeridas)}
                    {renderFila2('Indicadores / KPIs', vacante.kpis)}
                </SeccionTabla>

                <SeccionTabla titulo="Perfil Requerido" icono={<GraduationCap />}>
                    {renderFila4('Escolaridad mínima', vacante.escolaridad_requerida, 'Carrera / especialidad', vacante.carrera_especialidad)}
                    {renderFila4('Experiencia mínima', vacante.experiencia_minima ? `${vacante.experiencia_minima} años` : '', 'Experiencia deseable', vacante.experiencia_deseable)}
                    {renderFila4('Edad deseada', vacante.edad_deseada, 'Idioma requerido', vacante.idioma_requerido)}
                    {renderFila4('Software / herramientas', vacante.herramientas !== '[]' ? vacante.herramientas : '', 'Certificaciones', vacante.certificaciones)}
                    {renderFila4('Disponibilidad para viajar', vacante.disponibilidad_viajar, 'Disponibilidad para rolar turnos', vacante.disponibilidad_rolar_turnos)}
                </SeccionTabla>

                <SeccionTabla titulo="Competencias y Factores de Éxito" icono={<Award />}>
                    {renderFila2('Competencias técnicas sugeridas', vacante.competencias_tecnicas_sugeridas)}
                    {renderFila2('Competencias técnicas validadas por cliente', vacante.competencias_tecnicas_cliente)}
                    {renderFila2('Competencias blandas', vacante.competencias_blandas_sugeridas || vacante.competencias_blandas_cliente)}
                    {renderFila2('Factores clave de éxito sugeridos', vacante.factores_exito_sugeridos)}
                    {renderFila2('Factores clave de éxito del cliente', vacante.factores_exito_cliente)}
                </SeccionTabla>

                <SeccionTabla titulo="Condiciones y Proceso" icono={<DollarSign />}>
                    {renderFila4('Sueldo bruto mensual', vacante.sueldo_ofertado ? `$${vacante.sueldo_ofertado}` : 'Pendiente', 'Sueldo neto mensual', 'Pendiente')}
                    {renderFila4('Prestaciones', vacante.prestaciones, 'Bonos / comisiones', vacante.pagos_adicionales)}
                    {renderFila4('Horario', vacante.horario, 'Modalidad', vacante.modalidad)}
                    {renderFila4('Zona de trabajo', vacante.municipio_nombre, 'Herramientas proporcionadas', vacante.herramientas_proporcionadas)}
                    {renderFila4('Entrevistas requeridas', vacante.entrevistas_requeridas, 'Evaluaciones requeridas', vacante.evaluaciones_requeridas)}
                    {renderFila4('Documentos necesarios', vacante.documentos_necesarios, 'Tiempo ideal de cobertura', vacante.tiempo_cobertura)}
                </SeccionTabla>

                <SeccionTabla titulo="Validación del Cliente" icono={<CheckSquare />}>
                    {renderFila4('¿Está de acuerdo con el perfil?', 'Pendiente', 'Fecha de validación', 'Pendiente')}
                    {renderFila2('Comentarios o ajustes solicitados', 'NA')}
                    {renderFila4('Nombre y firma del cliente', '', 'Nombre y firma consultor', '')}
                </SeccionTabla>

                <SeccionTabla titulo="Propuesta Comercial" icono={<FileText />}>
                    {renderFila4('Cliente / Empresa', vacante.cliente, 'Puesto a cubrir', vacante.puesto_nombre || vacante.nombre_puesto)}
                    {renderFila4('Servicio propuesto', 'Reclutamiento y selección', 'Tipo de contratación', vacante.tipo_contratacion)}
                    {renderFila4('Honorarios acordados', 'Pendiente de confirmar', 'Garantía', 'Pendiente')}
                    {renderFila4('Exclusividad', 'Sí', 'Fecha compromiso de terna', 'Pendiente')}
                    {renderFila2('Alcance del servicio', `El servicio comprende el levantamiento y validación del perfil, publicación de vacantes, filtro curricular, entrevistas iniciales, entrevistas profundas, pruebas psicométricas (de acuerdo con el perfil del puesto), estudio socioeconómico, integración de terna (envío de candidatos al cliente para el puesto de ${vacante.puesto_nombre || 'Pendiente'}). La propuesta considera sueldo ofrecido $${vacante.sueldo_ofertado || '0'}, mercado promedio $0, rango de mercado $0 a $0, jornada ${vacante.jornada || 'Completa'} y prestaciones ${vacante.prestaciones || 'Pendiente'}.`)}
                    {renderFila2('Compromisos del cliente', 'El cliente se compromete a validar el perfil, entregar retroalimentación oportuna, confirmar condiciones laborales y participar en entrevistas/decisiones dentro de los tiempos acordados. Una vez enviada la terna, el cliente se compromete a dar respuesta en un máximo de 3 días hábiles, indicando que candidatos desea que se envíen a entrevista.')}
                    {renderFila2('Condiciones de aceptación', 'La aceptación de esta propuesta confirma el perfil, condiciones comerciales, garantía y alcance del servicio. Para la aplicación e inicio de la búsqueda, el cliente se compromete a realizar el pago del 50% del costo acordado a nuestra cuenta bancaria. Cualquier ajuste posterior deberá documentarse por escrito entre ambas partes.')}
                    {renderFila2('Aceptación del cliente', 'De común acuerdo, el cliente autoriza el inicio del proceso bajo las condiciones aquí descritas.')}
                    {renderFila4('Firma del cliente', '', 'Fecha', '')}
                    {renderFila4('Firma consultor', '', 'Fecha', '')}
                </SeccionTabla>

                {/* AVISO DE PRIVACIDAD */}
                <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', marginTop: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        <ShieldAlert size={14} color="#64748B" />
                        <h4 style={{ margin: 0, color: '#475569', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>Aviso de Privacidad y Tratamiento de Datos</h4>
                    </div>
                    <p style={{ margin: 0, color: '#64748B', fontSize: '10px', textAlign: 'justify', lineHeight: '1.4' }}>
                        Partners & Masters informa que los datos personales, laborales, académicos, profesionales, referencias, resultados de entrevistas, evaluaciones psicométricas y estudios socioeconómicos recabados durante el proceso de reclutamiento serán utilizados exclusivamente para fines de evaluación, validación, integración de expediente, presentación de candidatos al cliente y seguimiento del proceso de selección. La información será tratada de forma confidencial y sólo será compartida con el cliente contratante cuando sea necesario para la evaluación de la vacante solicitada. El titular podrá solicitar acceso, rectificación, cancelación u oposición al tratamiento de sus datos personales a través de los medios de contacto de Partners & Masters. Al Contacto para privacidad: contacto@partners-masters.com | Tel. +52 81 1234 1234 | www.partners-masters.com
                    </p>
                </div>

            </div>
        </div>
    );
};

export default DocumentoPerfilador;
