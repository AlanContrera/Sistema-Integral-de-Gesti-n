import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Briefcase, Users, FileText, LogOut } from 'lucide-react'; // Íconos que ya usas
import VistaVacantes from './VistaVacantes';
import VistaCandidatos from './VistaCandidatos';
import FlujoCandidato from './FlujoCandidato';
import TableroVacante from './TableroVacante';

const ModuloReclutamiento = () => {
    const location = useLocation(); // Para saber qué menú pintar de azul (activo)

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
    };

    // Pequeña función para devolver el estilo de los botones del menú dinámicamente
    const getMenuLinkStyle = (path) => {
        const isActive = location.pathname.includes(path);
        return {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            textDecoration: 'none',
            color: isActive ? '#FFFFFF' : '#94A3B8',
            backgroundColor: isActive ? '#0EA5E9' : 'transparent',
            borderRadius: '8px',
            fontWeight: '600',
            marginBottom: '8px',
            transition: 'all 0.2s ease'
        };
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: "'Inter', sans-serif" }}>

            {/* ⬅️ BARRA LATERAL (SIDEBAR) */}
            <div style={{ width: '260px', backgroundColor: '#1E293B', padding: '24px', display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '40px', color: '#F8FAFC', letterSpacing: '1px' }}>
                    RecluSystem
                </h2>

                <nav style={{ flex: 1 }}>
                    <Link to="/reclutamiento/vacantes" style={getMenuLinkStyle('/vacantes')}>
                        <Briefcase size={20} />
                        Vacantes
                    </Link>

                    <Link to="/reclutamiento/reportes" style={getMenuLinkStyle('/reportes')}>
                        <FileText size={20} />
                        Reportes
                    </Link>
                </nav>

                <button
                    onClick={handleLogout}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: 'transparent', color: '#F87171', border: 'none', cursor: 'pointer', fontWeight: '600', borderRadius: '8px', textAlign: 'left', marginTop: 'auto' }}
                >
                    <LogOut size={20} />
                    Cerrar Sesión
                </button>
            </div>

            {/* ➡️ ÁREA PRINCIPAL (CONTENIDO DINÁMICO) */}
            <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
                <Routes>
                    {/* Aquí conectaremos la VistaVacantes en el siguiente paso */}
                    <Route path="vacantes" element={<VistaVacantes />} />
                    <Route path="candidatos" element={<VistaCandidatos />} />
                    <Route path="candidato/:id" element={<FlujoCandidato />} />
                    <Route path="vacantes/:id" element={<TableroVacante />} />

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
