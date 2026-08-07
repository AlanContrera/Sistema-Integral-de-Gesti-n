// Archivo: frontend/src/pages/reclutamiento/TableroVacante.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchConToken } from '../../services/api';
import { ArrowLeft, Users, Plus, User, CheckCircle, Clock, XCircle, FileText, Send, Target, FileSearch, Briefcase, FileSignature } from 'lucide-react';
import DocumentoPerfilador from './DocumentoReclutamiento';

const TableroVacante = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [vacante, setVacante] = useState(null);
    const [candidatos, setCandidatos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [tabActiva, setTabActiva] = useState('candidatos'); // 'candidatos' o 'perfilador'

    const [mostrarModalCandidato, setMostrarModalCandidato] = useState(false);
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

            setMostrarModalCandidato(false);
            setNuevoCandidato({ nombre_completo: '', correo: '', telefono: '', zona_ubicacion: '' });
            cargarDatos();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleCambiarEstatus = async (nuevoEstatus) => {
        try {
            const res = await fetchConToken(`/reclutamiento/vacantes/${id}/`, {
                method: 'PATCH',
                body: JSON.stringify({ estatus: nuevoEstatus })
            });
            if (res.ok) {
                // Actualizamos la vista localmente para que cambie al instante
                setVacante({ ...vacante, estatus: nuevoEstatus });
                // Aquí podríamos lanzar un toast.success('Estatus actualizado');
            } else {
                alert('Error al cambiar el estatus de la vacante');
            }
        } catch (error) {
            alert('Error de conexión al cambiar el estatus');
        }
    };


    const renderBadgeEstatus = (estatus) => {
        const config = {
            'nuevo': { color: '#3B82F6', bg: '#DBEAFE', text: 'Nuevo Prospecto', icon: <User size={14} /> },
            'en_proceso': { color: '#EAB308', bg: '#FEF9C3', text: 'Filtro Inicial', icon: <Clock size={14} /> },
            'viable': { color: '#22C55E', bg: '#DCFCE7', text: 'Profunda Viable', icon: <CheckCircle size={14} /> },
            'enviado_cliente': { color: '#A855F7', bg: '#F3E8FF', text: 'Enviado a Cliente', icon: <Send size={14} /> },
            'no_viable': { color: '#EF4444', bg: '#FEE2E2', text: 'Descartado', icon: <XCircle size={14} /> }
        };
        const c = config[estatus] || config['nuevo'];
        return (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: c.bg, color: c.color, padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                {c.icon} {c.text}
            </span>
        );
    };

    if (cargando) return <div style={{ padding: '40px', color: '#64748B', fontFamily: "'Inter', sans-serif" }}>Cargando información del Perfilador...</div>;
    if (!vacante) return <div style={{ padding: '40px', color: '#EF4444', fontFamily: "'Inter', sans-serif" }}>Vacante no encontrada.</div>;

    const navStyle = (activa) => ({
        padding: '12px 24px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px',
        color: activa ? '#1E3A8A' : '#64748B',
        borderBottom: activa ? '3px solid #1E3A8A' : '3px solid transparent',
        display: 'flex', alignItems: 'center', gap: '8px',
        transition: 'all 0.2s'
    });

    return (
        <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>

            {/* HEADER */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button onClick={() => navigate('/reclutamiento/vacantes')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: '8px', borderRadius: '50%', backgroundColor: '#F1F5F9', flexShrink: 0 }}>
                        <ArrowLeft size={24} />
                    </button>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <h1 style={{ margin: 0, fontSize: '26px', color: '#1E293B', fontWeight: '800', lineHeight: '1.2' }}>
                            {vacante.nombre_puesto || vacante.puesto_nombre || 'Sin título'}
                        </h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {/* Selector de Estatus */}
                            <span style={{ fontSize: '13px', backgroundColor: '#F8FAFC', color: '#64748B', padding: '6px 12px', borderRadius: '8px', fontWeight: '500', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Briefcase size={14} color="#94A3B8" />
                                Cliente: <strong style={{ color: '#1E293B', fontWeight: '700' }}>{vacante.cliente || 'Interno'}</strong>
                            </span>

                            <span style={{ fontSize: '13px', backgroundColor: '#F8FAFC', color: '#64748B', padding: '6px 12px', borderRadius: '8px', fontWeight: '500', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <FileSignature size={14} color='#94A3B8' />
                                Levantanmiento: <strong style={{ color: '#1E293B', fontWeight: '700' }}> {vacante.creado_por_nombre || 'Desconocido'}</strong>
                            </span>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#F8FAFC', padding: '4px 6px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                                <span style={{ fontSize: '13px', color: '#64748B', fontWeight: '600', marginLeft: '6px' }}>Estado:</span>

                                <div style={{ position: 'relative' }}>
                                    <select
                                        value={vacante.estatus}
                                        onChange={(e) => handleCambiarEstatus(e.target.value)}
                                        style={{
                                            appearance: 'none',
                                            WebkitAppearance: 'none',
                                            padding: '6px 32px 6px 16px',
                                            fontSize: '13px',
                                            fontWeight: '700',
                                            textTransform: 'uppercase',
                                            color: vacante.estatus === 'activa' ? '#166534' : vacante.estatus === 'cerrada' ? '#475569' : vacante.estatus === 'cancelada' ? '#991B1B' : '#854D0E',
                                            backgroundColor: vacante.estatus === 'activa' ? '#DCFCE7' : vacante.estatus === 'cerrada' ? '#F1F5F9' : vacante.estatus === 'cancelada' ? '#FEE2E2' : '#FEF9C3',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            outline: 'none',
                                            transition: 'all 0.2s ease',
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                        }}
                                    >
                                        <option value="activa">Activa</option>
                                        <option value="cerrada">Cerrada</option>
                                        <option value="cancelada">Cancelada</option>
                                    </select>

                                    {/* Flechita personalizada */}
                                    <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'inherit', opacity: 0.6 }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* El botón de agregar candidato solo se muestra si estamos en la pestaña de candidatos */}
                {tabActiva === 'candidatos' && (
                    <button onClick={() => setMostrarModalCandidato(true)} style={{ backgroundColor: '#96C2DB', color: '#FFF', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px -1px rgba(150, 194, 219, 0.2)', flexShrink: 0 }}>
                        <Plus size={18} /> Agregar Candidato
                    </button>
                )}
            </div>

            {/* PESTAÑAS */}
            <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', marginBottom: '24px' }}>
                <div style={navStyle(tabActiva === 'candidatos')} onClick={() => setTabActiva('candidatos')}>
                    <Users size={18} /> Candidatos
                </div>
                <div style={navStyle(tabActiva === 'perfilador')} onClick={() => setTabActiva('perfilador')}>
                    <FileSearch size={18} /> Perfilador Reclutamiento
                </div>
            </div>

            {/* CONTENIDO PESTAÑA 1: TABLA DE CANDIDATOS */}
            {tabActiva === 'candidatos' && (
                <div style={{ backgroundColor: '#FFF', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                                <th style={{ padding: '16px 24px', color: '#64748B', fontSize: '12px', fontWeight: '800', letterSpacing: '0.5px' }}>CANDIDATO</th>
                                <th style={{ padding: '16px', color: '#64748B', fontSize: '12px', fontWeight: '800', letterSpacing: '0.5px' }}>ESTATUS ACTUAL</th>
                                <th style={{ padding: '16px', color: '#64748B', fontSize: '12px', fontWeight: '800', letterSpacing: '0.5px' }}>UBICACIÓN</th>
                                <th style={{ padding: '16px 24px', color: '#64748B', fontSize: '12px', fontWeight: '800', letterSpacing: '0.5px', textAlign: 'right' }}>ACCIÓN</th>
                            </tr>
                        </thead>
                        <tbody>
                            {candidatos.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ padding: '60px 20px', textAlign: 'center' }}>
                                        <Target size={40} color="#CBD5E1" style={{ margin: '0 auto 12px auto', display: 'block' }} />
                                        <p style={{ margin: 0, color: '#64748B', fontSize: '15px', fontWeight: '500' }}>Aún no hay candidatos en esta vacante.</p>
                                    </td>
                                </tr>
                            ) : (
                                candidatos.map((cand) => (
                                    <tr key={cand.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ fontWeight: '700', color: '#0F172A', fontSize: '14px' }}>{cand.nombre_completo}</div>
                                            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>{cand.correo} • {cand.telefono}</div>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            {renderBadgeEstatus(cand.estatus)}
                                        </td>
                                        <td style={{ padding: '16px', color: '#475569', fontSize: '13px', fontWeight: '500' }}>
                                            {cand.zona_ubicacion || 'No especificada'}
                                        </td>
                                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                            <button
                                                onClick={() => navigate(`/reclutamiento/candidato/${cand.id}`)}
                                                style={{ padding: '8px 16px', backgroundColor: '#96C2DB', border: 'none', borderRadius: '6px', color: '#FFF', fontSize: '13px', cursor: 'pointer', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                            >
                                                Evaluar <ArrowLeft size={14} style={{ transform: 'rotate(180deg)' }} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* CONTENIDO PESTAÑA 2: DOCUMENTO EXCEL (HOJA 14) */}
            {tabActiva === 'perfilador' && (
                <div style={{ backgroundColor: '#FFF', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                    <DocumentoPerfilador vacante={vacante} />
                </div>
            )}

            {/* MODAL: Agregar Candidato */}
            {mostrarModalCandidato && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                    <div style={{ backgroundColor: '#FFF', padding: '32px', borderRadius: '16px', width: '400px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                        <h2 style={{ margin: '0 0 24px 0', fontSize: '20px', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800' }}>
                            <User size={24} color="#96C2DB" /> Nuevo Candidato
                        </h2>
                        <form onSubmit={handleCrearCandidato}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px', color: '#475569' }}>NOMBRE COMPLETO *</label>
                                <input required type="text" value={nuevoCandidato.nombre_completo} onChange={e => setNuevoCandidato({ ...nuevoCandidato, nombre_completo: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid #CBD5E1', borderRadius: '8px', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px', color: '#475569' }}>CORREO ELECTRÓNICO</label>
                                <input type="email" value={nuevoCandidato.correo} onChange={e => setNuevoCandidato({ ...nuevoCandidato, correo: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid #CBD5E1', borderRadius: '8px', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px', color: '#475569' }}>TELÉFONO MÓVIL</label>
                                <input type="text" value={nuevoCandidato.telefono} onChange={e => setNuevoCandidato({ ...nuevoCandidato, telefono: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid #CBD5E1', borderRadius: '8px', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ marginBottom: '32px' }}>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px', color: '#475569' }}>ZONA O UBICACIÓN</label>
                                <input type="text" placeholder="Ej. Norte, a 30 min" value={nuevoCandidato.zona_ubicacion} onChange={e => setNuevoCandidato({ ...nuevoCandidato, zona_ubicacion: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid #CBD5E1', borderRadius: '8px', boxSizing: 'border-box' }} />
                            </div>

                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => setMostrarModalCandidato(false)} style={{ padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', fontWeight: '700' }}>Cancelar</button>
                                <button type="submit" style={{ padding: '10px 24px', backgroundColor: '#96C2DB', color: '#FFF', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '800' }}>Registrar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TableroVacante;
