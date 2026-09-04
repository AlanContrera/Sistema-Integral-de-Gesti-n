import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import {
  Calculator,
  Landmark,
  Users,
  Briefcase,
  Settings,
  LogOut,
  ArrowRight,
  ShieldAlert,
  Layers,
  User
} from 'lucide-react';
import { AuthContext, AuthProvider } from './context/AuthContext';
import ModuloPagos from './pages/pagos/ModuloPagos';
import ModuloCotizador from './pages/cotizador/ModuloCotizador';
import ModuloReclutamiento from './pages/reclutamiento/ModuloReclutamiento';
import ModuloComercial from './pages/comercial/ModuloComercial';
import RutaProtegida from './components/auth/RutaProtegida';
import VistaUsuarios from './pages/config/VistaUsuarios';
import { Toaster } from 'react-hot-toast';
import Login from './pages/auth/Login';

function MenuPrincipal() {
  const navigate = useNavigate();
  const { usuario, cargandoAuth: cargando, logout: handleLogout } = useContext(AuthContext);

  const rol = usuario?.rol || '';
  const esAdmin = rol === 'admin' || rol === 'super_admin';

  // ----------------------------------------------------
  // CONFIGURACIÓN DE MÓDULOS (CÁPSULAS OVALADAS)
  // ----------------------------------------------------
  const modulos = [];

  // MÓDULO 1: Cotizador & Facturación (Orquídea Lilac #C084FC)
  if (esAdmin || usuario?.acceso_cotizador) {
    modulos.push({
      ruta: '/cotizador',
      titulo: 'Cotizador y Facturación',
      icon: <Calculator size={22} color="#C084FC" />,
      iconBg: 'rgba(192, 132, 252, 0.14)',
      borderGlow: 'rgba(192, 132, 252, 0.5)',
      glow: 'radial-gradient(circle at 30% 50%, rgba(192, 132, 252, 0.22) 0%, transparent 65%)',
      accentColor: '#C084FC'
    });
  }

  // MÓDULO 2: Gestión de Pagos (Índigo Eléctrico #818CF8)
  if (esAdmin || usuario?.acceso_pagos) {
    modulos.push({
      ruta: '/pagos',
      titulo: 'Gestión de Pagos',
      icon: <Landmark size={22} color="#818CF8" />,
      iconBg: 'rgba(129, 140, 248, 0.14)',
      borderGlow: 'rgba(129, 140, 248, 0.5)',
      glow: 'radial-gradient(circle at 30% 50%, rgba(129, 140, 248, 0.22) 0%, transparent 65%)',
      accentColor: '#818CF8'
    });
  }

  // MÓDULO 3: Reclutamiento y ATS (Dusty Rose #F472B6)
  if (esAdmin || usuario?.acceso_reclutamiento) {
    modulos.push({
      ruta: '/reclutamiento',
      titulo: 'Reclutamiento y ATS',
      icon: <Users size={22} color="#F472B6" />,
      iconBg: 'rgba(244, 114, 182, 0.14)',
      borderGlow: 'rgba(244, 114, 182, 0.5)',
      glow: 'radial-gradient(circle at 30% 50%, rgba(244, 114, 182, 0.22) 0%, transparent 65%)',
      accentColor: '#F472B6'
    });
  }

  // MÓDULO 4: Comercial / CRM (Cyber Jade #34D399)
  if (esAdmin || usuario?.acceso_comercial) {
    modulos.push({
      ruta: '/comercial',
      titulo: 'Módulo Comercial',
      icon: <Briefcase size={22} color="#34D399" />,
      iconBg: 'rgba(52, 211, 153, 0.14)',
      borderGlow: 'rgba(52, 211, 153, 0.45)',
      glow: 'radial-gradient(circle at 30% 50%, rgba(52, 211, 153, 0.2) 0%, transparent 65%)',
      accentColor: '#34D399'
    });
  }

  // MÓDULO 5: TI / Usuarios (Titanio Platino #E2E8F0)
  if (esAdmin) {
    modulos.push({
      ruta: '/usuarios',
      titulo: 'Administración TI',
      icon: <Settings size={22} color="#E2E8F0" />,
      iconBg: 'rgba(226, 232, 240, 0.12)',
      borderGlow: 'rgba(226, 232, 240, 0.45)',
      glow: 'radial-gradient(circle at 30% 50%, rgba(226, 232, 240, 0.18) 0%, transparent 65%)',
      accentColor: '#E2E8F0'
    });
  }

  // ----------------------------------------------------
  // REDIRECCIÓN AUTOMÁTICA (SI SOLO TIENE 1 MÓDULO)
  // ----------------------------------------------------
  useEffect(() => {
    if (!cargando && usuario && modulos.length === 1) {
      navigate(modulos[0].ruta, { replace: true });
    }
  }, [cargando, usuario, modulos, navigate]);

  if (cargando || (usuario && modulos.length === 1)) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#06040A',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#A1A1AA', fontSize: '14px', fontWeight: '600' }}>
          <Layers size={18} className="animate-spin" color="#C084FC" />
          <span>{modulos.length === 1 ? `Accediendo a ${modulos[0].titulo}...` : 'Abriendo plataforma...'}</span>
        </div>
      </div>
    );
  }

  const nombreUsuario = usuario?.first_name || usuario?.username || 'Usuario';
  const inicial = (usuario?.first_name ? usuario.first_name[0] : usuario?.username ? usuario.username[0] : 'U').toUpperCase();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#06040A',
      backgroundImage: `
        radial-gradient(circle at 50% 0%, rgba(217, 70, 239, 0.08) 0%, transparent 60%),
        radial-gradient(circle at 90% 90%, rgba(129, 140, 248, 0.05) 0%, transparent 60%),
        radial-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px)
      `,
      backgroundSize: '100% 100%, 100% 100%, 28px 28px',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      display: 'flex',
      flexDirection: 'column',
      color: '#FFFFFF'
    }}>

      {/* --- ESTILOS TIPOGRÁFICOS Y ANIMACIONES --- */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        @keyframes spin { 100% { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>

      {/* --- BARRA SUPERIOR DARK GLASS --- */}
      <header style={{
        backgroundColor: 'rgba(14, 10, 22, 0.82)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '0 32px',
        height: '68px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 30
      }}>

        {/* Identidad */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '16px',
              fontWeight: '700',
              fontFamily: "'Outfit', sans-serif",
              color: '#FFFFFF',
              letterSpacing: '-0.3px'
            }}>
              Sistema Integral
            </span>
            <span style={{
              fontSize: '10px',
              fontWeight: '700',
              color: '#F472B6',
              backgroundColor: 'rgba(244, 114, 182, 0.1)',
              border: '1px solid rgba(244, 114, 182, 0.25)',
              padding: '2px 8px',
              borderRadius: '12px',
              fontFamily: "'Outfit', sans-serif",
              letterSpacing: '0.4px'
            }}>
              CORE v2.6
            </span>
          </div>
          <span style={{ fontSize: '12px', color: '#A1A1AA', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Plataforma Corporativa
          </span>
        </div>

        {/* Perfil y Salir */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '5px 14px 5px 8px',
            borderRadius: '24px',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: esAdmin
                ? 'linear-gradient(135deg, #F472B6 0%, #C084FC 100%)'
                : 'linear-gradient(135deg, #818CF8 0%, #6366F1 100%)',
              color: '#090514',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              fontSize: '12px',
              fontFamily: "'Outfit', sans-serif",
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}>
              {inicial}
            </div>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#F4F4F5' }}>
              {nombreUsuario}
            </span>
            <span style={{
              fontSize: '10px',
              fontWeight: '700',
              color: esAdmin ? '#F472B6' : '#818CF8',
              backgroundColor: 'rgba(255,255,255,0.06)',
              padding: '2px 8px',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.08)',
              textTransform: 'uppercase',
              letterSpacing: '0.4px'
            }}>
              {esAdmin ? 'Admin' : 'Operativo'}
            </span>
          </div>

          <button
            onClick={handleLogout}
            title="Cerrar sesión"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#F87171',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              padding: '7px 14px',
              borderRadius: '20px',
              transition: 'all 0.2s ease',
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'; e.currentTarget.style.borderColor = '#EF4444'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.25)'; }}
          >
            <LogOut size={14} />
            <span>Salir</span>
          </button>
        </div>
      </header>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main style={{ flex: 1, maxWidth: '960px', width: '100%', margin: '0 auto', padding: '52px 24px' }}>

        {/* ENCABEZADO CON TIPOGRAFÍA SUTTERE */}
        <div style={{ marginBottom: '36px', textAlign: 'center' }}>
          <h1 style={{
            fontSize: '32px',
            letterSpacing: '-0.8px',
            margin: '0 0 8px 0',
            fontFamily: "'Outfit', sans-serif",
            lineHeight: 1.15
          }}>
            <span style={{
              fontWeight: '700',
              color: '#FFFFFF',
              textShadow: '0 0 25px rgba(255, 255, 255, 0.3)'
            }}>
              Portal{' '}
            </span>
            <span style={{
              fontWeight: '300',
              background: 'linear-gradient(135deg, #FBCFE8 0%, #C084FC 70%, #818CF8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Corporativo
            </span>
          </h1>

          <p style={{
            fontSize: '14px',
            color: '#A1A1AA',
            margin: 0,
            fontFamily: "'Plus Jakarta Sans', sans-serif"
          }}>
            Selecciona la aplicación a la que deseas acceder para operar.
          </p>
        </div>

        {/* GRID DE CÁPSULAS OVALADAS (FLOATING GLASS PILLS) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '16px'
        }}>
          {modulos.map((mod, index) => (
            <div
              key={index}
              onClick={() => navigate(mod.ruta)}
              className="glass-pill"
              style={{
                position: 'relative',
                height: '72px',
                borderRadius: '999px',
                backgroundColor: 'rgba(14, 10, 22, 0.78)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(255, 255, 255, 0.09)',
                cursor: 'pointer',
                overflow: 'hidden',
                boxShadow: '0 8px 24px -6px rgba(0, 0, 0, 0.65)',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 14px 0 16px',
                boxSizing: 'border-box'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.01)';
                e.currentTarget.style.borderColor = mod.borderGlow;
                e.currentTarget.style.boxShadow = `0 14px 32px -8px rgba(0, 0, 0, 0.8), 0 0 22px ${mod.borderGlow}`;
                const pillGlow = e.currentTarget.querySelector('.pill-ambient-glow');
                if (pillGlow) pillGlow.style.opacity = '1';
                const actionBtn = e.currentTarget.querySelector('.pill-arrow-btn');
                if (actionBtn) {
                  actionBtn.style.backgroundColor = '#FFFFFF';
                  actionBtn.style.color = '#090514';
                  actionBtn.style.transform = 'scale(1.06)';
                  actionBtn.style.boxShadow = '0 0 18px rgba(255, 255, 255, 0.4)';
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.09)';
                e.currentTarget.style.boxShadow = '0 8px 24px -6px rgba(0, 0, 0, 0.65)';
                const pillGlow = e.currentTarget.querySelector('.pill-ambient-glow');
                if (pillGlow) pillGlow.style.opacity = '0.5';
                const actionBtn = e.currentTarget.querySelector('.pill-arrow-btn');
                if (actionBtn) {
                  actionBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                  actionBtn.style.color = '#FFFFFF';
                  actionBtn.style.transform = 'scale(1)';
                  actionBtn.style.boxShadow = 'none';
                }
              }}
            >
              {/* Resplandor Ambiental Interior */}
              <div
                className="pill-ambient-glow"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: mod.glow,
                  opacity: 0.5,
                  pointerEvents: 'none',
                  transition: 'opacity 0.3s ease',
                  zIndex: 1
                }}
              />

              {/* Lado Izquierdo: Icono Circular + Nombre del Módulo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', zIndex: 2 }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: mod.iconBg,
                    border: `1px solid ${mod.borderGlow}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    flexShrink: 0
                  }}
                >
                  {mod.icon}
                </div>

                <h2 style={{
                  fontSize: '17px',
                  fontWeight: '700',
                  fontFamily: "'Outfit', sans-serif",
                  color: '#FFFFFF',
                  margin: 0,
                  letterSpacing: '-0.3px'
                }}>
                  {mod.titulo}
                </h2>
              </div>

              {/* Lado Derecho: Botón Circular de Acción Suttere */}
              <div
                className="pill-arrow-btn"
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                  zIndex: 2
                }}
              >
                <ArrowRight size={17} strokeWidth={2.3} />
              </div>

            </div>
          ))}

          {/* Mensaje Sin Permisos */}
          {modulos.length === 0 && (
            <div style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '40px 20px',
              backgroundColor: 'rgba(14, 10, 22, 0.75)',
              borderRadius: '999px',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <ShieldAlert size={28} color="#A1A1AA" style={{ margin: '0 auto 10px auto' }} />
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#FFFFFF', margin: '0 0 4px 0', fontFamily: "'Outfit', sans-serif" }}>
                Sin plataformas asignadas
              </h3>
              <p style={{ color: '#A1A1AA', fontSize: '13px', margin: 0 }}>
                Comunícate con el departamento de TI para activar tus permisos.
              </p>
            </div>
          )}
        </div>

      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        padding: '20px 32px',
        textAlign: 'center',
        fontSize: '12px',
        color: '#71717A',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}>
        © 2026. Todos los derechos reservados.
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<RutaProtegida><MenuPrincipal /></RutaProtegida>} />

            <Route path="/pagos/*" element={<RutaProtegida moduloRequerido="acceso_pagos"><ModuloPagos /></RutaProtegida>} />
            <Route path="/cotizador/*" element={<RutaProtegida moduloRequerido="acceso_cotizador"><ModuloCotizador /></RutaProtegida>} />
            <Route path="/reclutamiento/*" element={<RutaProtegida moduloRequerido="acceso_reclutamiento"><ModuloReclutamiento /></RutaProtegida>} />
            <Route path="/comercial/*" element={<RutaProtegida moduloRequerido="acceso_comercial"><ModuloComercial /></RutaProtegida>} />

            <Route path="/usuarios" element={<RutaProtegida><VistaUsuarios /></RutaProtegida>} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}
