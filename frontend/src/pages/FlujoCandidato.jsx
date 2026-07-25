import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchConToken } from '../services/api';
import { User, FileText, CheckCircle, AlertTriangle, XCircle, ArrowLeft } from 'lucide-react';

const FlujoCandidato = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [candidato, setCandidato] = useState(null);
    const [entrevistaInicial, setEntrevistaInicial] = useState(null);
    const [entrevistaProfunda, setEntrevistaProfunda] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [tab, setTab] = useState('inicial'); // 'inicial', 'profunda', 'reporte'

    const [respuestasInicial, setRespuestasInicial] = useState({});
    const [plantillasPregunta, setPlantillasPregunta] = useState([]);
    const [respuestasProfunda, setRespuestasProfunda] = useState({});
    
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
                        if(r.id_pregunta) mapRespuestas[r.id_pregunta] = r;
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

    // Funciones Entrevista Profunda
    const agruparPlantillas = (plantillas) => {
        const grupos = {};
        plantillas.forEach(p => {
            if (!grupos[p.rubro]) grupos[p.rubro] = [];
            grupos[p.rubro].push(p);
        });
        return Object.keys(grupos).map(k => ({ rubro: k, preguntas: grupos[k] }));
    };

    const handleRespuestaProfunda = (id_pregunta, rubro, nivel) => {
        setRespuestasProfunda(prev => ({
            ...prev,
            [id_pregunta]: { id_pregunta, rubro, nivel }
        }));
    };

    const calcularPorcentajeEnVivo = () => {
        if (plantillasPregunta.length === 0) return 0;
        let puntaje = 0;
        const valores = { nulo: 0, basico: 1, intermedio: 2, experto: 3 };
        Object.values(respuestasProfunda).forEach(r => {
            if (valores[r.nivel] !== undefined) puntaje += valores[r.nivel];
        });
        const maxPosible = plantillasPregunta.length * 3;
        if (maxPosible === 0) return 0;
        return ((puntaje / maxPosible) * 100).toFixed(1);
    };

    const handleGuardarProfunda = async (e) => {
        e.preventDefault();
        try {
            const rubrosArray = Object.values(respuestasProfunda);
            
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
        if (semaforo === 'verde') return <div style={{display:'flex', alignItems:'center', gap:'8px', color:'#166534', backgroundColor:'#DCFCE7', padding:'8px 16px', borderRadius:'8px', fontWeight:'600'}}><CheckCircle size={20}/> Viable / Verde</div>;
        if (semaforo === 'amarillo') return <div style={{display:'flex', alignItems:'center', gap:'8px', color:'#854D0E', backgroundColor:'#FEF9C3', padding:'8px 16px', borderRadius:'8px', fontWeight:'600'}}><AlertTriangle size={20}/> Observación / Amarillo</div>;
        if (semaforo === 'rojo') return <div style={{display:'flex', alignItems:'center', gap:'8px', color:'#991B1B', backgroundColor:'#FEE2E2', padding:'8px 16px', borderRadius:'8px', fontWeight:'600'}}><XCircle size={20}/> No Viable / Rojo</div>;
        return <div style={{display:'flex', alignItems:'center', gap:'8px', color:'#475569', backgroundColor:'#F1F5F9', padding:'8px 16px', borderRadius:'8px', fontWeight:'600'}}>Sin evaluar</div>;
    };

    if (cargando) return <div style={{padding:'40px'}}>Cargando perfil...</div>;
    if (!candidato) return <div style={{padding:'40px'}}>Candidato no encontrado.</div>;

    const navStyle = (active) => ({
        padding: '12px 24px', fontWeight: '600', cursor: 'pointer',
        borderBottom: active ? '3px solid #0EA5E9' : '3px solid transparent',
        color: active ? '#0EA5E9' : '#64748B',
        backgroundColor: active ? '#F0F9FF' : 'transparent',
        transition: 'all 0.2s ease'
    });

    const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0', boxSizing: 'border-box', fontSize: '14px', marginTop:'4px' };

    return (
        <div style={{ paddingBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <button onClick={() => navigate('/reclutamiento/candidatos')} style={{background:'none', border:'none', cursor:'pointer', color:'#64748B', display:'flex', alignItems:'center'}}>
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
                        <h3 style={{ margin: '0 0 16px 0', color: '#1E293B', fontSize:'18px' }}>Cuestionario Filtro (10 Preguntas)</h3>
                        <form onSubmit={handleGuardarInicial}>
                            
                            <div style={{marginBottom:'16px', backgroundColor:'#F8FAFC', padding:'16px', borderRadius:'8px', borderLeft:'4px solid #0EA5E9'}}>
                                <label style={{fontWeight:'600', color:'#334155'}}>1. ¿Cumple con la escolaridad requerida?</label>
                                <select value={respuestasInicial.escolaridad || ''} onChange={e => handleRespuestaInicial('escolaridad', e.target.value)} style={inputStyle}>
                                    <option value="">Selecciona...</option>
                                    <option value="Cumple">Sí cumple</option>
                                    <option value="No cumple">No cumple</option>
                                </select>
                            </div>

                            <div style={{marginBottom:'16px', backgroundColor:'#F8FAFC', padding:'16px', borderRadius:'8px', borderLeft:'4px solid #0EA5E9'}}>
                                <label style={{fontWeight:'600', color:'#334155'}}>2. ¿Cumple con la experiencia en el sector?</label>
                                <select value={respuestasInicial.experiencia || ''} onChange={e => handleRespuestaInicial('experiencia', e.target.value)} style={inputStyle}>
                                    <option value="">Selecciona...</option>
                                    <option value="Cumple">Sí cumple</option>
                                    <option value="No cumple">No cumple</option>
                                </select>
                            </div>

                            <div style={{marginBottom:'16px', backgroundColor:'#F8FAFC', padding:'16px', borderRadius:'8px', borderLeft:'4px solid #0EA5E9'}}>
                                <label style={{fontWeight:'600', color:'#334155'}}>3. ¿Manejo de herramientas necesarias?</label>
                                <select value={respuestasInicial.herramientas || ''} onChange={e => handleRespuestaInicial('herramientas', e.target.value)} style={inputStyle}>
                                    <option value="">Selecciona...</option>
                                    <option value="Cumple">Sí cumple</option>
                                    <option value="No cumple">No cumple</option>
                                </select>
                            </div>

                            <div style={{marginBottom:'16px', backgroundColor:'#F8FAFC', padding:'16px', borderRadius:'8px', borderLeft:'4px solid #0EA5E9'}}>
                                <label style={{fontWeight:'600', color:'#334155'}}>4. ¿Es viable su traslado / zona?</label>
                                <select value={respuestasInicial.traslado || ''} onChange={e => handleRespuestaInicial('traslado', e.target.value)} style={inputStyle}>
                                    <option value="">Selecciona...</option>
                                    <option value="si">Sí, viable</option>
                                    <option value="no/lejos">No, muy lejos</option>
                                </select>
                            </div>

                            <div style={{marginBottom:'16px', backgroundColor:'#F8FAFC', padding:'16px', borderRadius:'8px', borderLeft:'4px solid #0EA5E9'}}>
                                <label style={{fontWeight:'600', color:'#334155'}}>5. Expectativa Salarial (MXN Libre)</label>
                                <input type="number" value={respuestasInicial.expectativa_salarial || ''} onChange={e => handleRespuestaInicial('expectativa_salarial', e.target.value)} style={inputStyle} placeholder="Ej. 25000" />
                            </div>

                            <div style={{marginBottom:'16px', backgroundColor:'#F8FAFC', padding:'16px', borderRadius:'8px', borderLeft:'4px solid #0EA5E9'}}>
                                <label style={{fontWeight:'600', color:'#334155'}}>6. Motivación de cambio (Breve)</label>
                                <textarea value={respuestasInicial.motivacion || ''} onChange={e => handleRespuestaInicial('motivacion', e.target.value)} style={{...inputStyle, minHeight:'60px'}} />
                            </div>

                            <button type="submit" style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', backgroundColor: '#0EA5E9', color: 'white', fontWeight: '600', cursor: 'pointer', width:'100%' }}>
                                Evaluar y Guardar Filtro
                            </button>
                        </form>
                    </div>

                    <div style={{ flex: 1, backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', position:'sticky', top:'20px' }}>
                        <h3 style={{ margin: '0 0 16px 0', color: '#1E293B', fontSize:'18px' }}>Resultado Automático</h3>
                        {entrevistaInicial ? (
                            <div>
                                {generarSemaforoUi(entrevistaInicial.semaforo)}
                                <div style={{marginTop:'16px', padding:'12px', backgroundColor:'#F8FAFC', borderRadius:'8px', border:'1px solid #E2E8F0', fontSize:'14px', whiteSpace:'pre-wrap'}}>
                                    <strong>Análisis del Sistema:</strong><br/>
                                    {entrevistaInicial.notas}
                                </div>
                            </div>
                        ) : (
                            <p style={{color:'#64748B', fontSize:'14px'}}>Completa el cuestionario para obtener el semáforo de viabilidad.</p>
                        )}
                    </div>
                </div>
            )}

            {/* Pestaña: Entrevista Profunda */}
            {tab === 'profunda' && (
                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ margin: '0 0 16px 0', color: '#1E293B', fontSize:'18px' }}>Entrevista Profunda Basada en Competencias</h3>
                    
                    {plantillasPregunta.length === 0 ? (
                        <div style={{padding:'20px', backgroundColor:'#F1F5F9', color:'#475569', borderRadius:'8px', textAlign:'center'}}>
                            Cargando rubros de evaluación...
                        </div>
                    ) : (
                        <form onSubmit={handleGuardarProfunda}>
                            {/* Resumen Superior (Porcentaje en vivo) */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', marginBottom: '24px', border: '1px solid #E2E8F0' }}>
                                <div>
                                    <h4 style={{ margin: 0, color: '#475569', fontSize: '14px' }}>Avance de Evaluación</h4>
                                    <div style={{ fontSize: '24px', fontWeight: '800', color: '#1E293B' }}>
                                        {Object.keys(respuestasProfunda).length} / {plantillasPregunta.length} rubros
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <h4 style={{ margin: 0, color: '#475569', fontSize: '14px' }}>Porcentaje de Apego</h4>
                                    <div style={{ fontSize: '28px', fontWeight: '800', color: '#0EA5E9' }}>
                                        {calcularPorcentajeEnVivo()}%
                                    </div>
                                </div>
                            </div>

                            {/* Tabla por Grupos */}
                            {agruparPlantillas(plantillasPregunta).map(grupo => (
                                <div key={grupo.rubro} style={{ marginBottom: '32px' }}>
                                    <h4 style={{ margin: '0 0 12px 0', color: '#0F172A', fontSize: '16px', borderBottom: '2px solid #E2E8F0', paddingBottom: '8px' }}>
                                        {grupo.rubro}
                                    </h4>
                                    
                                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                        <thead>
                                            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                                                <th style={{ padding: '12px', color: '#64748B', fontWeight: '600', fontSize: '13px' }}>Pregunta / Función</th>
                                                <th style={{ padding: '12px', color: '#64748B', fontWeight: '600', fontSize: '13px', width: '30%' }}>Criterio de Evaluación</th>
                                                <th style={{ padding: '12px', color: '#64748B', fontWeight: '600', fontSize: '13px', width: '150px' }}>Calificación</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {grupo.preguntas.map(p => (
                                                <tr key={p.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                                    <td style={{ padding: '16px', color: '#1E293B', fontSize: '14px', verticalAlign: 'top' }}>
                                                        {p.pregunta}
                                                    </td>
                                                    <td style={{ padding: '16px', color: '#475569', fontSize: '13px', verticalAlign: 'top', fontStyle: 'italic' }}>
                                                        {p.criterio_evaluacion}
                                                    </td>
                                                    <td style={{ padding: '16px', verticalAlign: 'top' }}>
                                                        <select 
                                                            required
                                                            value={respuestasProfunda[p.id]?.nivel || ''} 
                                                            onChange={e => handleRespuestaProfunda(p.id, p.rubro, e.target.value)}
                                                            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '13px', backgroundColor: 
                                                                respuestasProfunda[p.id]?.nivel === 'nulo' ? '#FEE2E2' : 
                                                                respuestasProfunda[p.id]?.nivel === 'experto' ? '#DCFCE7' : 'white'
                                                            }}
                                                        >
                                                            <option value="">Evaluar...</option>
                                                            <option value="nulo">0 - Nulo</option>
                                                            <option value="basico">1 - Básico</option>
                                                            <option value="intermedio">2 - Intermedio</option>
                                                            <option value="experto">3 - Experto</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ))}

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #E2E8F0' }}>
                                {entrevistaProfunda?.semaforo ? generarSemaforoUi(entrevistaProfunda.semaforo) : <div/>}
                                
                                <button type="submit" style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', backgroundColor: '#10B981', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <CheckCircle size={20} />
                                    Guardar Evaluación Profunda
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}

            {/* Pestaña: Reporte */}
            {tab === 'reporte' && (
                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ margin: '0 0 16px 0', color: '#1E293B', fontSize:'18px' }}>Reporte Ejecutivo</h3>
                    
                    {entrevistaProfunda ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '8px' }}>
                                {generarSemaforoUi(entrevistaProfunda.semaforo)}
                                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Apego al Perfil: {entrevistaProfunda.porcentaje}%</div>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div style={{ backgroundColor: '#DCFCE7', padding: '16px', borderRadius: '8px', border: '1px solid #BBF7D0' }}>
                                    <h4 style={{ color: '#166534', margin: '0 0 12px 0' }}>Fortalezas Detectadas</h4>
                                    <div style={{ whiteSpace: 'pre-wrap', fontSize: '14px', color: '#14532D' }}>
                                        {entrevistaProfunda.fortalezas}
                                    </div>
                                </div>
                                <div style={{ backgroundColor: '#FEE2E2', padding: '16px', borderRadius: '8px', border: '1px solid #FECACA' }}>
                                    <h4 style={{ color: '#991B1B', margin: '0 0 12px 0' }}>Brechas / Riesgos</h4>
                                    <div style={{ whiteSpace: 'pre-wrap', fontSize: '14px', color: '#7F1D1D' }}>
                                        {entrevistaProfunda.brechas}
                                    </div>
                                </div>
                            </div>
                            
                            <div style={{ padding: '16px', backgroundColor: '#F1F5F9', borderRadius: '8px' }}>
                                <strong>Conclusión Sugerida:</strong> {entrevistaProfunda.resultado_sugerido}
                            </div>
                        </div>
                    ) : (
                        <p style={{color:'#64748B'}}>Completa primero la Evaluación Profunda para generar el reporte.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default FlujoCandidato;
