import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Landmark, Calculator, Users, Briefcase, Settings, LogOut, ShieldAlert } from 'lucide-react';
import { useContext } from 'react';
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


  if (cargando) return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#F8FAFC' }}>
      <h2 style={{ color: '#64748B', fontFamily: 'Inter' }}>Abriendo el portal...</h2>
    </div>
  );

  // ----------------------------------------------------
  // LÓGICA DE ACCESOS POR CHECKBOX (Granular)
  // ----------------------------------------------------
  const rol = usuario?.rol || '';
  const esAdmin = rol === 'admin' || rol === 'super_admin';

  const modulos = [];

  // MÓDULO 1: Configuración TI (SOLO ADMINS)
  if (esAdmin) {
    modulos.push({
      ruta: '/usuarios', titulo: 'Gestión TI (Usuarios)', icon: <Settings size={32} />,
      desc: 'Control total del sistema, roles, altas y bajas de personal.',
      bg: 'linear-gradient(135deg, #1E293B, #0F172A)', shadow: 'rgba(15, 23, 42, 0.4)'
    });
  }

  // MÓDULO 2: Reclutamiento
  if (esAdmin || usuario?.acceso_reclutamiento) {
    modulos.push({
      ruta: '/reclutamiento', titulo: 'Reclutamiento', icon: <Users size={32} />,
      desc: 'Gestión integral de vacantes, tableros y candidatos.',
      bg: 'linear-gradient(135deg, #F59E0B, #D97706)', shadow: 'rgba(245, 158, 11, 0.3)'
    });
  }

  // MÓDULO 3: Comercial
  if (esAdmin || usuario?.acceso_comercial) {
    modulos.push({
      ruta: '/comercial', titulo: 'Comercial', icon: <Briefcase size={32} />,
      desc: 'Levantamiento de perfiles y propuestas comerciales.',
      bg: 'linear-gradient(135deg, #A2A2A2, #5C7E8F)', shadow: 'rgba(92, 126, 143, 0.3)'
    });
  }

  // MÓDULO 4: Cotizador
  if (esAdmin || usuario?.acceso_cotizador) {
    modulos.push({
      ruta: '/cotizador', titulo: 'Cotizador AI', icon: <Calculator size={32} />,
      desc: 'Sube tu archivo Excel y genera PDFs automatizados.',
      bg: 'linear-gradient(135deg, #10B981, #059669)', shadow: 'rgba(16, 185, 129, 0.3)'
    });
  }

  // MÓDULO 5: Pagos
  if (esAdmin || usuario?.acceso_pagos) {
    modulos.push({
      ruta: '/pagos', titulo: 'Gestor de Pagos', icon: <Landmark size={32} />,
      desc: 'Administra facturas, transferencias e Inteligencia Artificial OCR.',
      bg: 'linear-gradient(135deg, #0EA5E9, #2563EB)', shadow: 'rgba(37, 99, 235, 0.3)'
    });
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: "'Inter', sans-serif" }}>

      {/* HEADER DEL PORTAL */}
      <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px' }}>
        <div>
          <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#1E293B', letterSpacing: '-1px', margin: '0 0 8px 0' }}>
            Portal Corporativo
          </h1>
          <p style={{ fontSize: '18px', color: '#64748B', margin: 0, fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Bienvenido, <strong style={{ color: esAdmin ? '#7C3AED' : '#0EA5E9' }}>{usuario.first_name}</strong>
            {esAdmin && <ShieldAlert size={18} color="#7C3AED" />}
          </p>
        </div>
        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FFF', border: '1px solid #E2E8F0', padding: '10px 16px', borderRadius: '12px', color: '#EF4444', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', transition: 'all 0.2s' }}>
          <LogOut size={18} /> Salir
        </button>
      </div>

      {/* GRID DINÁMICA DE MÓDULOS (Ahora con Flexbox para evitar estiramientos) */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', width: '100%', maxWidth: '1000px', justifyContent: 'flex-start' }}>
        {modulos.map((mod, index) => (
          <div key={index} onClick={() => navigate(mod.ruta)} style={cardStyle}>
            <div style={iconStyle(mod.bg, mod.shadow)}>
              {mod.icon}
            </div>
            <div>
              <h2 style={titleStyle}>{mod.titulo}</h2>
              <p style={descStyle}>{mod.desc}</p>
            </div>
          </div>
        ))}
        {modulos.length === 0 && (
          <div style={{ width: '100%', textAlign: 'center', padding: '40px', color: '#94A3B8' }}>
            No tienes acceso a ningún módulo. Contacta a TI.
          </div>
        )}
      </div>
    </div>
  );
}

// Estilos extraídos 
const cardStyle = { width: '313px', boxSizing: 'border-box', background: '#FFFFFF', borderRadius: '24px', padding: '32px', cursor: 'pointer', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid #E2E8F0', transition: 'transform 0.2s ease, box-shadow 0.2s ease' };
const titleStyle = { margin: '0 0 8px 0', fontSize: '22px', color: '#0F172A', fontWeight: '700' };
const descStyle = { margin: 0, color: '#64748B', fontSize: '15px', lineHeight: 1.5 };
const iconStyle = (bg, shadow) => ({ width: '60px', height: '60px', borderRadius: '16px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', boxShadow: `0 8px 16px -4px ${shadow}` });


export default function App() {
  return (
    <> <Toaster position="top-right" />
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
      </Router> </>
  );
}
