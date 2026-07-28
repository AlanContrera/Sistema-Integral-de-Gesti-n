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
            margin:       [10, 10, 10, 10],
            filename:     `Reporte_Cliente_${candidato?.nombre_completo?.replace(/\s+/g, '_') || 'Candidato'}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'mm', format: 'letter', orientation: 'portrait' },
            pagebreak:    { mode: 'css', avoid: ['tr', 'h2', 'h3', 'h4', '.evitar-salto'] }
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
                rubros: rubrosArray
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', display: 'flex', alignItems: 'center' }}>
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 style={{ fontSize: '28px', color: '#1E293B', fontWeight: '800', margin: 0 }}>{candidato.nombre_completo}</h1>
                    <p style={{ color: '#64748B', fontSize: '15px', margin: '4px 0 0 0' }}>Aplicando a: {candidato.vacante_nombre} en {candidato.cliente_nombre}</p>
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
                            {/* Resumen Superior (Porcentaje en vivo) */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', marginBottom: '24px', border: '1px solid #E2E8F0' }}>
                                <div>
                                    <h4 style={{ margin: 0, color: '#475569', fontSize: '14px' }}>Avance de Evaluación</h4>
                                    <div style={{ fontSize: '24px', fontWeight: '800', color: '#1E293B' }}>
                                        {Object.values(respuestasProfunda).filter(r => r.nivel).length} / {generarPreguntasCompletas().length} rubros
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <h4 style={{ margin: 0, color: '#475569', fontSize: '14px' }}>Porcentaje de Apego</h4>
                                    <div style={{ fontSize: '28px', fontWeight: '800', color: '#0EA5E9' }}>
                                        {calcularPorcentajeEnVivo()}%
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
                                            <div key={p.id} style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '16px' }}>
                                                
                                                <div style={{ marginBottom: '12px' }}>
                                                    <div style={{ color: '#1E293B', fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>{p.pregunta}</div>
                                                    <div style={{ color: '#64748B', fontSize: '13px', fontStyle: 'italic' }}>
                                                        <Target size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                                                        Esperado: {p.criterio_evaluacion}
                                                    </div>
                                                </div>

                                                <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '16px', alignItems: 'start' }}>
                                                    
                                                    <div>
                                                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px', display: 'block' }}>Nivel Detectado</label>
                                                        <select
                                                            required
                                                            value={respuestasProfunda[p.id]?.nivel || ''}
                                                            onChange={e => handleRespuestaProfunda(p.id, p.rubro, 'nivel', e.target.value)}
                                                            style={{
                                                                width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '13px', fontWeight: '500', backgroundColor:
                                                                    respuestasProfunda[p.id]?.nivel === 'nulo' ? '#FEE2E2' :
                                                                    respuestasProfunda[p.id]?.nivel === 'basico' ? '#FFEDD5' :
                                                                    respuestasProfunda[p.id]?.nivel === 'intermedio' ? '#E0F2FE' :
                                                                    respuestasProfunda[p.id]?.nivel === 'experto' ? '#DCFCE7' : 'white',
                                                                color: 
                                                                    respuestasProfunda[p.id]?.nivel === 'nulo' ? '#991B1B' :
                                                                    respuestasProfunda[p.id]?.nivel === 'basico' ? '#C2410C' :
                                                                    respuestasProfunda[p.id]?.nivel === 'intermedio' ? '#0369A1' :
                                                                    respuestasProfunda[p.id]?.nivel === 'experto' ? '#166534' : '#334155'
                                                            }}
                                                        >
                                                            <option value="" disabled>Selecciona nivel...</option>
                                                            <option value="nulo">0 - Nulo</option>
                                                            <option value="basico">1 - Básico</option>
                                                            <option value="intermedio">2 - Intermedio</option>
                                                            <option value="experto">3 - Experto</option>
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px', display: 'block' }}>Notas / Evidencia del Candidato</label>
                                                        <textarea 
                                                            placeholder="Escribe la evidencia observada..."
                                                            value={respuestasProfunda[p.id]?.notas || ''}
                                                            onChange={e => handleRespuestaProfunda(p.id, p.rubro, 'notas', e.target.value)}
                                                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', minHeight: '60px', fontFamily: 'inherit', resize: 'vertical' }}
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
                                                <div style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px', fontStyle: 'italic', backgroundColor: 'white', padding: '12px', borderRadius: '6px', border: '1px dashed #CBD5E1' }}>
                                                    <Target size={14} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                                                    El análisis ejecutivo final, incluyendo redacción de fortalezas y brechas, se procesará en el servidor al presionar <strong>Guardar Evaluación</strong>.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}

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

            {/* Pestaña: Reporte (Estilo Excel Reporte Cliente 1) */}
            {tab === 'reporte' && (
                <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid #F1F5F9' }}>
                        <h3 style={{ margin: 0, color: '#0F172A', fontSize: '22px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FileText size={24} color="#0EA5E9" /> Reporte Ejecutivo
                        </h3>
                        {entrevistaProfunda && (
                            <button onClick={handleGenerarPDF} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#3B82F6', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)', transition: 'background-color 0.2s' }}>
                                <Download size={18} /> Generar PDF para Cliente
                            </button>
                        )}
                    </div>

                    <div id="reporte-cliente-pdf" style={{ backgroundColor: '#ffffff', padding: '40px 50px', fontFamily: '"Inter", "Segoe UI", sans-serif', width: '100%', maxWidth: '1000px', margin: '0 auto', color: '#374151', lineHeight: '1.5', boxSizing: 'border-box' }}>
                        
                        {/* 1. ENCABEZADO CORPORATIVO */}
                        <div style={{ borderBottom: '3px solid #1F4E78', paddingBottom: '24px', marginBottom: '32px' }}>
                            <h1 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 24px 0', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Reporte Ejecutivo de Candidato
                            </h1>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', fontSize: '13px' }}>
                                <div>
                                    <span style={{ color: '#6B7280', display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: '600', marginBottom: '2px' }}>Cliente / Empresa</span>
                                    <span style={{ fontWeight: '600', color: '#111827' }}>{vacanteData?.cliente_nombre || 'IACI'}</span>
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
                                    <span style={{ color: '#6B7280', display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: '600', marginBottom: '2px' }}>Sueldo ofertado</span>
                                    <span style={{ fontWeight: '500' }}>${vacanteData?.sueldo_maximo || 0}</span>
                                </div>
                                <div>
                                    <span style={{ color: '#6B7280', display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: '600', marginBottom: '2px' }}>Ubicación</span>
                                    <span style={{ fontWeight: '500' }}>{vacanteData?.ubicacion || 'N/A'}</span>
                                </div>
                                <div>
                                    <span style={{ color: '#6B7280', display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: '600', marginBottom: '2px' }}>Consultor responsable</span>
                                    <span style={{ fontWeight: '500' }}>{vacanteData?.reclutador_asignado_nombre || 'No asignado'}</span>
                                </div>
                                <div>
                                    <span style={{ color: '#6B7280', display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: '600', marginBottom: '2px' }}>Contacto cliente</span>
                                    <span style={{ fontWeight: '500' }}>{vacanteData?.contacto_nombre || 'Claudia Abundis'}</span>
                                </div>
                            </div>

                            <div style={{ marginTop: '24px', padding: '16px 24px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <span style={{ color: '#64748B', display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: '600', marginBottom: '4px' }}>Candidato Evaluado</span>
                                    <span style={{ fontWeight: '800', fontSize: '18px', color: '#0F172A' }}>{candidato?.nombre_completo}</span>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ color: '#64748B', display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: '600', marginBottom: '4px' }}>Resultado General</span>
                                    <span style={{ fontWeight: '700', fontSize: '16px', color: entrevistaProfunda ? '#1F4E78' : '#94A3B8' }}>
                                        {entrevistaProfunda?.resultado_sugerido || 'Pendiente: faltan evaluaciones'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 2. RESUMEN EJECUTIVO */}
                        <div style={{ marginBottom: '32px' }}>
                            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#1F4E78', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Resumen Ejecutivo
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '16px', fontSize: '13px' }}>
                                <div style={{ fontWeight: '600', color: '#475569' }}>Conclusión para cliente:</div>
                                <div style={{ color: '#111827' }}>{entrevistaProfunda ? 'Evaluación detallada completada. Perfil validado para presentación inicial.' : 'Aún no hay suficientes evaluaciones para emitir recomendación confiable.'}</div>
                                
                                <div style={{ fontWeight: '600', color: '#475569' }}>Motivo principal:</div>
                                <div style={{ color: '#111827', fontWeight: entrevistaProfunda ? '600' : 'normal' }}>
                                    {entrevistaProfunda ? `El candidato obtuvo un resultado sugerido de: ${entrevistaProfunda.resultado_sugerido}` : 'Pendiente de concluir entrevistas y evaluaciones técnicas.'}
                                </div>
                            </div>
                        </div>

                        {/* 3. VALIDACIONES REALIZADAS (Tabla limpia) */}
                        <div style={{ marginBottom: '32px' }}>
                            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#1F4E78', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px', pageBreakAfter: 'avoid' }}>
                                Validaciones Realizadas
                            </h2>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #E2E8F0' }}>
                                        <th style={{ padding: '0 0 12px 0', color: '#64748B', fontWeight: '600', textTransform: 'uppercase', fontSize: '11px', width: '20%' }}>Etapa del Proceso</th>
                                        <th style={{ padding: '0 0 12px 12px', color: '#64748B', fontWeight: '600', textTransform: 'uppercase', fontSize: '11px', width: '25%' }}>Resultado / Estatus</th>
                                        <th style={{ padding: '0 0 12px 12px', color: '#64748B', fontWeight: '600', textTransform: 'uppercase', fontSize: '11px', width: '55%' }}>Evidencia Revisada & Observaciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                                        <td style={{ padding: '16px 0', fontWeight: '600', color: '#334155' }}>Perfilador</td>
                                        <td style={{ padding: '16px 0 16px 12px', color: '#10B981', fontWeight: '500' }}>✓ Validado</td>
                                        <td style={{ padding: '16px 0 16px 12px', color: '#475569' }}>
                                            <span style={{ display: 'block', fontWeight: '500', color: '#1E293B', marginBottom: '4px' }}>Funciones, competencias, sueldo y ubicación.</span>
                                            Perfil base alineado exitosamente contra los requisitos levantados con el cliente.
                                        </td>
                                    </tr>
                                    <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                                        <td style={{ padding: '16px 0', fontWeight: '600', color: '#334155' }}>Entrevista Inicial</td>
                                        <td style={{ padding: '16px 0 16px 12px', fontWeight: '500', color: entrevistaInicial ? '#10B981' : '#F59E0B' }}>
                                            {entrevistaInicial ? '✓ Completada' : '⏱ Pendiente'}
                                        </td>
                                        <td style={{ padding: '16px 0 16px 12px', color: '#475569' }}>
                                            <span style={{ display: 'block', fontWeight: '500', color: '#1E293B', marginBottom: '4px' }}>Fit básico, disponibilidad, experiencia y expectativa.</span>
                                            {entrevistaInicial ? 'El candidato cumple con los filtros iniciales requeridos.' : 'Faltan respuestas preliminares del candidato.'}
                                        </td>
                                    </tr>
                                    <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                                        <td style={{ padding: '16px 0', fontWeight: '600', color: '#334155' }}>Entrevista Profunda</td>
                                        <td style={{ padding: '16px 0 16px 12px', fontWeight: '500', color: entrevistaProfunda ? '#10B981' : '#F59E0B' }}>
                                            {entrevistaProfunda ? `✓ Completada (${entrevistaProfunda.porcentaje}%)` : '⏱ Pendiente'}
                                        </td>
                                        <td style={{ padding: '16px 0 16px 12px', color: '#475569' }}>
                                            <span style={{ display: 'block', fontWeight: '500', color: '#1E293B', marginBottom: '4px' }}>Dominio técnico, experiencia, actitud y viabilidad logística.</span>
                                            {entrevistaProfunda ? 'Evaluación detallada concluida por el consultor asignado.' : 'Es necesario completar la matriz de evaluación técnica.'}
                                        </td>
                                    </tr>
                                    <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                                        <td style={{ padding: '16px 0', fontWeight: '600', color: '#334155' }}>Decisión Integrada</td>
                                        <td style={{ padding: '16px 0 16px 12px', fontWeight: '600', color: '#1E293B' }}>
                                            {entrevistaProfunda ? entrevistaProfunda.semaforo.toUpperCase() : 'Pendiente'}
                                        </td>
                                        <td style={{ padding: '16px 0 16px 12px', color: '#475569' }}>
                                            <span style={{ display: 'block', fontWeight: '500', color: '#1E293B', marginBottom: '4px' }}>Cruce de entrevista profunda + habilidades.</span>
                                            {entrevistaProfunda ? 'El cruce de datos permite emitir una recomendación formal.' : 'A la espera de conclusión de etapas previas.'}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* 4. FORTALEZAS DEL PERFIL VS VACANTE */}
                        <div className="evitar-salto" style={{ marginBottom: '32px', pageBreakInside: 'avoid' }}>
                            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#1F4E78', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Análisis del Perfil vs Vacante
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                
                                <div>
                                    <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: '600', color: '#475569' }}>Funciones Clave del Puesto:</h4>
                                    <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '6px', fontSize: '13px', color: '#1E293B', lineHeight: '1.6' }}>
                                        {entrevistaProfunda ? entrevistaProfunda.analisis_ejecutivo : 'Pendiente: faltan evaluaciones. Completar matriz para obtener el análisis.'}
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div>
                                        <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: '600', color: '#059669' }}>Fortalezas y Responsabilidades Críticas:</h4>
                                        <div style={{ padding: '16px', border: '1px solid #D1FAE5', backgroundColor: '#ECFDF5', borderRadius: '6px', fontSize: '13px', color: '#065F46', whiteSpace: 'pre-wrap', lineHeight: '1.6', minHeight: '100px' }}>
                                            {entrevistaProfunda && entrevistaProfunda.fortalezas ? entrevistaProfunda.fortalezas : '• Sin fortalezas mapeadas actualmente.'}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: '600', color: '#D97706' }}>Brechas Técnicas Detectadas:</h4>
                                        <div style={{ padding: '16px', border: '1px solid #FEF3C7', backgroundColor: '#FFFBEB', borderRadius: '6px', fontSize: '13px', color: '#92400E', whiteSpace: 'pre-wrap', lineHeight: '1.6', minHeight: '100px' }}>
                                            {entrevistaProfunda && entrevistaProfunda.brechas ? entrevistaProfunda.brechas : '• Sin áreas de riesgo mapeadas actualmente.'}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: '600', color: '#475569' }}>Competencias Blandas (Viabilidad):</h4>
                                    <div style={{ padding: '12px 16px', borderLeft: '3px solid #3B82F6', backgroundColor: '#EFF6FF', fontSize: '13px', color: '#1E3A8A' }}>
                                        <strong>Traslado y Disponibilidad:</strong> {entrevistaProfunda ? (entrevistaProfunda.semaforo === 'verde' ? 'Óptima - Sin fricciones detectadas.' : 'Requiere revisión detallada con el candidato.') : 'Pendiente de evaluación.'}
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* 5 y 6. CALLOUTS FINALES (Validaciones y Notas) */}
                        <div className="evitar-salto" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', pageBreakInside: 'avoid' }}>
                            
                            {/* PUNTOS A VALIDAR */}
                            <div style={{ padding: '20px', backgroundColor: '#FFFAF0', border: '1px solid #FDE68A', borderRadius: '8px' }}>
                                <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: '700', color: '#92400E', textTransform: 'uppercase' }}>
                                    Puntos a Validar con el Cliente
                                </h3>
                                <ul style={{ margin: 0, paddingLeft: '20px', color: '#78350F', fontSize: '13px', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <li>Confirmar expectativa salarial final y condiciones de aceptación.</li>
                                    <li>Validar las brechas técnicas marcadas en la evaluación profunda.</li>
                                    <li>Asegurar compatibilidad de horarios y tiempos de traslado.</li>
                                    <li>Profundizar conjuntamente en los riesgos detectados.</li>
                                </ul>
                            </div>

                            {/* NOTA IMPORTANTE */}
                            <div style={{ padding: '20px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px' }}>
                                <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: '700', color: '#991B1B', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <AlertTriangle size={16} /> Nota Importante del Proceso
                                </h3>
                                <div style={{ fontSize: '13px', color: '#7F1D1D', lineHeight: '1.6' }}>
                                    <p style={{ margin: '0 0 12px 0' }}>
                                        <strong>Estatus:</strong> Aún están pendientes las pruebas psicométricas y el estudio socioeconómico.
                                    </p>
                                    <p style={{ margin: '0 0 12px 0' }}>
                                        <strong>Recomendación:</strong> Sugerimos concluir el proceso completo de evaluaciones antes de tomar una decisión final.
                                    </p>
                                    <p style={{ margin: 0, fontWeight: '600' }}>
                                        No se recomienda citar al candidato para laborar sin haber cerrado estos procesos.
                                    </p>
                                </div>
                            </div>

                        </div>

                        {/* 7. PIE DE REPORTE */}
                        <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#94A3B8' }}>
                            <div>Este es un reporte confidencial generado exclusivamente para el cliente.</div>
                            <div>Página 1 de 1</div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default FlujoCandidato;
