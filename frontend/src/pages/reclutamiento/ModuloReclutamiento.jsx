
import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Briefcase, Users, FileText, Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import VistaVacantes from './VistaVacantes';
import VistaCandidatos from './VistaCandidatos';
import FlujoCandidato from './FlujoCandidato';
import TableroVacante from './TableroVacante';
import VistaReportes from './VistaReportes';
import VistaPreguntas from './VistaPreguntas';

const ModuloReclutamiento = () => {
    const location = useLocation();
    const [sidebarAbierta, setSidebarAbierta] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
    };

    const COLOR_SIDEBAR = '#96C2DB';
    const COLOR_HOVER = '#E5EDF1';
    const COLOR_MAIN = '#FFFFFF';
    const COLOR_TEXT_ACTIVE = '#334155';

    const renderMenuItem = (path, Icon, label) => {
        const isActive = location.pathname.includes(path);
        return (
            <Link key={path} to={`/reclutamiento${path}`} style={{
                position: 'relative', display: 'flex', alignItems: 'center',
                justifyContent: sidebarAbierta ? 'flex-start' : 'center', gap: '12px',
                padding: sidebarAbierta ? '12px 24px' : '12px 0', marginLeft: sidebarAbierta ? '16px' : '12px', marginRight: sidebarAbierta ? '0' : '12px',
                textDecoration: 'none', color: isActive ? COLOR_TEXT_ACTIVE : COLOR_MAIN,
                backgroundColor: isActive ? COLOR_MAIN : 'transparent',
                borderRadius: sidebarAbierta ? '24px 0 0 24px' : '12px', fontWeight: '700', fontSize: '14px', marginBottom: '4px', transition: 'all 0.3s ease',
            }}>
                <Icon size={20} />
                {sidebarAbierta && <span style={{ whiteSpace: 'nowrap' }}>{label}</span>}

                {(isActive && sidebarAbierta) && (
                    <>
                        <svg width="24" height="24" viewBox="0 0 24 24" style={{ position: 'absolute', right: 0, top: '-24px', zIndex: 0 }}>
                            <path d="M 0 24 L 24 24 L 24 0 A 24 24 0 0 1 0 24 Z" fill={COLOR_MAIN} />
                        </svg>
                        <svg width="24" height="24" viewBox="0 0 24 24" style={{ position: 'absolute', right: 0, bottom: '-24px', zIndex: 0 }}>
                            <path d="M 0 0 L 24 0 L 24 24 A 24 24 0 0 0 0 0 Z" fill={COLOR_MAIN} />
                        </svg>
                    </>
                )}
            </Link>
        );
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: COLOR_MAIN, fontFamily: "'Inter', sans-serif" }}>

            {/* BARRA LATERAL (SIDEBAR) */}
            <div style={{ position: 'relative', width: sidebarAbierta ? '240px' : '80px', backgroundColor: COLOR_SIDEBAR, padding: '32px 0 24px 0', display: 'flex', flexDirection: 'column', borderTopRightRadius: sidebarAbierta ? '40px' : '20px', boxShadow: '4px 0 15px -3px rgba(0,0,0,0.05)', zIndex: 10, transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>

                <button
                    onClick={() => setSidebarAbierta(!sidebarAbierta)}
                    style={{ position: 'absolute', top: '40px', right: '-14px', width: '28px', height: '28px', backgroundColor: COLOR_HOVER, color: COLOR_SIDEBAR, border: `1px solid ${COLOR_MAIN}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 20, transition: 'transform 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    {sidebarAbierta ? <ChevronLeft size={16} strokeWidth={3} /> : <ChevronRight size={16} strokeWidth={3} />}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarAbierta ? 'flex-start' : 'center', gap: '12px', marginBottom: '40px', paddingLeft: sidebarAbierta ? '32px' : '0' }}>
                    <div style={{ backgroundColor: COLOR_MAIN, padding: '8px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <Users size={20} color={COLOR_SIDEBAR} strokeWidth={2.5} />
                    </div>
                    {sidebarAbierta && (
                        <h2 style={{ fontSize: '19px', fontWeight: '800', color: COLOR_MAIN, margin: 0, letterSpacing: '-0.5px' }}>RecluSystem</h2>
                    )}
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {sidebarAbierta && (
                        <div style={{ fontSize: '11px', fontWeight: '800', color: COLOR_MAIN, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', paddingLeft: '32px' }}>Menú Principal</div>
                    )}

                    {renderMenuItem('/vacantes', Briefcase, 'Gestión Vacantes')}
                    {renderMenuItem('/reportes', FileText, 'Reportes')}
                    {renderMenuItem('/preguntas', Settings, 'Banco Preguntas')}
                </nav>

                <div style={{ marginTop: 'auto', paddingLeft: sidebarAbierta ? '16px' : '12px', paddingRight: sidebarAbierta ? '0' : '12px' }}>
                    <button
                        onClick={handleLogout}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarAbierta ? 'flex-start' : 'center', gap: '12px', padding: sidebarAbierta ? '12px 24px' : '12px 0', backgroundColor: 'transparent', color: COLOR_MAIN, opacity: 0.8, border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '14px', borderRadius: sidebarAbierta ? '24px 0 0 24px' : '12px', textAlign: 'left', width: '100%', transition: 'all 0.2s' }}
                        title="Cerrar Sesión" onMouseEnter={(e) => e.currentTarget.style.opacity = 1} onMouseLeave={(e) => e.currentTarget.style.opacity = 0.8}
                    >
                        <LogOut size={20} />
                        {sidebarAbierta && <span>Cerrar Sesión</span>}
                    </button>
                </div>
            </div>

            {/* ÁREA PRINCIPAL (CONTENIDO DINÁMICO) */}
            <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
                <Routes>
                    <Route path="vacantes" element={<VistaVacantes />} />
                    <Route path="candidatos" element={<VistaCandidatos />} />
                    <Route path="candidato/:id" element={<FlujoCandidato />} />
                    <Route path="vacantes/:id" element={<TableroVacante />} />
                    <Route path="reportes" element={<VistaReportes />} />
                    <Route path="preguntas" element={<VistaPreguntas />} />

                    <Route path="*" element={
                        <div>
                            <h1 style={{ fontSize: '28px', color: '#1E293B', marginBottom: '8px', fontWeight: '800' }}>Bienvenido a Reclutamiento</h1>
                            <p style={{ color: '#64748B', fontSize: '16px' }}>Selecciona una opción del menú lateral para comenzar.</p>
                        </div>
                    } />
                </Routes>
            </div>
        </div>
    );
};

export default ModuloReclutamiento;
