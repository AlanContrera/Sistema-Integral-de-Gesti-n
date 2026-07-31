import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchConToken } from '../services/api';
import { User, FileText, CheckCircle, AlertTriangle, XCircle, ArrowLeft, ChevronDown, ChevronRight, BarChart2, Calendar, Briefcase, Target, Cpu, Brain, Activity, Download } from 'lucide-react';
import toast from 'react-hot-toast';


const FlujoCandidato = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cargando, setCargando] = useState(true);
    const [candidato, setCandidato] = useState(null);
    const [entrevistaInicial, setEntrevistaInicial] = useState(null);
    const [entrevistaProfunda, setEntrevistaProfunda] = useState(null);
    const [vacanteData, setVacanteData] = useState(null); // Nuevo estado para la vacante
    const [acordeonActivo, setAcordeonActivo] = useState('analisis'); // Controla el panel derecho

    const [respuestasInicial, setRespuestasInicial] = useState({});
    const [plantillasPregunta, setPlantillasPregunta] = useState([]);
    const [respuestasProfunda, setRespuestasProfunda] = useState({});
    const [agendaCliente, setAgendaCliente] = useState({
        agendar_cliente: false,
        fecha_entrevista_cliente: '',
        hora_entrevista_cliente: '',
        modalidad_cliente: '',
        detalles_agenda_cliente: ''
    });
    const [tab, setTab] = useState('inicial'); // 'inicial', 'profunda', 'reporte'



    useEffect(() => {
        cargarDatos();
    }, [id]);

    const cargarDatos = async () => {
        try {
            setCargando(true);
            let dataCand = null;
            const resCand = await fetchConToken(`/reclutamiento/candidatos/${id}/`);
            if (resCand.ok) {
                dataCand = await resCand.json();
                setCandidato(dataCand);

                // Cargar la vacante para mostrar las señales clave
                if (dataCand.vacante) {
                    const resVac = await fetchConToken(`/reclutamiento/vacantes/${dataCand.vacante}/`);
                    if (resVac.ok) setVacanteData(await resVac.json());
                }
            }


            // Buscar Entrevista Inicial
            const resInicial = await fetchConToken(`/reclutamiento/entrevistas-iniciales/?candidato=${id}`);
            if (resInicial.ok) {
                const data = await resInicial.json();
                const miInicial = data.find(e => e.candidato === parseInt(id));
                if (miInicial) {
                    setEntrevistaInicial(miInicial);
                    setRespuestasInicial(miInicial.respuestas || {});
                }
            }

            // Buscar Entrevista Profunda
            const resProfunda = await fetchConToken(`/reclutamiento/entrevistas-profundas/?candidato=${id}`);
            if (resProfunda.ok) {
                const data = await resProfunda.json();
                const miProfunda = data.find(e => e.candidato === parseInt(id));
                if (miProfunda) {
                    setEntrevistaProfunda(miProfunda);
                    const rubrosExistentes = miProfunda.rubros || [];
                    const mapRespuestas = {};
                    rubrosExistentes.forEach(r => {
                        if (r.id_pregunta) mapRespuestas[r.id_pregunta] = r;
                    });
                    setRespuestasProfunda(mapRespuestas);
                    
                    setAgendaCliente({
                        agendar_cliente: miProfunda.agendar_cliente || false,
                        fecha_entrevista_cliente: miProfunda.fecha_entrevista_cliente || '',
                        hora_entrevista_cliente: miProfunda.hora_entrevista_cliente || '',
                        modalidad_cliente: miProfunda.modalidad_cliente || '',
                        detalles_agenda_cliente: miProfunda.detalles_agenda_cliente || ''
                    });
                }
            }

            // Buscar plantillas de la categoría del candidato
            if (dataCand && dataCand.categoria_puesto_id) {
                const resPlantillas = await fetchConToken(`/reclutamiento/preguntas/?categoria=${dataCand.categoria_puesto_id}`);
                if (resPlantillas.ok) {
                    const dataP = await resPlantillas.json();
                    setPlantillasPregunta(dataP);
                }
            }

        } catch (error) {
            console.error(error);
        } finally {
            setCargando(false);
        }
    };

    const handleGuardarInicial = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                candidato: parseInt(id),
                respuestas: respuestasInicial,
                resultado: 'observacion' // Se recalcula en backend
            };

            let res;
            if (entrevistaInicial) {
                res = await fetchConToken(`/reclutamiento/entrevistas-iniciales/${entrevistaInicial.id}/`, {
                    method: 'PUT',
                    body: JSON.stringify(payload)
                });
            } else {
                res = await fetchConToken('/reclutamiento/entrevistas-iniciales/', {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });
            }

            if (!res.ok) throw new Error('Error al guardar entrevista inicial');
            alert('Entrevista inicial guardada. Semáforo actualizado.');
            cargarDatos();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleRespuestaInicial = (campo, valor) => {
        setRespuestasInicial(prev => ({ ...prev, [campo]: valor }));
    };

    // Combinar preguntas del catálogo + preguntas estándar de la vacante
    const generarPreguntasCompletas = () => {
        let completas = [...plantillasPregunta];

        if (vacanteData) {
            completas.push({
                id: 'std_salario',
                rubro: 'Alineación salarial',
                pregunta: `El sueldo ofertado es de $${vacanteData.sueldo_ofertado}. ¿Estás de acuerdo con el paquete de compensación?`,
                criterio_evaluacion: 'Debe aceptar sin reservas el sueldo y prestaciones ofertadas.'
            });
            completas.push({
                id: 'std_escolaridad',
                rubro: 'Escolaridad',
                pregunta: `El perfil exige escolaridad: ${vacanteData.escolaridad_requerida}. ¿Cuentas con ella?`,
                criterio_evaluacion: 'Debe contar con evidencia comprobable (título, cédula o certificado).'
            });
            completas.push({
                id: 'std_experiencia',
                rubro: 'Experiencia mínima',
                pregunta: `El perfil exige experiencia mínima de ${vacanteData.experiencia_minima} años. ¿Los tienes comprobables?`,
                criterio_evaluacion: 'La experiencia debe ser comprobable, reciente y en el mismo rubro.'
            });
            completas.push({
                id: 'std_traslado',
                rubro: 'Traslado / Disponibilidad',
                pregunta: `La vacante está en ${vacanteData.municipio_nombre || 'la zona indicada'}. ¿Tienes disponibilidad para trasladarte y cumplir el horario?`,
                criterio_evaluacion: 'Debe estar dispuesto a trasladarse el tiempo necesario sin que represente un riesgo de rotación.'
            });
        }
        return completas;
    };

    // Funciones Entrevista Profunda
    const agruparPlantillas = (plantillas) => {
        const grupos = {};
        plantillas.forEach(p => {
            if (!grupos[p.rubro]) grupos[p.rubro] = [];
            grupos[p.rubro].push(p);
        });
        return Object.keys(grupos).map(k => ({ rubro: k, preguntas: grupos[k] }));
    };

    const handleRespuestaProfunda = (id_pregunta, rubro, campo, valor) => {
        setRespuestasProfunda(prev => ({
            ...prev,
            [id_pregunta]: {
                ...prev[id_pregunta],
                id_pregunta,
                rubro,
                [campo]: valor
            }
        }));
    };

    const calcularPorcentajeEnVivo = () => {
        const completas = generarPreguntasCompletas();
        if (completas.length === 0) return 0;
        let puntaje = 0;
        const valores = { nulo: 0, basico: 1, intermedio: 2, experto: 3 };
        Object.values(respuestasProfunda).forEach(r => {
            if (r.nivel && valores[r.nivel] !== undefined) puntaje += valores[r.nivel];
        });
        const maxPosible = completas.length * 3;
        if (maxPosible === 0) return 0;
        return ((puntaje / maxPosible) * 100).toFixed(1);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const calcularResumenEnVivo = () => {
        let nulos = 0, basicos = 0, intermedios = 0, expertos = 0;
        const completas = generarPreguntasCompletas();
        const total = completas.length;

        Object.values(respuestasProfunda).forEach(r => {
            if (r.nivel === 'nulo') nulos++;
            else if (r.nivel === 'basico') basicos++;
            else if (r.nivel === 'intermedio') intermedios++;
            else if (r.nivel === 'experto') expertos++;
        });

        const respondidas = nulos + basicos + intermedios + expertos;
        const porcentajeNum = parseFloat(calcularPorcentajeEnVivo());

        let semaforo = 'gris';
        let resultado_sugerido = 'Pendiente: faltan evaluaciones';

        if (respondidas > 0 && respondidas === total) {
            if (nulos > 0 || porcentajeNum < 65) {
                semaforo = 'rojo';
                resultado_sugerido = 'No enviar al cliente. Riesgos detectados.';
            } else if (porcentajeNum >= 70) {
                semaforo = 'verde';
                resultado_sugerido = 'Viable para entrevista con el cliente.';
            } else {
                semaforo = 'amarillo';
                resultado_sugerido = 'Viable con reservas. Validar brechas antes de enviar.';
            }
        }

        return { nulos, basicos, intermedios, expertos, respondidas, total, semaforo, resultado_sugerido, porcentajeNum };
    };

    const handleGenerarPDF = () => {
        const elemento = document.getElementById('reporte-cliente-pdf');

        const opciones = {
            margin: [10, 10, 10, 10],
            filename: `Reporte_Cliente_${candidato?.nombre_completo?.replace(/\s+/g, '_') || 'Candidato'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' },
            pagebreak: { mode: 'css', avoid: ['tr', 'h2', 'h3', 'h4', '.evitar-salto'] }
        };

        toast.promise(
            window.html2pdf().set(opciones).from(elemento).save(),
            {
                loading: 'Generando PDF optimizado (1 página)...',
                success: '¡Reporte PDF descargado exitosamente!',
                error: 'Hubo un error al generar el PDF.'
            }
        );
    };

    const handleGuardarProfunda = async (e) => {
        e.preventDefault();
        try {
            const completas = generarPreguntasCompletas();
            const rubrosArray = Object.values(respuestasProfunda).map(r => {
                const p = completas.find(x => x.id === r.id_pregunta);
                return {
                    id_pregunta: r.id_pregunta,
                    rubro: r.rubro,
                    nivel: r.nivel || 'nulo',
                    pregunta: p ? p.pregunta : '',
                    notas: r.notas || ''
                };
            });

            const payload = {
                candidato: parseInt(id),
                rubros: rubrosArray,
                agendar_cliente: agendaCliente.agendar_cliente,
                fecha_entrevista_cliente: agendaCliente.fecha_entrevista_cliente || null,
                hora_entrevista_cliente: agendaCliente.hora_entrevista_cliente || null,
                modalidad_cliente: agendaCliente.modalidad_cliente || null,
                detalles_agenda_cliente: agendaCliente.detalles_agenda_cliente || null
            };

            let res;
            if (entrevistaProfunda) {
                res = await fetchConToken(`/reclutamiento/entrevistas-profundas/${entrevistaProfunda.id}/`, {
                    method: 'PUT',
                    body: JSON.stringify(payload)
                });
            } else {
                res = await fetchConToken('/reclutamiento/entrevistas-profundas/', {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });
            }

            if (!res.ok) throw new Error('Error al guardar la entrevista profunda');
            alert('Evaluación guardada. Analizando fortalezas y brechas...');
            cargarDatos();
        } catch (error) {
            alert(error.message);
        }
    };

    const generarSemaforoUi = (semaforo) => {
        if (semaforo === 'verde') return <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', backgroundColor: '#DCFCE7', padding: '8px 16px', borderRadius: '8px', fontWeight: '600' }}><CheckCircle size={20} /> Viable / Verde</div>;
        if (semaforo === 'amarillo') return <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#854D0E', backgroundColor: '#FEF9C3', padding: '8px 16px', borderRadius: '8px', fontWeight: '600' }}><AlertTriangle size={20} /> Observación / Amarillo</div>;
        if (semaforo === 'rojo') return <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#991B1B', backgroundColor: '#FEE2E2', padding: '8px 16px', borderRadius: '8px', fontWeight: '600' }}><XCircle size={20} /> No Viable / Rojo</div>;
        return <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', backgroundColor: '#F1F5F9', padding: '8px 16px', borderRadius: '8px', fontWeight: '600' }}>Sin evaluar</div>;
    };

    if (cargando) return <div style={{ padding: '40px' }}>Cargando perfil...</div>;
    if (!candidato) return <div style={{ padding: '40px' }}>Candidato no encontrado.</div>;

    const navStyle = (active) => ({
        padding: '12px 24px', fontWeight: '600', cursor: 'pointer',
        borderBottom: active ? '3px solid #0EA5E9' : '3px solid transparent',
        color: active ? '#0EA5E9' : '#64748B',
        backgroundColor: active ? '#F0F9FF' : 'transparent',
        transition: 'all 0.2s ease'
    });

    const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0', boxSizing: 'border-box', fontSize: '14px', marginTop: '4px' };

    return (
        <div style={{ paddingBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', display: 'flex', alignItems: 'center' }}>
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 style={{ fontSize: '28px', color: '#1E293B', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {candidato.nombre_completo}
                            <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '12px', backgroundColor: '#E2E8F0', color: '#475569', fontWeight: '700', textTransform: 'uppercase', verticalAlign: 'middle' }}>
                                {candidato.estatus?.replace('_', ' ')}
                            </span>
                        </h1>
                        <p style={{ color: '#64748B', fontSize: '15px', margin: '4px 0 0 0' }}>Aplicando a: {candidato.vacante_nombre} en {candidato.cliente_nombre}</p>
                    </div>
                </div>
            </div>

            {/* Navegación de Pestañas */}
            <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', marginBottom: '24px' }}>
                <div style={navStyle(tab === 'inicial')} onClick={() => setTab('inicial')}>Entrevista Inicial</div>
                <div style={navStyle(tab === 'profunda')} onClick={() => setTab('profunda')}>Entrevista Profunda</div>
                <div style={navStyle(tab === 'reporte')} onClick={() => setTab('reporte')}>Reporte Ejecutivo</div>
            </div>

            {/* Pestaña: Entrevista Inicial */}
            {tab === 'inicial' && (
                <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                    <div style={{ flex: 2, backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ margin: '0 0 16px 0', color: '#1E293B', fontSize: '18px' }}>Cuestionario Filtro (10 Preguntas)</h3>
                        <form onSubmit={handleGuardarInicial}>
                            {/* PREGUNTAS ABIERTAS (TEXTO LIBRE) */}
                            {[
                                { id: 'p1', label: '1. Cuéntame brevemente tu experiencia más reciente relacionada con el puesto. (Años y responsabilidades)' },
                                { id: 'p2', label: '2. ¿Cuántos años de experiencia tienes en funciones similares? Dame ejemplos concretos.' },
                                { id: 'p3', label: '3. ¿Cuál es tu escolaridad máxima comprobable?' },
                                { id: 'p4', label: '4. ¿Qué carrera, especialidad o formación tienes relacionada con el puesto?' },
                                { id: 'p5', label: '5. ¿Qué software, herramientas, equipo o sistemas manejas y en qué nivel?' },
                                { id: 'p6', label: '6. ¿Cómo manejas presión, urgencias, cambios de prioridad o incidencias en la operación?' },
                                { id: 'p7', label: '7. ¿Cuál fue un logro o indicador importante (KPI) que cumpliste en tu último empleo?' },
                                { id: 'p8', label: '8. ¿Te queda viable el traslado a la zona de trabajo y en qué tiempo llegarías?' },
                                { id: 'p9', label: '9. ¿Cuál es tu expectativa salarial (MXN Libre)?' },
                                { id: 'p10', label: '10. ¿Por qué te interesa esta vacante y qué tendría que pasar para que aceptes una oferta?' }
                            ].map((pregunta) => (
                                <div key={pregunta.id} style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', fontWeight: '600', color: '#334155', marginBottom: '4px', fontSize: '13px' }}>{pregunta.label}</label>
                                    <textarea
                                        required
                                        value={respuestasInicial[pregunta.id] || ''}
                                        onChange={e => handleRespuestaInicial(pregunta.id, e.target.value)}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', minHeight: '60px', fontFamily: 'inherit', fontSize: '13px' }}
                                        placeholder="Notas del candidato..."
                                    />
                                </div>
                            ))}

                            {/* FACTORES CRÍTICOS DEL PERFILADOR */}
                            <h3 style={{ margin: '32px 0 16px 0', color: '#1E293B', fontSize: '16px', borderTop: '2px solid #E2E8F0', paddingTop: '24px' }}>
                                FACTORES CRÍTICOS DEL PERFILADOR
                            </h3>
                            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px' }}>Evalúa estos rubros con base en tus notas de arriba.</p>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px', backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '8px' }}>
                                {[
                                    { id: 'f_escolaridad', label: 'Escolaridad mínima' },
                                    { id: 'f_experiencia', label: 'Experiencia mínima' },
                                    { id: 'f_carrera', label: 'Carrera / Especialidad' },
                                    { id: 'f_herramientas', label: 'Software / Herramientas' }
                                ].map(factor => (
                                    <div key={factor.id}>
                                        <label style={{ display: 'block', fontWeight: '600', color: '#475569', fontSize: '12px', marginBottom: '4px' }}>{factor.label}</label>
                                        <select
                                            required
                                            value={respuestasInicial[factor.id] || ''}
                                            onChange={e => handleRespuestaInicial(factor.id, e.target.value)}
                                            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                                        >
                                            <option value="">Selecciona...</option>
                                            <option value="Cumple">Cumple</option>
                                            <option value="No cumple">No cumple</option>
                                        </select>
                                    </div>
                                ))}
                            </div>

                            <button type="submit" style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', backgroundColor: '#0EA5E9', color: 'white', fontWeight: '600', cursor: 'pointer', width: '100%' }}>
                                Evaluar Viabilidad y Guardar
                            </button>
                        </form>

                    </div>


                    {/* COLUMNA DERECHA: PANELES ESTILO ACORDEÓN MODERNO */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '20px' }}>

                        {/* PANEL 1: RESUMEN DEL PERFILADOR */}
                        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
                            <div
                                onClick={() => setAcordeonActivo(acordeonActivo === 'resumen' ? '' : 'resumen')}
                                style={{ padding: '16px', backgroundColor: acordeonActivo === 'resumen' ? '#0EA5E9' : 'white', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s' }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Target size={18} color={acordeonActivo === 'resumen' ? 'white' : '#0EA5E9'} />
                                    <h3 style={{ margin: 0, fontSize: '15px', color: acordeonActivo === 'resumen' ? 'white' : '#1E293B', fontWeight: '600' }}>Resumen del Perfilador</h3>
                                </div>
                                <span style={{ color: acordeonActivo === 'resumen' ? 'white' : '#94A3B8' }}>{acordeonActivo === 'resumen' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}</span>
                            </div>

                            {acordeonActivo === 'resumen' && (
                                <div style={{ padding: '20px', fontSize: '13px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid #E2E8F0' }}>
                                    {vacanteData ? (
                                        <>
                                            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '8px' }}>
                                                <Briefcase size={16} color="#64748B" style={{ marginTop: '2px' }} />
                                                <div><strong style={{ color: '#0F172A', display: 'block', marginBottom: '4px' }}>Funciones sugeridas</strong>{vacanteData.funciones_diarias_sugeridas || 'No especificadas'}</div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '8px' }}>
                                                <Activity size={16} color="#64748B" style={{ marginTop: '2px' }} />
                                                <div><strong style={{ color: '#0F172A', display: 'block', marginBottom: '4px' }}>Responsabilidades críticas</strong>{vacanteData.responsabilidades_sugeridas || 'No especificadas'}</div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '8px' }}>
                                                <Cpu size={16} color="#64748B" style={{ marginTop: '2px' }} />
                                                <div><strong style={{ color: '#0F172A', display: 'block', marginBottom: '4px' }}>Competencias técnicas</strong>{vacanteData.competencias_tecnicas || 'No especificadas'}</div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '8px' }}>
                                                <Brain size={16} color="#64748B" style={{ marginTop: '2px' }} />
                                                <div><strong style={{ color: '#0F172A', display: 'block', marginBottom: '4px' }}>Competencias blandas</strong>{vacanteData.competencias_blandas || 'No especificadas'}</div>
                                            </div>
                                        </>
                                    ) : (
                                        <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><AlertTriangle size={16} color="#94A3B8" /> Cargando datos de la vacante...</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* PANEL 2: ANÁLISIS AUTOMÁTICO DE VIABILIDAD */}
                        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
                            <div
                                onClick={() => setAcordeonActivo(acordeonActivo === 'analisis' ? '' : 'analisis')}
                                style={{ padding: '16px', backgroundColor: acordeonActivo === 'analisis' ? '#0EA5E9' : 'white', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s' }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <BarChart2 size={18} color={acordeonActivo === 'analisis' ? 'white' : '#0EA5E9'} />
                                    <h3 style={{ margin: 0, fontSize: '15px', color: acordeonActivo === 'analisis' ? 'white' : '#1E293B', fontWeight: '600' }}>Análisis de Viabilidad</h3>
                                </div>
                                <span style={{ color: acordeonActivo === 'analisis' ? 'white' : '#94A3B8' }}>{acordeonActivo === 'analisis' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}</span>
                            </div>

                            {acordeonActivo === 'analisis' && (
                                <div style={{ padding: '24px', borderTop: '1px solid #E2E8F0' }}>
                                    {entrevistaInicial ? (
                                        <div>
                                            {generarSemaforoUi(entrevistaInicial.semaforo)}

                                            <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '13px', whiteSpace: 'pre-wrap' }}>
                                                <strong style={{ color: '#0F172A', display: 'block', marginBottom: '4px' }}>Justificación automática del sistema:</strong>
                                                <span style={{ color: '#334155' }}>{entrevistaInicial.notas}</span>
                                            </div>

                                            <div style={{ marginTop: '24px', borderTop: '1px dashed #CBD5E1', paddingTop: '20px' }}>
                                                <label style={{ display: 'block', fontWeight: '600', color: '#1E293B', marginBottom: '8px', fontSize: '13px' }}>Decisión final del reclutador:</label>
                                                <select
                                                    value={respuestasInicial.decision_final || ''}
                                                    onChange={e => handleRespuestaInicial('decision_final', e.target.value)}
                                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', backgroundColor: '#F8FAFC', color: '#0F172A', fontWeight: '500' }}
                                                >
                                                    <option value="">Selecciona la decisión final...</option>
                                                    <option value="Avanza">Pasar a Entrevista Profunda</option>
                                                    <option value="Rechazado">No avanzar (Rechazado)</option>
                                                    <option value="Cartera">Dejar en Cartera</option>
                                                </select>
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ textAlign: 'center', padding: '24px 0', color: '#64748B' }}>
                                            <BarChart2 size={40} color="#CBD5E1" style={{ marginBottom: '12px', display: 'inline-block' }} />
                                            <p style={{ fontSize: '13px', margin: 0, lineHeight: '1.5' }}>Responde el cuestionario de la izquierda y haz clic en "Evaluar" para generar el análisis.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* PANEL 3: AGENDA DE ENTREVISTA PROFUNDA */}
                        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
                            <div
                                onClick={() => setAcordeonActivo(acordeonActivo === 'agenda' ? '' : 'agenda')}
                                style={{ padding: '16px', backgroundColor: acordeonActivo === 'agenda' ? '#0EA5E9' : 'white', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s' }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Calendar size={18} color={acordeonActivo === 'agenda' ? 'white' : '#10B981'} />
                                    <h3 style={{ margin: 0, fontSize: '15px', color: acordeonActivo === 'agenda' ? 'white' : '#1E293B', fontWeight: '600' }}>Agenda de Entrevista</h3>
                                </div>
                                <span style={{ color: acordeonActivo === 'agenda' ? 'white' : '#94A3B8' }}>{acordeonActivo === 'agenda' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}</span>
                            </div>

                            {acordeonActivo === 'agenda' && (
                                <div style={{ padding: '20px', borderTop: '1px solid #E2E8F0' }}>
                                    {respuestasInicial.decision_final === 'Avanza' ? (
                                        <>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', padding: '10px 12px', backgroundColor: '#ECFDF5', color: '#065F46', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                                                <CheckCircle size={16} /> Sí aplica agenda
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                                <div>
                                                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '4px', display: 'block' }}>Fecha</label>
                                                    <input type="date" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', color: '#334155' }} />
                                                </div>
                                                <div>
                                                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '4px', display: 'block' }}>Hora</label>
                                                    <input type="time" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', color: '#334155' }} />
                                                </div>
                                            </div>

                                            <div style={{ marginBottom: '16px' }}>
                                                <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '4px', display: 'block' }}>Responsable (Entrevistador)</label>
                                                <input type="text" placeholder="Ej. Juan Pérez" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }} />
                                            </div>

                                            <div style={{ marginBottom: '16px' }}>
                                                <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '4px', display: 'block' }}>Modalidad / Liga / Ubicación</label>
                                                <input type="text" placeholder="Zoom o Dirección física" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }} />
                                            </div>

                                            <div style={{ marginBottom: '20px' }}>
                                                <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '4px', display: 'block' }}>Notas / Instrucciones</label>
                                                <textarea placeholder="Recordarle traer identificación..." style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', minHeight: '60px', fontFamily: 'inherit' }} />
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '13px', color: '#334155' }}>
                                                <input type="checkbox" id="confirmacion" />
                                                <label htmlFor="confirmacion">Confirmación enviada al candidato</label>
                                            </div>

                                            <button style={{ width: '100%', padding: '12px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                                <Calendar size={18} /> Guardar Agenda
                                            </button>
                                        </>
                                    ) : (
                                        <div style={{ padding: '16px', backgroundColor: '#F8FAFC', color: '#64748B', borderRadius: '8px', fontSize: '13px', textAlign: 'center', border: '1px dashed #CBD5E1' }}>
                                            <AlertTriangle size={24} style={{ marginBottom: '8px', opacity: 0.5, display: 'inline-block' }} />
                                            <br />
                                            La agenda solo se habilita si la Decisión Final es <strong>"Pasar a Entrevista Profunda"</strong>.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                    </div>




                </div>
            )}

            {/* Pestaña: Entrevista Profunda */}
            {tab === 'profunda' && (
                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ margin: '0 0 16px 0', color: '#1E293B', fontSize: '18px' }}>Entrevista Profunda Basada en Competencias</h3>

                    {plantillasPregunta.length === 0 ? (
                        <div style={{ padding: '20px', backgroundColor: '#F1F5F9', color: '#475569', borderRadius: '8px', textAlign: 'center' }}>
                            Cargando rubros de evaluación...
                        </div>
                    ) : (
                        <form onSubmit={handleGuardarProfunda}>
                            {/* Resumen Superior (Porcentaje en vivo) Tema Claro */}
                            <div style={{ 
                                backgroundColor: 'white', 
                                padding: '28px 32px', 
                                borderRadius: '16px', 
                                marginBottom: '32px', 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                border: '1px solid #E2E8F0',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                            }}>
                                <div style={{ flex: 1, paddingRight: '40px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                                        <div style={{ backgroundColor: '#F0F9FF', padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Target size={28} color="#0EA5E9" />
                                        </div>
                                        <div>
                                            <h4 style={{ margin: 0, color: '#64748B', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Progreso de Evaluación</h4>
                                            <div style={{ fontSize: '28px', fontWeight: '800', color: '#1E293B', marginTop: '4px', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                                {Object.values(respuestasProfunda).filter(r => r.nivel).length} 
                                                <span style={{ color: '#94A3B8', fontSize: '16px', fontWeight: '500' }}>/ {generarPreguntasCompletas().length} rubros evaluados</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Barra de progreso visual */}
                                    <div style={{ height: '8px', backgroundColor: '#F1F5F9', borderRadius: '10px', overflow: 'hidden' }}>
                                        <div style={{ 
                                            width: `${(Object.values(respuestasProfunda).filter(r => r.nivel).length / generarPreguntasCompletas().length) * 100}%`, 
                                            height: '100%', 
                                            backgroundColor: '#0EA5E9',
                                            transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                            borderRadius: '10px'
                                        }} />
                                    </div>
                                </div>
                                <div style={{ borderLeft: '1px solid #E2E8F0', paddingLeft: '40px', textAlign: 'center', minWidth: '180px' }}>
                                    <h4 style={{ margin: 0, color: '#64748B', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Apego al Perfil</h4>
                                    <div style={{ 
                                        fontSize: '48px', 
                                        fontWeight: '900', 
                                        color: '#0EA5E9',
                                        marginTop: '4px',
                                        lineHeight: '1'
                                    }}>
                                        {calcularPorcentajeEnVivo()}%
                                    </div>
                                    <div style={{ fontSize: '13px', color: '#94A3B8', marginTop: '8px', fontWeight: '500' }}>
                                        Calculado en tiempo real
                                    </div>
                                </div>
                            </div>

                            {/* Tarjetas por Grupos */}
                            {agruparPlantillas(generarPreguntasCompletas()).map(grupo => (
                                <div key={grupo.rubro} style={{ marginBottom: '32px' }}>
                                    <h4 style={{ margin: '0 0 16px 0', color: '#0F172A', fontSize: '16px', borderBottom: '2px solid #E2E8F0', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Briefcase size={18} color="#64748B" /> {grupo.rubro}
                                    </h4>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                                        {grupo.preguntas.map(p => (
                                            <div key={p.id} style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>

                                                <div style={{ marginBottom: '20px', borderLeft: '4px solid #0EA5E9', paddingLeft: '16px' }}>
                                                    <div style={{ color: '#0F172A', fontSize: '15px', fontWeight: '700', lineHeight: '1.5' }}>{p.pregunta}</div>
                                                </div>

                                                <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '24px', alignItems: 'start' }}>

                                                    <div>
                                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nivel Detectado</label>
                                                        <select
                                                            required
                                                            value={respuestasProfunda[p.id]?.nivel || ''}
                                                            onChange={e => handleRespuestaProfunda(p.id, p.rubro, 'nivel', e.target.value)}
                                                            style={{
                                                                width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', backgroundColor:
                                                                    respuestasProfunda[p.id]?.nivel === 'nulo' ? '#FEE2E2' :
                                                                        respuestasProfunda[p.id]?.nivel === 'basico' ? '#FFEDD5' :
                                                                            respuestasProfunda[p.id]?.nivel === 'intermedio' ? '#E0F2FE' :
                                                                                respuestasProfunda[p.id]?.nivel === 'experto' ? '#DCFCE7' : '#F8FAFC',
                                                                color:
                                                                    respuestasProfunda[p.id]?.nivel === 'nulo' ? '#991B1B' :
                                                                        respuestasProfunda[p.id]?.nivel === 'basico' ? '#C2410C' :
                                                                            respuestasProfunda[p.id]?.nivel === 'intermedio' ? '#0369A1' :
                                                                                respuestasProfunda[p.id]?.nivel === 'experto' ? '#166534' : '#475569'
                                                            }}
                                                        >
                                                            <option value="" disabled>Seleccionar...</option>
                                                            <option value="nulo">0 - Nulo</option>
                                                            <option value="basico">1 - Básico</option>
                                                            <option value="intermedio">2 - Intermedio</option>
                                                            <option value="experto">3 - Experto</option>
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Notas / Evidencia Observada</label>
                                                        <textarea
                                                            placeholder="Escribe la evidencia observada (opcional pero recomendado)..."
                                                            value={respuestasProfunda[p.id]?.notas || ''}
                                                            onChange={e => handleRespuestaProfunda(p.id, p.rubro, 'notas', e.target.value)}
                                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', minHeight: '80px', fontFamily: 'inherit', resize: 'vertical', backgroundColor: '#F8FAFC', color: '#334155' }}
                                                        />
                                                    </div>

                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {/* Panel Resumen Antes de Guardar */}
                            {(() => {
                                const res = calcularResumenEnVivo();
                                return (
                                    <div style={{ backgroundColor: '#F8FAFC', borderRadius: '12px', padding: '24px', border: '1px solid #E2E8F0', marginTop: '32px' }}>
                                        <h4 style={{ margin: '0 0 20px 0', color: '#1E293B', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Activity size={18} color="#0EA5E9" /> Resumen Automático (Previo al Guardado)
                                        </h4>
                                        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                                            <div style={{ flex: 1, minWidth: '250px' }}>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                                                    <div style={{ backgroundColor: '#FEE2E2', padding: '12px', borderRadius: '8px', textAlign: 'center', color: '#991B1B', border: '1px solid #FECACA' }}>
                                                        <div style={{ fontSize: '20px', fontWeight: '800' }}>{res.nulos}</div>
                                                        <div style={{ fontWeight: '500' }}>Nulos</div>
                                                    </div>
                                                    <div style={{ backgroundColor: '#FFEDD5', padding: '12px', borderRadius: '8px', textAlign: 'center', color: '#C2410C', border: '1px solid #FED7AA' }}>
                                                        <div style={{ fontSize: '20px', fontWeight: '800' }}>{res.basicos}</div>
                                                        <div style={{ fontWeight: '500' }}>Básicos</div>
                                                    </div>
                                                    <div style={{ backgroundColor: '#E0F2FE', padding: '12px', borderRadius: '8px', textAlign: 'center', color: '#0369A1', border: '1px solid #BAE6FD' }}>
                                                        <div style={{ fontSize: '20px', fontWeight: '800' }}>{res.intermedios}</div>
                                                        <div style={{ fontWeight: '500' }}>Intermedios</div>
                                                    </div>
                                                    <div style={{ backgroundColor: '#DCFCE7', padding: '12px', borderRadius: '8px', textAlign: 'center', color: '#166534', border: '1px solid #BBF7D0' }}>
                                                        <div style={{ fontSize: '20px', fontWeight: '800' }}>{res.expertos}</div>
                                                        <div style={{ fontWeight: '500' }}>Expertos</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ flex: 2, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <span style={{ fontSize: '14px', color: '#64748B', fontWeight: '600', width: '150px' }}>Resultado Sugerido:</span>
                                                    <span style={{ fontSize: '15px', color: '#1E293B', fontWeight: '600' }}>{res.resultado_sugerido}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <span style={{ fontSize: '14px', color: '#64748B', fontWeight: '600', width: '150px' }}>Semáforo Previsto:</span>
                                                    {generarSemaforoUi(res.semaforo)}
                                                </div>
                                                {/* Mensaje de procesamiento eliminado por solicitud del usuario */}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* --- SECCIÓN: AGENDAR ENTREVISTA CON CLIENTE --- */}
                            <div style={{ marginTop: '32px', backgroundColor: agendaCliente.agendar_cliente ? '#F0FDF4' : '#F8FAFC', border: agendaCliente.agendar_cliente ? '2px solid #86EFAC' : '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', transition: 'all 0.3s ease' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: agendaCliente.agendar_cliente ? '20px' : '0' }}>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: agendaCliente.agendar_cliente ? '#166534' : '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Calendar size={22} />
                                            Siguiente Paso: Agendar Entrevista con Cliente
                                        </h3>
                                        <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748B' }}>
                                            Activa esta opción si el candidato cumple con el perfil y se presentará al cliente.
                                        </p>
                                    </div>
                                    <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '28px' }}>
                                        <input
                                            type="checkbox"
                                            checked={agendaCliente.agendar_cliente}
                                            onChange={(e) => setAgendaCliente({ ...agendaCliente, agendar_cliente: e.target.checked })}
                                            style={{ opacity: 0, width: 0, height: 0 }}
                                        />
                                        <span style={{
                                            position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                                            backgroundColor: agendaCliente.agendar_cliente ? '#10B981' : '#CBD5E1',
                                            transition: '.4s', borderRadius: '34px'
                                        }}>
                                            <span style={{
                                                position: 'absolute', content: '""', height: '20px', width: '20px', left: '4px', bottom: '4px',
                                                backgroundColor: 'white', transition: '.4s', borderRadius: '50%',
                                                transform: agendaCliente.agendar_cliente ? 'translateX(22px)' : 'translateX(0)'
                                            }}></span>
                                        </span>
                                    </label>
                                </div>

                                {agendaCliente.agendar_cliente && (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px', borderTop: '1px solid #BBF7D0', paddingTop: '20px' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#166534', marginBottom: '6px' }}>Fecha Programada</label>
                                            <input 
                                                type="date" 
                                                value={agendaCliente.fecha_entrevista_cliente}
                                                onChange={(e) => setAgendaCliente({ ...agendaCliente, fecha_entrevista_cliente: e.target.value })}
                                                style={{ ...inputStyle, borderColor: '#86EFAC', backgroundColor: 'white' }} 
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#166534', marginBottom: '6px' }}>Hora</label>
                                            <input 
                                                type="time" 
                                                value={agendaCliente.hora_entrevista_cliente}
                                                onChange={(e) => setAgendaCliente({ ...agendaCliente, hora_entrevista_cliente: e.target.value })}
                                                style={{ ...inputStyle, borderColor: '#86EFAC', backgroundColor: 'white' }} 
                                            />
                                        </div>
                                        <div style={{ gridColumn: '1 / -1' }}>
                                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#166534', marginBottom: '6px' }}>Modalidad</label>
                                            <select 
                                                value={agendaCliente.modalidad_cliente}
                                                onChange={(e) => setAgendaCliente({ ...agendaCliente, modalidad_cliente: e.target.value })}
                                                style={{ ...inputStyle, borderColor: '#86EFAC', backgroundColor: 'white' }}
                                            >
                                                <option value="">Seleccionar modalidad...</option>
                                                <option value="Virtual (Teams / Zoom)">Virtual (Teams / Zoom / Meet)</option>
                                                <option value="Presencial (Instalaciones Cliente)">Presencial (Instalaciones del Cliente)</option>
                                                <option value="Presencial (Oficinas IACI)">Presencial (Nuestras Oficinas)</option>
                                                <option value="Telefónica">Llamada Telefónica</option>
                                            </select>
                                        </div>
                                        <div style={{ gridColumn: '1 / -1' }}>
                                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#166534', marginBottom: '6px' }}>Liga de la reunión o Dirección Física / Detalles</label>
                                            <textarea 
                                                rows="3" 
                                                placeholder="Pega aquí el enlace de Teams o la dirección de las oficinas del cliente..."
                                                value={agendaCliente.detalles_agenda_cliente}
                                                onChange={(e) => setAgendaCliente({ ...agendaCliente, detalles_agenda_cliente: e.target.value })}
                                                style={{ ...inputStyle, borderColor: '#86EFAC', backgroundColor: 'white', resize: 'vertical' }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #E2E8F0' }}>
                                <button type="submit" style={{ padding: '14px 28px', borderRadius: '8px', border: 'none', backgroundColor: '#10B981', color: 'white', fontWeight: '600', fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)' }}>
                                    <CheckCircle size={20} />
                                    Guardar Evaluación Profunda
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}


            {/* Pestaña: Reporte (Botón de Descarga Limpio) */}
            {tab === 'reporte' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', padding: '60px 32px', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', minHeight: '400px' }}>
                    <div style={{ backgroundColor: '#F0F9FF', padding: '24px', borderRadius: '50%', marginBottom: '24px' }}>
                        <Download size={48} color="#0EA5E9" />
                    </div>
                    <h2 style={{ margin: '0 0 16px 0', color: '#0F172A', fontSize: '28px', fontWeight: '800' }}>
                        Descargar Reporte Ejecutivo
                    </h2>
                    <p style={{ margin: '0 0 32px 0', color: '#64748B', fontSize: '16px', maxWidth: '500px', textAlign: 'center', lineHeight: '1.6' }}>
                        El reporte descargable contiene la evaluación detallada con todos los rubros, fortalezas, brechas y el dictamen final para enviar al cliente.
                    </p>

                    {entrevistaProfunda ? (
                        <button onClick={handleGenerarPDF} style={{ padding: '16px 40px', borderRadius: '12px', border: 'none', backgroundColor: '#0EA5E9', color: 'white', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 15px -3px rgba(14, 165, 233, 0.3)', transition: 'all 0.2s' }}>
                            <FileText size={24} /> Descargar PDF (Listo para Cliente)
                        </button>
                    ) : (
                        <div style={{ padding: '20px 32px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '600' }}>
                            <AlertTriangle size={24} />
                            Falta completar la Entrevista Profunda
                        </div>
                    )}
                </div>
            )}

            {/* ===== PLANTILLA OCULTA PARA EL PDF (Sábana Completa de Entrevista Profunda) ===== */}
            <div style={{ position: 'absolute', left: '-10000px', top: '-10000px' }}>
                <div id="reporte-cliente-pdf" style={{ backgroundColor: '#ffffff', padding: '40px 50px', fontFamily: '"Inter", "Segoe UI", sans-serif', width: '1000px', color: '#374151', lineHeight: '1.5', boxSizing: 'border-box' }}>

                    {/* 1. ENCABEZADO CORPORATIVO */}
                    <div style={{ borderBottom: '3px solid #1F4E78', paddingBottom: '20px', marginBottom: '24px' }}>
                        <h1 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 24px 0', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Evaluación Técnica de Entrevista Profunda
                        </h1>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', fontSize: '13px' }}>
                            <div>
                                <span style={{ color: '#6B7280', display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: '600', marginBottom: '2px' }}>Cliente / Empresa</span>
                                <span style={{ fontWeight: '600', color: '#111827' }}>{vacanteData?.cliente_nombre || 'No registrado'}</span>
                            </div>
                            <div>
                                <span style={{ color: '#6B7280', display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: '600', marginBottom: '2px' }}>Puesto evaluado</span>
                                <span style={{ fontWeight: '600', color: '#111827' }}>{vacanteData?.titulo || 'N/A'}</span>
                            </div>
                            <div>
                                <span style={{ color: '#6B7280', display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: '600', marginBottom: '2px' }}>Fecha del reporte</span>
                                <span style={{ fontWeight: '500' }}>{formatDate(new Date())}</span>
                            </div>
                            <div>
                                <span style={{ color: '#6B7280', display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: '600', marginBottom: '2px' }}>Candidato</span>
                                <span style={{ fontWeight: '800', color: '#111827', fontSize: '15px' }}>{candidato?.nombre_completo}</span>
                            </div>
                        </div>
                    </div>

                    {/* 2. MATRIZ DE 37 RUBROS */}
                    <div style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '14px', fontWeight: '700', color: '#1F4E78', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px', marginBottom: '16px', textTransform: 'uppercase' }}>
                            Detalle de Evaluación por Competencia
                        </h2>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
                                    <th style={{ padding: '12px', color: '#475569', width: '30%', textTransform: 'uppercase', fontSize: '11px' }}>Rubro Evaluado</th>
                                    <th style={{ padding: '12px', color: '#475569', width: '20%', textTransform: 'uppercase', fontSize: '11px' }}>Nivel Detectado</th>
                                    <th style={{ padding: '12px', color: '#475569', width: '50%', textTransform: 'uppercase', fontSize: '11px' }}>Notas / Evidencia del Candidato</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entrevistaProfunda?.rubros?.map((rubro, idx) => {
                                    const colores = {
                                        nulo: { bg: '#FEE2E2', text: '#991B1B' },
                                        basico: { bg: '#FEF3C7', text: '#92400E' },
                                        intermedio: { bg: '#DBEAFE', text: '#1E3A8A' },
                                        experto: { bg: '#D1FAE5', text: '#065F46' }
                                    };
                                    const c = colores[rubro.nivel] || { bg: '#F1F5F9', text: '#475569' };

                                    return (
                                        <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9', pageBreakInside: 'avoid' }}>
                                            <td style={{ padding: '12px', fontWeight: '600', color: '#334155' }}>{rubro.rubro}</td>
                                            <td style={{ padding: '12px' }}>
                                                <span style={{
                                                    padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px', textTransform: 'uppercase',
                                                    backgroundColor: c.bg, color: c.text
                                                }}>
                                                    {rubro.nivel || 'N/A'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px', color: '#475569', whiteSpace: 'pre-wrap' }}>{rubro.notas || '-'}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* 3. ANÁLISIS EJECUTIVO Y DECISIÓN (Siguiente Paso) */}
                    <div className="evitar-salto" style={{ pageBreakInside: 'avoid', border: '2px solid #E2E8F0', borderRadius: '12px', padding: '24px', backgroundColor: '#F8FAFC' }}>
                        <h2 style={{ fontSize: '14px', fontWeight: '700', color: '#1F4E78', borderBottom: '1px solid #CBD5E1', paddingBottom: '8px', marginBottom: '20px', textTransform: 'uppercase' }}>
                            Conclusión Ejecutiva
                        </h2>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                            <div>
                                <h3 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: '700', color: '#059669', textTransform: 'uppercase' }}>Fortalezas Principales</h3>
                                <div style={{ whiteSpace: 'pre-wrap', fontSize: '13px', color: '#334155', lineHeight: '1.6' }}>{entrevistaProfunda?.fortalezas || 'No registradas.'}</div>
                            </div>
                            <div>
                                <h3 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: '700', color: '#D97706', textTransform: 'uppercase' }}>Riesgos y Brechas Técnicas</h3>
                                <div style={{ whiteSpace: 'pre-wrap', fontSize: '13px', color: '#334155', lineHeight: '1.6' }}>{entrevistaProfunda?.brechas || 'No registradas.'}</div>
                            </div>
                        </div>

                        <div style={{ borderTop: '2px dashed #CBD5E1', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: '12px', color: '#64748B', textTransform: 'uppercase', fontWeight: '600', marginBottom: '4px' }}>Desempeño Global</div>
                                <div style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A' }}>{entrevistaProfunda?.porcentaje}% <span style={{ fontSize: '14px', fontWeight: '500', color: '#64748B' }}>de afinidad</span></div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '12px', color: '#64748B', textTransform: 'uppercase', fontWeight: '600', marginBottom: '4px' }}>Siguiente Paso Recomendado</div>
                                <div style={{
                                    fontSize: '18px', fontWeight: '800', padding: '8px 16px', borderRadius: '8px', display: 'inline-block',
                                    backgroundColor: entrevistaProfunda?.semaforo === 'verde' ? '#D1FAE5' : entrevistaProfunda?.semaforo === 'amarillo' ? '#FEF3C7' : '#FEE2E2',
                                    color: entrevistaProfunda?.semaforo === 'verde' ? '#065F46' : entrevistaProfunda?.semaforo === 'amarillo' ? '#92400E' : '#991B1B'
                                }}>
                                    {entrevistaProfunda?.resultado_sugerido || 'Pendiente'}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default FlujoCandidato;

