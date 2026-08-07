import React, { useState, useEffect } from 'react';
import { fetchConToken } from '../../services/api';
import { Plus, Search, MapPin, DollarSign, Briefcase, ChevronLeft, UserCheck, UserCircle } from 'lucide-react';
import FormularioPerfilador from '../../components/reclutamiento/FormularioPerfilador';

const VistaVacantes = () => {
    const [vacantes, setVacantes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);

    // Filtros
    const [filtroBusqueda, setFiltroBusqueda] = useState('');
    const [filtroEstatus, setFiltroEstatus] = useState('activa'); // '' = mostrar abiertas por defecto

    const [nuevaVacante, setNuevaVacante] = useState({
        cliente: '', nombre_puesto: '', sueldo_ofertado: '',
        modalidad: 'presencial', experiencia_minima: '', escolaridad_requerida: ''
    });

    useEffect(() => {
        cargarVacantes();
    }, []);

    const cargarVacantes = async () => {
        try {
            setCargando(true);
            const res = await fetchConToken('/reclutamiento/vacantes/');
            if (!res.ok) throw new Error('Error al cargar vacantes');
            const data = await res.json();
            setVacantes(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };

    const handleCrearVacante = async (e) => {
        e.preventDefault();
        try {
            const res = await fetchConToken('/reclutamiento/vacantes/', {
                method: 'POST',
                body: JSON.stringify(nuevaVacante)
            });
            if (!res.ok) throw new Error('Error al guardar la vacante');
            setMostrarModal(false);
            setNuevaVacante({ cliente: '', nombre_puesto: '', sueldo_ofertado: '', modalidad: 'presencial', experiencia_minima: '', escolaridad_requerida: '' });
            cargarVacantes(); // Recargar la lista
        } catch (err) {
            alert(err.message);
        }
    };

    const getStatusColor = (estatus) => {
        switch (estatus) {
            case 'activa': return { bg: '#DCFCE7', text: '#166534' }; // Verde
            case 'borrador': return { bg: '#FEF9C3', text: '#854D0E' }; // Amarillo
            case 'cerrada': return { bg: '#F1F5F9', text: '#475569' }; // Gris
            case 'cancelada': return { bg: '#FEE2E2', text: '#991B1B' }; // Rojo
            default: return { bg: '#F1F5F9', text: '#475569' };
        }
    };

    return (
        <div>
            {!mostrarModal ? (
                <>
                    {/* Header de la vista */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <div>
                            <h1 style={{ fontSize: '28px', color: '#1E293B', fontWeight: '800', marginBottom: '4px' }}>Vacantes</h1>
                            <p style={{ color: '#64748B', fontSize: '15px' }}>Gestiona las vacantes y crea nuevos levantamientos.</p>
                        </div>
                        <button
                            onClick={() => setMostrarModal(true)}
                            style={{ backgroundColor: '#5C7E8F', color: '#FFFFFF', border: 'none', padding: '10px 20px', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px -1px rgba(92, 126, 143, 0.2)', transition: 'all 0.2s' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#496777'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#5C7E8F'}
                        >
                            <Plus size={18} />
                            Nuevo Levantamiento
                        </button>
                    </div>

                    {/* Barra de búsqueda / Filtros */}
                    <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', display: 'flex', gap: '16px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: '16px', top: '12px', color: '#94A3B8' }} />
                            <input
                                type="text"
                                placeholder="Buscar por puesto o cliente..."
                                value={filtroBusqueda}
                                onChange={(e) => setFiltroBusqueda(e.target.value)}
                                style={{ width: '100%', padding: '10px 16px 10px 44px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '15px' }}
                            />
                        </div>
                        <select
                            value={filtroEstatus}
                            onChange={(e) => setFiltroEstatus(e.target.value)}
                            style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', color: '#475569', backgroundColor: 'white' }}
                        >
                            <option value="activa">Activas</option>
                            <option value="cerrada">Cerradas</option>
                            <option value="cancelada">Canceladas</option>
                            <option value="todas">Todas</option>
                        </select>
                    </div>

                    {/* Grid de Vacantes */}
                    {cargando ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>Cargando vacantes...</div>
                    ) : error ? (
                        <div style={{ backgroundColor: '#FEE2E2', color: '#991B1B', padding: '16px', borderRadius: '8px' }}>{error}</div>
                    ) : vacantes.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '12px', color: '#64748B' }}>
                            No hay vacantes registradas aún en el sistema.
                        </div>
                    ) : (() => {
                        const vacantesFiltradas = vacantes.filter(v => {
                            // 1. Filtro por estatus
                            let cumpleEstatus = true;
                            if (filtroEstatus === 'todas') {
                                // Por defecto: ocultar cerradas y canceladas
                                cumpleEstatus = true;
                            }
                            else {
                                cumpleEstatus = v.estatus === filtroEstatus;
                            }

                            // 2. Filtro de búsqueda por texto
                            let cumpleBusqueda = true;
                            if (filtroBusqueda.trim() !== '') {
                                const q = filtroBusqueda.toLowerCase();
                                const puesto = (v.nombre_puesto || v.puesto_nombre || '').toLowerCase();
                                const cliente = (v.cliente || '').toLowerCase();
                                cumpleBusqueda = puesto.includes(q) || cliente.includes(q);
                            }

                            return cumpleEstatus && cumpleBusqueda;
                        });

                        if (vacantesFiltradas.length === 0) {
                            return (
                                <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '12px', color: '#64748B' }}>
                                    No hay vacantes que coincidan con tu búsqueda.
                                </div>
                            );
                        }

                        return (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                                {vacantesFiltradas.map((vacante) => {
                                    const statusColors = getStatusColor(vacante.estatus);
                                    return (
                                        <div key={vacante.id} style={{
                                            backgroundColor: 'white', borderRadius: '12px', padding: '20px',
                                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
                                            border: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                                <div>
                                                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1E293B' }}>{vacante.nombre_puesto}</h3>
                                                    <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#64748B', fontWeight: '500' }}>{vacante.cliente}</p>
                                                </div>
                                                <span style={{
                                                    backgroundColor: statusColors.bg, color: statusColors.text,
                                                    padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', textTransform: 'capitalize'
                                                }}>
                                                    {vacante.estatus}
                                                </span>
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '14px' }}>
                                                    <UserCircle size={16} color="#94A3B8" />
                                                    <span>Reclutador: {vacante.consultor_nombre || 'Desconocido'}</span>
                                                </div>
                                            </div>

                                            <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'flex-end' }}>
                                                <button
                                                    onClick={() => window.location.href = `/reclutamiento/vacantes/${vacante.id}`}
                                                    style={{ backgroundColor: 'transparent', color: '#96C2DB', border: 'none', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>
                                                    Ver Detalles &rarr;
                                                </button>

                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })()}

                </>
            ) : (
                <div style={{ animation: 'fadeIn 0.3s' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <button
                            onClick={() => setMostrarModal(false)}
                            style={{
                                backgroundColor: 'transparent',
                                border: 'none',
                                color: '#96C2DB',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                cursor: 'pointer',
                                fontWeight: '500',
                                fontSize: '17px',
                                padding: '8px 0',
                                transition: 'opacity 0.2s ease',
                                marginLeft: '-8px'
                            }}
                            onMouseOver={e => e.currentTarget.style.opacity = '0.7'}
                            onMouseOut={e => e.currentTarget.style.opacity = '1'}
                        >
                            <ChevronLeft size={28} style={{ marginBottom: '1px' }} />
                            <span>Volver a Vacantes</span>
                        </button>

                    </div>
                    <FormularioPerfilador
                        onClose={() => setMostrarModal(false)}
                        onGuardado={() => {
                            setMostrarModal(false);
                            cargarVacantes();
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default VistaVacantes;
