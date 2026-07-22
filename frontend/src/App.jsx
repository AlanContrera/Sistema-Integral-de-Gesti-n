import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Landmark, Bot, Calculator, Settings } from 'lucide-react';
import ModuloPagos from './pages/ModuloPagos';
import ModuloCotizador from './pages/ModuloCotizador';
import { Toaster } from 'react-hot-toast';

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

        {/* Módulo 3: Asistente IA (PRÓXIMAMENTE) */}
        <div style={{ background: '#F1F5F9', borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px', border: '1px dashed #CBD5E1', opacity: 0.8, position: 'relative' }}>
          <div style={{ position: 'absolute', top: '24px', right: '24px', background: '#E2E8F0', color: '#64748B', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px' }}>PRÓXIMAMENTE</div>
          <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: '#CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
            <Bot size={32} />
          </div>
          <div>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '22px', color: '#475569', fontWeight: '700' }}>Asistente de Inteligencia Artificial</h2>
            <p style={{ margin: 0, color: '#94A3B8', fontSize: '15px', lineHeight: 1.5 }}>Consulta reportes, análisis y estadísticas pidiéndoselos directamente a la IA en lenguaje natural.</p>
          </div>
        </div>


        {/* Configuración (PRÓXIMAMENTE) */}
        <div style={{ background: '#F1F5F9', borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px', border: '1px dashed #CBD5E1', opacity: 0.8, position: 'relative' }}>
          <div style={{ position: 'absolute', top: '24px', right: '24px', background: '#E2E8F0', color: '#64748B', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px' }}>PRÓXIMAMENTE</div>
          <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: '#CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
            <Settings size={32} />
          </div>
          <div>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '22px', color: '#475569', fontWeight: '700' }}>Catálogos Maestros</h2>
            <p style={{ margin: 0, color: '#94A3B8', fontSize: '15px', lineHeight: 1.5 }}>Administración global de empresas, bancos, usuarios y reglas del sistema.</p>
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
        </Routes>
      </Router> </>
  );
}
