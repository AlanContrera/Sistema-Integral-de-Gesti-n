import React, { useState, useEffect } from 'react';
import { fetchConToken } from '../../services/api';
import { Search, UserPlus, Mail, Phone, Briefcase } from 'lucide-react';

const VistaCandidatos = () => {
    const [candidatos, setCandidatos] = useState([]);
    const [vacantes, setVacantes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [nuevoCandidato, setNuevoCandidato] = useState({
        vacante: '', nombre_completo: '', correo: '', telefono: '', plataforma_origen: ''
    });

    useEffect(() => {
        cargarCandidatos();
        cargarVacantes();
    }, []);

    const cargarVacantes = async () => {
        try {
            const res = await fetchConToken('/reclutamiento/vacantes/');
            if (res.ok) {
                const data = await res.json();
                setVacantes(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const cargarCandidatos = async () => {
        try {
            setCargando(true);
            const res = await fetchConToken('/reclutamiento/candidatos/');
            if (!res.ok) throw new Error('Error al cargar candidatos');
            const data = await res.json();
            setCandidatos(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };

    const handleCrearCandidato = async (e) => {
        e.preventDefault();
        try {
            const res = await fetchConToken('/reclutamiento/candidatos/', {
                method: 'POST',
                body: JSON.stringify(nuevoCandidato)
            });
            if (!res.ok) throw new Error('Error al guardar el candidato');
            setMostrarModal(false);
            setNuevoCandidato({ vacante: '', nombre_completo: '', correo: '', telefono: '', zona_ubicacion: '' });
            cargarCandidatos();
        } catch (err) {
            alert(err.message);
        }
    };

    const getStatusStyle = (estatus) => {
        switch (estatus) {
            case 'nuevo': return { bg: '#DBEAFE', text: '#1E40AF' }; // Azul
            case 'en_proceso': return { bg: '#FEF9C3', text: '#854D0E' }; // Amarillo
            case 'viable': return { bg: '#DCFCE7', text: '#166534' }; // Verde
            case 'no_viable': return { bg: '#FEE2E2', text: '#991B1B' }; // Rojo
            case 'enviado_cliente': return { bg: '#F3E8FF', text: '#6B21A8' }; // Morado
            case 'seleccionado': return { bg: '#D1FAE5', text: '#047857' };
            default: return { bg: '#F1F5F9', text: '#475569' };
        }
    };

    return (
        <div>
            {/* Header de la vista */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', color: '#1E293B', fontWeight: '800', marginBottom: '4px' }}>Candidatos</h1>
                    <p style={{ color: '#64748B', fontSize: '15px' }}>Directorio general de candidatos y prospectos.</p>
                </div>
                <button
                    onClick={() => setMostrarModal(true)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        backgroundColor: '#96C2DB', color: 'white',
                        padding: '10px 20px', borderRadius: '8px',
                        border: 'none', fontWeight: '600', cursor: 'pointer',
                        boxShadow: '0 4px 6px -1px rgba(150, 194, 219, 0.2)'
                    }}
                >
                    <UserPlus size={20} />
                    Nuevo Candidato
                </button>
            </div>

            {/* Barra de búsqueda / Filtros */}
            <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', display: 'flex', gap: '16px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '16px', top: '12px', color: '#94A3B8' }} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, correo o vacante..."
                        style={{ width: '100%', padding: '10px 16px 10px 44px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '15px' }}
                    />
                </div>
                <select style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', color: '#475569', backgroundColor: 'white' }}>
                    <option value="">Todos los Estatus</option>
                    <option value="nuevo">Nuevos</option>
                    <option value="en_proceso">En Proceso</option>
                    <option value="viable">Viables</option>
                    <option value="no_viable">No Viables</option>
                    <option value="enviado_cliente">Enviados al Cliente</option>
                </select>
            </div>

            {/* Lista de Candidatos (Tabla) */}
            {cargando ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>Cargando candidatos...</div>
            ) : error ? (
                <div style={{ backgroundColor: '#FEE2E2', color: '#991B1B', padding: '16px', borderRadius: '8px' }}>{error}</div>
            ) : candidatos.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '12px', color: '#64748B' }}>
                    No hay candidatos registrados aún.
                </div>
            ) : (
                <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                            <tr>
                                <th style={{ padding: '16px', color: '#475569', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Candidato</th>
                                <th style={{ padding: '16px', color: '#475569', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Contacto</th>
                                <th style={{ padding: '16px', color: '#475569', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Vacante Aplicada</th>
                                <th style={{ padding: '16px', color: '#475569', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Estatus</th>
                                <th style={{ padding: '16px', color: '#475569', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase', textAlign: 'right' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {candidatos.map((candidato) => {
                                const statusColors = getStatusStyle(candidato.estatus);
                                return (
                                    <tr key={candidato.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ fontWeight: '700', color: '#1E293B', marginBottom: '4px' }}>{candidato.nombre_completo}</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748B', fontSize: '13px' }}>
                                                <Search size={14} /> {candidato.plataforma_origen || 'Fuente no especificada'}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontSize: '14px', marginBottom: '4px' }}>
                                                <Mail size={14} color="#94A3B8" /> {candidato.correo}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontSize: '14px' }}>
                                                <Phone size={14} color="#94A3B8" /> {candidato.telefono}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0F172A', fontWeight: '500', fontSize: '14px' }}>
                                                <Briefcase size={16} color="#96C2DB" />
                                                {/* Asumiendo que el backend envía el string del nombre de la vacante, si no, se deberá ajustar */}
                                                {typeof candidato.vacante === 'object' ? candidato.vacante.nombre_puesto : `ID Vacante: ${candidato.vacante}`}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{
                                                backgroundColor: statusColors.bg, color: statusColors.text,
                                                padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600'
                                            }}>
                                                {candidato.estatus.replace('_', ' ').toUpperCase()}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px', textAlign: 'right' }}>
                                            <button onClick={() => window.location.href = `/reclutamiento/candidato/${candidato.id}`} style={{
                                                backgroundColor: '#F8FAFC', color: '#96C2DB', border: '1px solid #E2E8F0',
                                                padding: '6px 12px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '13px'
                                            }}>
                                                Ver Perfil
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal Nuevo Candidato */}
            {mostrarModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '16px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <h2 style={{ margin: '0 0 24px 0', fontSize: '24px', color: '#1E293B' }}>Registrar Nuevo Candidato</h2>
                        <form onSubmit={handleCrearCandidato} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                            <div>
                                <label style={{ display: 'block', fontSize: '13px', color: '#64748B', fontWeight: '600', marginBottom: '6px' }}>Seleccionar Vacante *</label>
                                <select required value={nuevoCandidato.vacante} onChange={e => setNuevoCandidato({ ...nuevoCandidato, vacante: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0', boxSizing: 'border-box' }}>
                                    <option value="">-- Selecciona una vacante --</option>
                                    {vacantes.map(v => (
                                        <option key={v.id} value={v.id}>{v.nombre_puesto} - {v.cliente}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '13px', color: '#64748B', fontWeight: '600', marginBottom: '6px' }}>Nombre Completo *</label>
                                <input required value={nuevoCandidato.nombre_completo} onChange={e => setNuevoCandidato({ ...nuevoCandidato, nombre_completo: e.target.value })} type="text" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0', boxSizing: 'border-box' }} placeholder="Ej. Juan Pérez" />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', color: '#64748B', fontWeight: '600', marginBottom: '6px' }}>Correo Electrónico *</label>
                                    <input required value={nuevoCandidato.correo} onChange={e => setNuevoCandidato({ ...nuevoCandidato, correo: e.target.value })} type="email" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0', boxSizing: 'border-box' }} placeholder="juan@ejemplo.com" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', color: '#64748B', fontWeight: '600', marginBottom: '6px' }}>Teléfono *</label>
                                    <input required value={nuevoCandidato.telefono} onChange={e => setNuevoCandidato({ ...nuevoCandidato, telefono: e.target.value })} type="tel" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0', boxSizing: 'border-box' }} placeholder="5551234567" />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '13px', color: '#64748B', fontWeight: '600', marginBottom: '6px' }}>Fuente de Reclutamiento *</label>
                                <select
                                    required
                                    value={nuevoCandidato.plataforma_origen}
                                    onChange={e => setNuevoCandidato({ ...nuevoCandidato, plataforma_origen: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0', boxSizing: 'border-box', backgroundColor: 'white' }}
                                >
                                    <option value="" disabled>Selecciona la fuente...</option>
                                    <option value="LinkedIn">LinkedIn</option>
                                    <option value="OCC">OCC Mundial</option>
                                    <option value="Indeed">Indeed</option>
                                    <option value="Computrabajo">Computrabajo</option>
                                    <option value="Referido">Referido</option>
                                    <option value="Cartera Interna">Cartera Interna</option>
                                    <option value="Otro">Otro</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                                <button type="button" onClick={() => setMostrarModal(false)} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#F1F5F9', color: '#475569', fontWeight: '600', cursor: 'pointer' }}>
                                    Cancelar
                                </button>
                                <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#96C2DB', color: 'white', fontWeight: '600', cursor: 'pointer' }}>
                                    Guardar Candidato
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VistaCandidatos;
