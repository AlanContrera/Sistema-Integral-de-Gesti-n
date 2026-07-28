import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchConToken } from '../services/api';
import { ArrowLeft, Users, ClipboardList, Plus, User } from 'lucide-react';
import FormularioPerfilador from '../components/FormularioPerfilador';

const TableroVacante = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [vacante, setVacante] = useState(null);
    const [candidatos, setCandidatos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [tabActiva, setTabActiva] = useState('tablero');

    // Estado para el modal de Nuevo Candidato
    const [mostrarModal, setMostrarModal] = useState(false);
    const [nuevoCandidato, setNuevoCandidato] = useState({
        nombre_completo: '', correo: '', telefono: '', zona_ubicacion: '',
    });

    useEffect(() => {
        cargarDatos();
    }, [id]);

    const cargarDatos = async () => {
        try {
            setCargando(true);
            const [resVac, resCand] = await Promise.all([
                fetchConToken(`/reclutamiento/vacantes/${id}/`),
                fetchConToken(`/reclutamiento/candidatos/?vacante=${id}`)
            ]);

            if (resVac.ok) setVacante(await resVac.json());
            if (resCand.ok) setCandidatos(await resCand.json());

        } catch (error) {
            console.error(error);
        } finally {
            setCargando(false);
        }
    };

    // Crear Candidato
    const handleCrearCandidato = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...nuevoCandidato, vacante: id, estatus: 'nuevo', zona_ubicacion: nuevoCandidato.zona_ubicacion || 'No especificada' };
            const res = await fetchConToken('/reclutamiento/candidatos/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error('Error al crear candidato');

            setMostrarModal(false);
            setNuevoCandidato({ nombre_completo: '', correo: '', telefono: '', zona_ubicacion: '' });
            cargarDatos(); // Recargar lista
        } catch (err) {
            alert(err.message);
        }
    };

    // Actualizar Estatus (Drag and Drop)
    const handleDrop = async (e, nuevoEstatus) => {
        e.preventDefault();
        const candidatoId = e.dataTransfer.getData('candidatoId');

        // Actualizamos estado local rápido visualmente
        setCandidatos(prev => prev.map(c => c.id === parseInt(candidatoId) ? { ...c, estatus: nuevoEstatus } : c));

        try {
            await fetchConToken(`/reclutamiento/candidatos/${candidatoId}/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estatus: nuevoEstatus })
            });
        } catch (error) {
            console.error('Error al actualizar estatus:', error);
            cargarDatos(); // Si falla, recargamos la BD real
        }
    };

    const columnas = [
        { id: 'nuevo', titulo: 'Nuevos', color: '#DBEAFE', border: '#3B82F6' },
        { id: 'en_proceso', titulo: 'Entrevistas', color: '#FEF9C3', border: '#EAB308' },
        { id: 'viable', titulo: 'Viables', color: '#DCFCE7', border: '#22C55E' },
        { id: 'enviado_cliente', titulo: 'Enviados (CTE)', color: '#F3E8FF', border: '#A855F7' },
        { id: 'no_viable', titulo: 'Descartados', color: '#FEE2E2', border: '#EF4444' }
    ];

    if (cargando) return <div style={{ padding: '40px' }}>Cargando vacante...</div>;
    if (!vacante) return <div style={{ padding: '40px' }}>Vacante no encontrada.</div>;

    const navStyle = (activa) => ({
        padding: '12px 24px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px',
        color: activa ? '#0EA5E9' : '#64748B',
        borderBottom: activa ? '3px solid #0EA5E9' : '3px solid transparent',
        display: 'flex', alignItems: 'center', gap: '8px'
    });

    return (
        <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button onClick={() => navigate('/reclutamiento/vacantes')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '24px', color: '#1E293B', fontWeight: '800' }}>{vacante.puesto_nombre || 'Vacante'}</h1>
                        <p style={{ margin: 0, color: '#64748B', fontSize: '14px' }}>Cliente: {vacante.cliente} • Sueldo: ${vacante.sueldo_ofertado}</p>
                    </div>
                </div>
                {tabActiva === 'tablero' && (
                    <button onClick={() => setMostrarModal(true)} style={{ backgroundColor: '#0EA5E9', color: '#FFF', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px -1px rgba(14, 165, 233, 0.2)' }}>
                        <Plus size={18} /> Agregar Candidato
                    </button>
                )}
            </div>

            <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', marginBottom: '24px' }}>
                <div style={navStyle(tabActiva === 'tablero')} onClick={() => setTabActiva('tablero')}>
                    <Users size={18} /> Tablero Kanban (Candidatos)
                </div>
                <div style={navStyle(tabActiva === 'perfilador')} onClick={() => setTabActiva('perfilador')}>
                    <ClipboardList size={18} /> Consultar / Editar Perfilador
                </div>
            </div>

            {tabActiva === 'tablero' && (
                <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '20px', minHeight: '600px' }}>
                    {columnas.map(col => (
                        <div
                            key={col.id}
                            onDragOver={e => e.preventDefault()}
                            onDrop={e => handleDrop(e, col.id)}
                            style={{ flex: '0 0 300px', backgroundColor: '#F8FAFC', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: `2px solid ${col.border}`, paddingBottom: '8px' }}>
                                <span style={{ fontWeight: 'bold', color: '#1E293B' }}>{col.titulo}</span>
                                <span style={{ backgroundColor: col.color, color: col.border, padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                                    {candidatos.filter(c => c.estatus === col.id).length}
                                </span>
                            </div>

                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {candidatos.filter(c => c.estatus === col.id).map(cand => (
                                    <div
                                        key={cand.id}
                                        draggable
                                        onDragStart={e => e.dataTransfer.setData('candidatoId', cand.id)}
                                        style={{ backgroundColor: '#FFF', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', cursor: 'grab', borderLeft: `4px solid ${col.border}` }}
                                    >
                                        <div style={{ fontWeight: 'bold', color: '#0F172A', marginBottom: '4px', fontSize: '15px' }}>{cand.nombre_completo}</div>
                                        <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '12px' }}>{cand.correo}</div>
                                        <button
                                            onClick={() => navigate(`/reclutamiento/candidato/${cand.id}`)}
                                            style={{ width: '100%', padding: '6px', backgroundColor: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: '4px', color: '#475569', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}
                                        >
                                            Evaluar Candidato &rarr;
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {tabActiva === 'perfilador' && (
                <FormularioPerfilador vacanteId={id} onClose={() => setTabActiva('tablero')} onGuardado={() => { setTabActiva('tablero'); cargarDatos(); }} />
            )}

            {/* Modal Agregar Candidato (Registro Rápido) */}
            {mostrarModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                    <div style={{ backgroundColor: '#FFF', padding: '32px', borderRadius: '12px', width: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <h2 style={{ margin: '0 0 24px 0', fontSize: '20px', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <User size={20} color="#0EA5E9" /> Registro Rápido
                        </h2>
                        <form onSubmit={handleCrearCandidato}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px', color: '#475569' }}>Nombre Completo *</label>
                                <input required type="text" value={nuevoCandidato.nombre_completo} onChange={e => setNuevoCandidato({ ...nuevoCandidato, nombre_completo: e.target.value })} style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '6px', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px', color: '#475569' }}>Correo Electrónico</label>
                                <input type="email" value={nuevoCandidato.correo} onChange={e => setNuevoCandidato({ ...nuevoCandidato, correo: e.target.value })} style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '6px', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px', color: '#475569' }}>Teléfono Móvil</label>
                                <input type="text" value={nuevoCandidato.telefono} onChange={e => setNuevoCandidato({ ...nuevoCandidato, telefono: e.target.value })} style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '6px', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px', color: '#475569' }}>Zona / Ubicación</label>
                                <input type="text" placeholder="Ej. Norte, a 30 min" value={nuevoCandidato.zona_ubicacion} onChange={e => setNuevoCandidato({ ...nuevoCandidato, zona_ubicacion: e.target.value })} style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '6px', boxSizing: 'border-box' }} />
                            </div>

                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => setMostrarModal(false)} style={{ padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', fontWeight: '600' }}>Cancelar</button>
                                <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#0EA5E9', color: '#FFF', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Crear Candidato</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TableroVacante;
