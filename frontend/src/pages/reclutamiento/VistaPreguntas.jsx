// Archivo: frontend/src/pages/reclutamiento/VistaPreguntas.jsx
import React, { useState, useEffect } from 'react';
import { Settings, Plus, Edit2, Trash2, Save } from 'lucide-react';
import { fetchConToken } from '../../services/api';

const VistaPreguntas = () => {
    const [tabActiva, setTabActiva] = useState('inicial');

    // ESTADOS: Preguntas Iniciales
    const [preguntasInicial, setPreguntasInicial] = useState([]);
    const [editandoId, setEditandoId] = useState(null);
    const [textoEditado, setTextoEditado] = useState("");

    // ESTADOS: Preguntas Profundas
    const [categorias, setCategorias] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
    const [preguntasProfunda, setPreguntasProfunda] = useState([]);
    const [editandoIdProfunda, setEditandoIdProfunda] = useState(null);
    const [textoEditadoProfunda, setTextoEditadoProfunda] = useState("");

    const [cargando, setCargando] = useState(false);

    // 1. Cargar Preguntas Iniciales
    const cargarIniciales = async () => {
        setCargando(true);
        try {
            const res = await fetchConToken('/reclutamiento/preguntas-iniciales/');
            if (res.ok) {
                const data = await res.json();
                setPreguntasInicial(data);
            }
        } catch (error) { console.error("Error cargando iniciales", error); }
        finally { setCargando(false); }
    };

    useEffect(() => {
        if (tabActiva === 'inicial') {
            cargarIniciales();
        }
    }, [tabActiva]);

    // 2. Cargar Categorías para las Profundas
    useEffect(() => {
        const cargarCategorias = async () => {
            try {
                const res = await fetchConToken('/reclutamiento/categorias/');
                if (res.ok) {
                    const data = await res.json();
                    setCategorias(data);
                    if (data.length > 0) setCategoriaSeleccionada(data[0].id);
                }
            } catch (error) { console.error(error); }
        };
        cargarCategorias();
    }, []);

    // 3. Cargar Preguntas Profundas
    const cargarPreguntasProfundas = async () => {
        if (!categoriaSeleccionada) return;
        setCargando(true);
        try {
            const res = await fetchConToken(`/reclutamiento/preguntas/?categoria=${categoriaSeleccionada}`);
            if (res.ok) setPreguntasProfunda(await res.json());
        } catch (error) { console.error(error); }
        finally { setCargando(false); }
    };

    useEffect(() => {
        if (tabActiva === 'profunda') {
            cargarPreguntasProfundas();
        }
    }, [categoriaSeleccionada, tabActiva]);

    // 4. Editar Pregunta Inicial (PUT)
    const guardarEdicionInicial = async (idPregunta) => {
        try {
            const preguntaOriginal = preguntasInicial.find(p => p.id === idPregunta);
            const res = await fetchConToken(`/reclutamiento/preguntas-iniciales/${idPregunta}/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...preguntaOriginal, pregunta: textoEditado })
            });

            if (res.ok) {
                setEditandoId(null);
                cargarIniciales();
            } else {
                alert("Error al guardar los cambios.");
            }
        } catch (error) { console.error("Error al actualizar", error); }
    };

    // 5. Editar Pregunta Profunda (PUT)
    const guardarEdicionProfunda = async (idPregunta) => {
        try {
            const preguntaOriginal = preguntasProfunda.find(p => p.id === idPregunta);
            const res = await fetchConToken(`/reclutamiento/preguntas/${idPregunta}/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...preguntaOriginal, pregunta: textoEditadoProfunda })
            });

            if (res.ok) {
                setEditandoIdProfunda(null);
                cargarPreguntasProfundas();
            } else {
                alert("Error al guardar los cambios.");
            }
        } catch (error) { console.error("Error al actualizar", error); }
    };

    // 6. Eliminar Pregunta Profunda
    const handleEliminarProfunda = async (idPregunta) => {
        if (!window.confirm('¿Seguro que deseas eliminar esta pregunta profunda?')) return;
        try {
            const res = await fetchConToken(`/reclutamiento/preguntas/${idPregunta}/`, { method: 'DELETE' });
            if (res.ok) {
                setPreguntasProfunda(prev => prev.filter(p => p.id !== idPregunta));
                alert("Pregunta eliminada correctamente.");
            }
        } catch (error) { console.error(error); }
    };

    const tabs = [
        { id: 'inicial', label: 'Entrevista Inicial' },
        { id: 'profunda', label: 'Entrevista Profunda' }
    ];

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", color: '#334155', maxWidth: '1000px', margin: '0 auto' }}>
            {/* Encabezado */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Settings size={28} color="#96C2DB" /> Configuración de Preguntas
                    </h2>
                    <p style={{ color: '#64748B' }}>Administra el banco de preguntas para los filtros y evaluaciones.</p>
                </div>
                {tabActiva === 'profunda' && (
                    <button
                        onClick={() => alert(`Abriremos Modal para crear nueva pregunta profunda.`)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#334155', color: '#FFF', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
                    >
                        <Plus size={18} /> Nueva Pregunta
                    </button>
                )}
            </div>

            {/* Pestañas */}
            <div style={{ display: 'flex', borderBottom: '2px solid #E5EDF1', marginBottom: '24px' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setTabActiva(tab.id)}
                        style={{ padding: '12px 24px', backgroundColor: 'transparent', border: 'none', borderBottom: tabActiva === tab.id ? '3px solid #96C2DB' : '3px solid transparent', color: tabActiva === tab.id ? '#334155' : '#94A3B8', fontWeight: tabActiva === tab.id ? '700' : '500', cursor: 'pointer', fontSize: '15px', transition: 'all 0.2s' }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Contenido principal */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>

                {tabActiva === 'profunda' && (
                    <div style={{ padding: '16px 24px', backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <strong style={{ fontSize: '14px' }}>Filtrar por Categoría de Puesto:</strong>
                        <select
                            value={categoriaSeleccionada}
                            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', outline: 'none', minWidth: '300px' }}
                        >
                            {categorias.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                            ))}
                        </select>
                    </div>
                )}

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: '#F1F5F9', fontSize: '13px', color: '#64748B', textTransform: 'uppercase' }}>
                        <tr>
                            <th style={{ padding: '16px 24px', fontWeight: '700', width: '25%' }}>Rubro</th>
                            <th style={{ padding: '16px 24px', fontWeight: '700', width: '55%' }}>Pregunta Formulada</th>
                            <th style={{ padding: '16px 24px', fontWeight: '700', textAlign: 'right', width: '20%' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>

                        {/* --- LÓGICA DE PREGUNTAS INICIALES --- */}
                        {tabActiva === 'inicial' && cargando && (
                            <tr><td colSpan="3" style={{ padding: '24px', textAlign: 'center', color: '#64748B' }}>Cargando desde la base de datos...</td></tr>
                        )}
                        {tabActiva === 'inicial' && !cargando && preguntasInicial.length === 0 && (
                            <tr><td colSpan="3" style={{ padding: '24px', textAlign: 'center', color: '#64748B' }}>No hay preguntas iniciales. Ve al Admin de Django a agregarlas.</td></tr>
                        )}
                        {tabActiva === 'inicial' && !cargando && preguntasInicial.map((p) => (
                            <tr key={p.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                <td style={{ padding: '16px 24px', fontWeight: '600' }}>{p.rubro}</td>
                                <td style={{ padding: '16px 24px', color: '#64748B' }}>
                                    {editandoId === p.id ? (
                                        <input
                                            type="text"
                                            value={textoEditado}
                                            onChange={(e) => setTextoEditado(e.target.value)}
                                            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1' }}
                                        />
                                    ) : (p.pregunta)}
                                </td>
                                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                    {editandoId === p.id ? (
                                        <button onClick={() => guardarEdicionInicial(p.id)} style={{ background: 'none', border: 'none', color: '#22C55E', cursor: 'pointer' }}>
                                            <Save size={18} />
                                        </button>
                                    ) : (
                                        <button onClick={() => { setEditandoId(p.id); setTextoEditado(p.pregunta); }} style={{ background: 'none', border: 'none', color: '#96C2DB', cursor: 'pointer' }}>
                                            <Edit2 size={18} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}

                        {/* --- LÓGICA DE PREGUNTAS PROFUNDAS --- */}
                        {tabActiva === 'profunda' && cargando && (
                            <tr><td colSpan="3" style={{ padding: '24px', textAlign: 'center', color: '#64748B' }}>Cargando preguntas de la base de datos...</td></tr>
                        )}
                        {tabActiva === 'profunda' && !cargando && preguntasProfunda.length === 0 && (
                            <tr><td colSpan="3" style={{ padding: '24px', textAlign: 'center', color: '#64748B' }}>No hay preguntas registradas para esta categoría.</td></tr>
                        )}
                        {tabActiva === 'profunda' && !cargando && preguntasProfunda.map((p) => (
                            <tr key={p.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background-color 0.2s' }}>
                                <td style={{ padding: '16px 24px', fontWeight: '600' }}>{p.rubro}</td>
                                <td style={{ padding: '16px 24px', color: '#64748B' }}>
                                    {editandoIdProfunda === p.id ? (
                                        <input
                                            type="text"
                                            value={textoEditadoProfunda}
                                            onChange={(e) => setTextoEditadoProfunda(e.target.value)}
                                            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1' }}
                                        />
                                    ) : (p.pregunta)}
                                </td>
                                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                    {editandoIdProfunda === p.id ? (
                                        <button onClick={() => guardarEdicionProfunda(p.id)} style={{ background: 'none', border: 'none', color: '#22C55E', cursor: 'pointer', marginRight: '16px' }}>
                                            <Save size={18} />
                                        </button>
                                    ) : (
                                        <button onClick={() => { setEditandoIdProfunda(p.id); setTextoEditadoProfunda(p.pregunta); }} style={{ background: 'none', border: 'none', color: '#96C2DB', cursor: 'pointer', marginRight: '16px' }}>
                                            <Edit2 size={18} />
                                        </button>
                                    )}
                                    <button onClick={() => handleEliminarProfunda(p.id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VistaPreguntas;
