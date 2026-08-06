import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Landmark, Bot, Calculator, Settings, LogIn, Users, Briefcase } from 'lucide-react';
import ModuloPagos from './pages/pagos/ModuloPagos';
import ModuloCotizador from './pages/cotizador/ModuloCotizador';
import ModuloReclutamiento from './pages/reclutamiento/ModuloReclutamiento';
import ModuloComercial from './pages/comercial/ModuloComercial';
import RutaProtegida from './components/auth/RutaProtegida';
import { Toaster } from 'react-hot-toast';
import Login from './pages/auth/Login';

function MenuPrincipal() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: "'Inter', sans-serif" }}>

      {/* Header del Portal */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#1E293B', letterSpacing: '-1px', margin: '0 0 12px 0' }}>
          Portal Corporativo
        </h1>
        <p style={{ fontSize: '18px', color: '#64748B', margin: 0, fontWeight: '500' }}>
          Selecciona el módulo al que deseas ingresar
        </p>
      </div>

      {/* Grid de Módulos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', width: '100%', maxWidth: '1000px' }}>

        {/* Módulo 1: Gestor de Pagos (ACTIVO) */}
        <div
          onClick={() => navigate('/pagos')}
          style={{ background: '#FFFFFF', borderRadius: '24px', padding: '32px', cursor: 'pointer', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)', transition: 'transform 0.2s ease, box-shadow 0.2s ease', display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid #E2E8F0', position: 'relative', overflow: 'hidden' }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(0,0,0,0.1)' }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px -10px rgba(0,0,0,0.05)' }}
        >
          <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'linear-gradient(135deg, #0EA5E9, #2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', boxShadow: '0 8px 16px -4px rgba(37, 99, 235, 0.3)' }}>
            <Landmark size={32} />
          </div>
          <div>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '22px', color: '#0F172A', fontWeight: '700' }}>Gestor de Pagos</h2>
            <p style={{ margin: 0, color: '#64748B', fontSize: '15px', lineHeight: 1.5 }}>Administra facturas, transferencias, retornos y asimilados con validación OCR e Inteligencia Artificial.</p>
          </div>
        </div>

        {/* Módulo 2: Cotizador Dinámico (ACTIVO) */}
        <div
          onClick={() => navigate('/cotizador')}
          style={{ background: '#FFFFFF', borderRadius: '24px', padding: '32px', cursor: 'pointer', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)', transition: 'transform 0.2s ease, box-shadow 0.2s ease', display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid #E2E8F0', position: 'relative', overflow: 'hidden' }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(0,0,0,0.1)' }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px -10px rgba(0,0,0,0.05)' }}
        >
          <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'linear-gradient(135deg, #10B981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', boxShadow: '0 8px 16px -4px rgba(16, 185, 129, 0.3)' }}>
            <Calculator size={32} />
          </div>
          <div>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '22px', color: '#0F172A', fontWeight: '700' }}>Generador de Cotizaciones</h2>
            <p style={{ margin: 0, color: '#64748B', fontSize: '15px', lineHeight: 1.5 }}>Sube tu archivo Excel y genera PDFs de cotizaciones automáticas, membretadas y precisas al instante.</p>
          </div>
        </div>

        {/* Módulo 3: Reclutamiento (ACTIVO) */}
        <div
          onClick={() => navigate('/reclutamiento')}
          style={{ background: '#FFFFFF', borderRadius: '24px', padding: '32px', cursor: 'pointer', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)', transition: 'transform 0.2s ease, box-shadow 0.2s ease', display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid #E2E8F0', position: 'relative', overflow: 'hidden' }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(0,0,0,0.1)' }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px -10px rgba(0,0,0,0.05)' }}
        >
          <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'linear-gradient(135deg, #F59E0B, #D97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', boxShadow: '0 8px 16px -4px rgba(245, 158, 11, 0.3)' }}>
            <Users size={32} />
          </div>
          <div>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '22px', color: '#0F172A', fontWeight: '700' }}>Reclutamiento</h2>
            <p style={{ margin: 0, color: '#64748B', fontSize: '15px', lineHeight: 1.5 }}>Gestión integral de vacantes, candidatos y entrevistas con generación automática de reportes ejecutivos.</p>
          </div>
        </div>

        {/* Módulo 4: Comercial (ACTIVO) */}
        <div
          onClick={() => navigate('/comercial')}
          style={{ background: '#FFFFFF', borderRadius: '24px', padding: '32px', cursor: 'pointer', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)', transition: 'transform 0.2s ease, box-shadow 0.2s ease', display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid #D4DDE2', position: 'relative', overflow: 'hidden' }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(0,0,0,0.1)' }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px -10px rgba(0,0,0,0.05)' }}
        >
          <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'linear-gradient(135deg, #A2A2A2, #5C7E8F)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', boxShadow: '0 8px 16px -4px rgba(92, 126, 143, 0.3)' }}>
            <Briefcase size={32} />
          </div>
          <div>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '22px', color: '#1E293B', fontWeight: '700' }}>Comercial</h2>
            <p style={{ margin: 0, color: '#64748B', fontSize: '15px', lineHeight: 1.5 }}>Levantamiento de perfiles, gestión de prospectos y generación de propuestas comerciales en PDF.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <> <Toaster position="top-right" />
      <Router>
        <Routes>
          <Route path="/" element={<MenuPrincipal />} />
          <Route path="/pagos/*" element={<ModuloPagos />} />
          <Route path="/cotizador/*" element={<ModuloCotizador />} />
          <Route path="/reclutamiento/*" element={<RutaProtegida><ModuloReclutamiento /></RutaProtegida>} />
          <Route path="/comercial/*" element={<RutaProtegida><ModuloComercial /></RutaProtegida>} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router> </>
  );
}
