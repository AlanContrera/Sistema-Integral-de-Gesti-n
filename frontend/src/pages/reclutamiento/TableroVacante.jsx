import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchConToken } from '../services/api';
import { ArrowLeft, Users, ClipboardList, Plus, User, CheckCircle, Clock, XCircle, FileText, Send } from 'lucide-react';
import FormularioPerfilador from '../components/FormularioPerfilador';

const TableroVacante = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [vacante, setVacante] = useState(null);
    const [candidatos, setCandidatos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [tabActiva, setTabActiva] = useState('tablero');

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
            cargarDatos();
        } catch (err) {
            alert(err.message);
        }
    };

    // Función auxiliar para renderizar los Badges de Estatus
    // (TableroVacante.jsx - Reemplaza la función renderBadgeEstatus)
    const renderBadgeEstatus = (estatus) => {
        const config = {
            'nuevo': { color: '#3B82F6', bg: '#DBEAFE', text: 'Nuevo Prospecto', icon: <User size={14} /> },
            'en_proceso': { color: '#EAB308', bg: '#FEF9C3', text: 'Filtro Inicial Aprobado', icon: <Clock size={14} /> },
            'viable': { color: '#22C55E', bg: '#DCFCE7', text: 'Profunda Concluida (Viable)', icon: <CheckCircle size={14} /> },
            'enviado_cliente': { color: '#A855F7', bg: '#F3E8FF', text: 'Presentado al Cliente', icon: <Send size={14} /> },
            'no_viable': { color: '#EF4444', bg: '#FEE2E2', text: 'Descartado', icon: <XCircle size={14} /> }
        };
        const c = config[estatus] || config['nuevo'];
        return (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: c.bg, color: c.color, padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                {c.icon} {c.text}
            </span>
        );
    };


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
                    <Users size={18} /> Gestión de Candidatos (ATS)
                </div>
                <div style={navStyle(tabActiva === 'perfilador')} onClick={() => setTabActiva('perfilador')}>
                    <ClipboardList size={18} /> Consultar / Editar Perfilador
                </div>
            </div>

            {tabActiva === 'tablero' && (
                <div style={{ backgroundColor: '#FFF', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                                <th style={{ padding: '16px', color: '#64748B', fontSize: '13px', fontWeight: 'bold' }}>CANDIDATO</th>
                                <th style={{ padding: '16px', color: '#64748B', fontSize: '13px', fontWeight: 'bold' }}>ESTATUS GLOBAL</th>
                                <th style={{ padding: '16px', color: '#64748B', fontSize: '13px', fontWeight: 'bold' }}>ZONA/UBICACIÓN</th>
                                <th style={{ padding: '16px', color: '#64748B', fontSize: '13px', fontWeight: 'bold', textAlign: 'right' }}>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {candidatos.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>No hay candidatos registrados en esta vacante.</td>
                                </tr>
                            ) : (
                                candidatos.map((cand) => (
                                    <tr key={cand.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ fontWeight: 'bold', color: '#0F172A', fontSize: '15px' }}>{cand.nombre_completo}</div>
                                            <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>{cand.correo} • {cand.telefono}</div>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            {renderBadgeEstatus(cand.estatus)}
                                        </td>
                                        <td style={{ padding: '16px', color: '#475569', fontSize: '14px' }}>
                                            {cand.zona_ubicacion}
                                        </td>
                                        <td style={{ padding: '16px', textAlign: 'right' }}>
                                            <button
                                                onClick={() => navigate(`/reclutamiento/candidato/${cand.id}`)}
                                                style={{ padding: '8px 16px', backgroundColor: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: '6px', color: '#0F172A', fontSize: '13px', cursor: 'pointer', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                            >
                                                <FileText size={16} /> Evaluar / Expediente
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {tabActiva === 'perfilador' && (
                <FormularioPerfilador vacanteId={id} onClose={() => setTabActiva('tablero')} onGuardado={() => { setTabActiva('tablero'); cargarDatos(); }} />
            )}

            {/* Modal Agregar Candidato */}
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
