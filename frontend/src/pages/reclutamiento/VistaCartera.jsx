import React, { useState, useEffect } from 'react';
import { Search, Archive, ArrowRight, UserCircle, Phone, Mail, MapPin, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchConToken } from '../../services/api';


const VistaCartera = () => {
    const [candidatos, setCandidatos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [busqueda, setBusqueda] = useState('');

    useEffect(() => {
        cargarCartera();
    }, []);

    const cargarCartera = async () => {
        try {
            const res = await fetchConToken('/reclutamiento/candidatos/?estatus=cartera');
            if (res.ok) {
                const data = await res.json();
                setCandidatos(data);
            }
        } catch (error) {
            console.error('Error al cargar la cartera:', error);
        } finally {
            setCargando(false);
        }
    };

    const candidatosFiltrados = candidatos.filter(c =>
        c.nombre_completo.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.vacante_nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.zona_ubicacion?.toLowerCase().includes(busqueda.toLowerCase())
    );

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>

            {/* ENCABEZADO PREMIUM */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#1E293B', margin: 0, letterSpacing: '-0.5px' }}>
                        Cartera de Prospectos
                    </h1>
                    <p style={{ color: '#64748B', fontSize: '15px', marginTop: '8px', marginBottom: 0 }}>
                        Candidatos que no fueron seleccionados previamente y están disponibles para nuevas oportunidades.
                    </p>
                </div>
            </div>

            {/* BARRA DE HERRAMIENTAS */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', backgroundColor: '#FFF', padding: '16px 20px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03), 0 2px 4px -2px rgba(0,0,0,0.03)', border: '1px solid #F1F5F9' }}>
                <div style={{ position: 'relative', width: '350px' }}>
                    <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, vacante original o zona..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        style={{ width: '100%', padding: '12px 16px 12px 44px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', backgroundColor: '#F8FAFC' }}
                        onFocus={(e) => e.target.style.borderColor = '#96C2DB'}
                        onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                    />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#64748B', fontWeight: '500' }}>Total en Cartera:</span>
                    <span style={{ backgroundColor: '#DBEAFE', color: '#1E40AF', padding: '4px 12px', borderRadius: '20px', fontWeight: '800', fontSize: '14px' }}>
                        {candidatosFiltrados.length}
                    </span>
                </div>
            </div>

            {/* TABLA PRINCIPAL */}
            <div style={{ backgroundColor: '#FFF', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03), 0 2px 4px -2px rgba(0,0,0,0.03)', border: '1px solid #F1F5F9', overflow: 'hidden' }}>
                {cargando ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: '#64748B' }}>
                        <Loader2 className="animate-spin" size={32} style={{ margin: '0 auto', marginBottom: '16px', color: '#96C2DB' }} />
                        <p style={{ fontWeight: '500' }}>Cargando cartera de prospectos...</p>
                    </div>
                ) : candidatosFiltrados.length === 0 ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: '#64748B' }}>
                        <Archive size={48} strokeWidth={1} style={{ margin: '0 auto', marginBottom: '16px', color: '#CBD5E1' }} />
                        <h3 style={{ margin: 0, color: '#475569', fontSize: '18px', fontWeight: '700' }}>Cartera Vacía</h3>
                        <p style={{ marginTop: '8px' }}>No hay candidatos en estatus de cartera en este momento.</p>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                                <th style={{ padding: '16px 24px', color: '#64748B', fontSize: '12px', fontWeight: '800', letterSpacing: '0.5px' }}>CANDIDATO</th>
                                <th style={{ padding: '16px 24px', color: '#64748B', fontSize: '12px', fontWeight: '800', letterSpacing: '0.5px' }}>CONTACTO Y ZONA</th>
                                <th style={{ padding: '16px 24px', color: '#64748B', fontSize: '12px', fontWeight: '800', letterSpacing: '0.5px' }}>VACANTE ORIGEN</th>
                                <th style={{ padding: '16px 24px', color: '#64748B', fontSize: '12px', fontWeight: '800', letterSpacing: '0.5px', textAlign: 'right' }}>ACCIÓN</th>
                            </tr>
                        </thead>
                        <tbody>
                            {candidatosFiltrados.map((cand, idx) => (
                                <tr key={cand.id} style={{ borderBottom: idx === candidatosFiltrados.length - 1 ? 'none' : '1px solid #F1F5F9', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                    <td style={{ padding: '20px 24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
                                                <UserCircle size={24} strokeWidth={1.5} />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '700', color: '#1E293B', fontSize: '15px' }}>{cand.nombre_completo}</div>
                                                <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>Agregado el: {formatDate(cand.fecha_registro)}</div>
                                            </div>
                                        </div>
                                    </td>

                                    <td style={{ padding: '20px 24px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#475569' }}>
                                                <Phone size={14} color="#94A3B8" /> {cand.telefono}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#475569' }}>
                                                <Mail size={14} color="#94A3B8" /> {cand.correo}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#475569' }}>
                                                <MapPin size={14} color="#94A3B8" /> {cand.zona_ubicacion || 'No especificada'}
                                            </div>
                                        </div>
                                    </td>

                                    <td style={{ padding: '20px 24px' }}>
                                        <div style={{ fontWeight: '600', color: '#334155', fontSize: '14px' }}>{cand.vacante_nombre}</div>
                                        <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>{cand.cliente_nombre}</div>
                                    </td>

                                    <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                                        <Link to={`/reclutamiento/candidato/${cand.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#FFF', color: '#0F172A', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', textDecoration: 'none', border: '1px solid #E2E8F0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F8FAFC'; e.currentTarget.style.borderColor = '#CBD5E1'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFF'; e.currentTarget.style.borderColor = '#E2E8F0'; }}>
                                            Ver Expediente <ArrowRight size={16} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default VistaCartera;
