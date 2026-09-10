import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Archive, FileSpreadsheet, ChevronDown, CheckCircle,
  LayoutTemplate, Menu, X, LogOut
} from 'lucide-react';
import GestorMembretadas from '../../components/cotizador/GestorMembretadas';
import FormularioPreFactura from '../../components/cotizador/FormularioPreFactura';
import BandejaAprobacion from '../../components/cotizador/BandejaAprobacion';
import BandejaCotizaciones from '../../components/cotizador/BandejaCotizaciones';
import { AuthContext } from '../../context/AuthContext';

export default function ModuloCotizador() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { usuario, logout } = useContext(AuthContext);

  const nombreUsuario = usuario?.first_name || usuario?.username || 'Usuario';
  const rolUsuario = usuario?.rol === 'admin' ? 'Administrador' : (usuario?.rol === 'super_admin' ? 'Super Admin' : 'Usuario P&M');
  const inicial = (usuario?.first_name ? usuario.first_name[0] : usuario?.username ? usuario.username[0] : 'U').toUpperCase();

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem('cotizador_active_tab');
    return (saved && saved !== 'generar') ? saved : 'bandeja_cotizaciones';
  });

  const cambiarTab = (tab) => {
    setActiveTab(tab);
    localStorage.setItem('cotizador_active_tab', tab);
    setIsMobileMenuOpen(false);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [empresas, setEmpresas] = useState([]);
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    fetchEmpresasYClientes();
  }, []);

  const fetchEmpresasYClientes = async () => {
    try {
      const resEmpresas = await fetch(`http://${window.location.hostname}:8000/api/cotizador/empresas-emisoras/`);
      if (resEmpresas.ok) {
        const dataEmpresas = await resEmpresas.json();
        setEmpresas(Array.isArray(dataEmpresas) ? dataEmpresas : []);
      }

      const resClientes = await fetch(`http://${window.location.hostname}:8000/api/cotizador/clientes/`);
      if (resClientes.ok) {
        const dataClientes = await resClientes.json();
        setClientes(Array.isArray(dataClientes) ? dataClientes : []);
      }
    } catch (e) {
      console.error("Error cargando catalogos:", e);
    }
  };

  return (
    <div className="cotizador-app-container" style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#F8FAFC', overflow: 'hidden' }}>

      {/* --- HEADER MOVIL --- */}
      <div className="cotizador-mobile-header" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '0 16px', zIndex: 30 }}>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{ background: 'none', border: 'none', color: '#1C1335', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <Menu size={24} />
        </button>
        <div style={{ fontWeight: '700', fontSize: '17px', color: '#1C1335', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: "'Outfit', sans-serif" }}>
          {activeTab === 'bandeja_cotizaciones' ? 'Cotizaciones' : activeTab === 'llenado_web' ? 'Prefactura' : activeTab === 'bandeja_aprovación' ? 'Aprobacion' : 'Membretadas'}
        </div>
        <button
          onClick={() => navigate(-1)}
          style={{ background: '#F3E8FF', border: 'none', width: '36px', height: '36px', borderRadius: '50%', color: '#9333EA', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ArrowLeft size={18} />
        </button>
      </div>

      {/* --- MENU DRAWER MOVIL --- */}
      {isMobileMenuOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex' }}>
          <div style={{ width: '280px', backgroundColor: '#1C1335', height: '100%', padding: '24px 16px', display: 'flex', flexDirection: 'column', animation: 'slideInLeft 0.3s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', padding: '0 8px' }}>
              <span style={{ color: '#C084FC', fontWeight: '800', fontSize: '18px', fontFamily: "'Outfit', sans-serif" }}>Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} style={{ background: 'none', border: 'none', color: '#D8B4FE', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
              <button onClick={() => cambiarTab('bandeja_cotizaciones')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '12px', backgroundColor: activeTab === 'bandeja_cotizaciones' ? '#C084FC' : 'transparent', color: activeTab === 'bandeja_cotizaciones' ? '#1C1335' : '#FFFFFF', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '15px' }}>
                <Archive size={20} /> Cotizaciones
              </button>
              <button onClick={() => cambiarTab('llenado_web')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '12px', backgroundColor: activeTab === 'llenado_web' ? '#C084FC' : 'transparent', color: activeTab === 'llenado_web' ? '#1C1335' : '#FFFFFF', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '15px' }}>
                <FileSpreadsheet size={20} /> Prefactura
              </button>
              <button onClick={() => cambiarTab('bandeja_aprovación')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '12px', backgroundColor: activeTab === 'bandeja_aprovación' ? '#C084FC' : 'transparent', color: activeTab === 'bandeja_aprovación' ? '#1C1335' : '#FFFFFF', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '15px' }}>
                <CheckCircle size={20} /> Bandeja de Aprobacion
              </button>
              <button onClick={() => cambiarTab('membretadas')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '12px', backgroundColor: activeTab === 'membretadas' ? '#C084FC' : 'transparent', color: activeTab === 'membretadas' ? '#1C1335' : '#FFFFFF', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '15px' }}>
                <LayoutTemplate size={20} /> Hojas Membretadas
              </button>
            </nav>
            <button onClick={() => { setIsMobileMenuOpen(false); navigate(-1); }} style={{ background: 'rgba(192,132,252,0.15)', border: '1px solid rgba(192,132,252,0.3)', color: '#D8B4FE', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', padding: '14px', borderRadius: '12px', marginTop: 'auto' }}>
              <ArrowLeft size={18} /> Volver al Sistema
            </button>
          </div>
        </div>
      )}

      {/* --- SIDEBAR DE ESCRITORIO --- */}
      <div className={`cotizador-desktop-sidebar ${!isSidebarOpen ? 'sidebar-collapsed' : ''}`} style={{ width: isSidebarOpen ? '280px' : '90px', backgroundColor: '#1C1335', color: '#FFFFFF', display: 'flex', flexDirection: 'column', padding: '24px 16px', boxShadow: '4px 0 24px rgba(28,19,53,0.15)', zIndex: 10, transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          {isSidebarOpen && <p style={{ color: '#C084FC', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', padding: '0 8px', fontFamily: "'Outfit', sans-serif" }}>Menu Principal</p>}

          <button className="sidebar-btn" data-tooltip="Cotizaciones" onClick={() => cambiarTab('bandeja_cotizaciones')} style={{ display: 'flex', alignItems: 'center', justifyContent: isSidebarOpen ? 'flex-start' : 'center', gap: '12px', padding: '14px', borderRadius: '12px', backgroundColor: activeTab === 'bandeja_cotizaciones' ? '#C084FC' : 'transparent', color: activeTab === 'bandeja_cotizaciones' ? '#1C1335' : '#D8B4FE', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '15px', transition: 'all 0.2s', whiteSpace: 'nowrap' }} onMouseEnter={(e) => { if (activeTab !== 'bandeja_cotizaciones') e.currentTarget.style.backgroundColor = 'rgba(192,132,252,0.15)'; }} onMouseLeave={(e) => { if (activeTab !== 'bandeja_cotizaciones') e.currentTarget.style.backgroundColor = 'transparent'; }}>
            <Archive size={20} style={{ minWidth: '20px' }} />
            {isSidebarOpen && <span>Cotizaciones</span>}
          </button>

          <button className="sidebar-btn" data-tooltip="Prefactura Web" onClick={() => cambiarTab('llenado_web')} style={{ display: 'flex', alignItems: 'center', justifyContent: isSidebarOpen ? 'flex-start' : 'center', gap: '12px', padding: '14px', borderRadius: '12px', backgroundColor: activeTab === 'llenado_web' ? '#C084FC' : 'transparent', color: activeTab === 'llenado_web' ? '#1C1335' : '#D8B4FE', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '15px', transition: 'all 0.2s', whiteSpace: 'nowrap' }} onMouseEnter={(e) => { if (activeTab !== 'llenado_web') e.currentTarget.style.backgroundColor = 'rgba(192,132,252,0.15)'; }} onMouseLeave={(e) => { if (activeTab !== 'llenado_web') e.currentTarget.style.backgroundColor = 'transparent'; }}>
            <FileSpreadsheet size={20} style={{ minWidth: '20px' }} />
            {isSidebarOpen && <span>Prefactura</span>}
          </button>

          <button className="sidebar-btn" data-tooltip="Bandeja de Aprobación" onClick={() => cambiarTab('bandeja_aprovación')} style={{ display: 'flex', alignItems: 'center', justifyContent: isSidebarOpen ? 'flex-start' : 'center', gap: '12px', padding: '14px', borderRadius: '12px', backgroundColor: activeTab === 'bandeja_aprovación' ? '#C084FC' : 'transparent', color: activeTab === 'bandeja_aprovación' ? '#1C1335' : '#D8B4FE', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '15px', transition: 'all 0.2s', whiteSpace: 'nowrap' }} onMouseEnter={(e) => { if (activeTab !== 'bandeja_aprovación') e.currentTarget.style.backgroundColor = 'rgba(192,132,252,0.15)'; }} onMouseLeave={(e) => { if (activeTab !== 'bandeja_aprovación') e.currentTarget.style.backgroundColor = 'transparent'; }}>
            <CheckCircle size={20} style={{ minWidth: '20px' }} />
            {isSidebarOpen && <span>Bandeja de Aprobacion</span>}
          </button>

          <button className="sidebar-btn" data-tooltip="Hojas Membretadas" onClick={() => cambiarTab('membretadas')} style={{ display: 'flex', alignItems: 'center', justifyContent: isSidebarOpen ? 'flex-start' : 'center', gap: '12px', padding: '14px', borderRadius: '12px', backgroundColor: activeTab === 'membretadas' ? '#C084FC' : 'transparent', color: activeTab === 'membretadas' ? '#1C1335' : '#D8B4FE', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '15px', transition: 'all 0.2s', whiteSpace: 'nowrap' }} onMouseEnter={(e) => { if (activeTab !== 'membretadas') e.currentTarget.style.backgroundColor = 'rgba(192,132,252,0.15)'; }} onMouseLeave={(e) => { if (activeTab !== 'membretadas') e.currentTarget.style.backgroundColor = 'transparent'; }}>
            <LayoutTemplate size={20} style={{ minWidth: '20px' }} />
            {isSidebarOpen && <span>Hojas Membretadas</span>}
          </button>
        </nav>

        <button className="sidebar-btn" data-tooltip="Volver al Sistema" onClick={() => navigate(-1)} style={{ background: 'rgba(192,132,252,0.15)', border: '1px solid rgba(192,132,252,0.3)', color: '#D8B4FE', display: 'flex', alignItems: 'center', justifyContent: isSidebarOpen ? 'center' : 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', padding: isSidebarOpen ? '16px' : '16px 0', borderRadius: '12px', transition: 'all 0.2s', marginTop: 'auto', whiteSpace: 'nowrap' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(192,132,252,0.25)'; e.currentTarget.style.color = '#FFFFFF'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(192,132,252,0.15)'; e.currentTarget.style.color = '#D8B4FE'; }}>
          <ArrowLeft size={20} style={{ minWidth: '20px' }} />
          {isSidebarOpen && <span>Volver al Sistema</span>}
        </button>
      </div>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <div className="cotizador-main-content" style={{ flex: 1, overflowY: 'auto' }}>

        {/* ENCABEZADO Y PERFIL DE USUARIO */}
        <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '32px', color: '#1C1335', margin: '0 0 4px 0', fontWeight: '800', letterSpacing: '-1px', fontFamily: "'Outfit', sans-serif" }}>
              {activeTab === 'bandeja_cotizaciones' ? 'Bandeja de Cotizaciones' : activeTab === 'llenado_web' ? 'Generador de Prefactura' : activeTab === 'bandeja_aprovación' ? 'Bandeja de Aprobacion' : 'Configuracion de Plantillas'}
            </h2>

          </div>

          {/* PERFIL DE USUARIO */}
          <div style={{ position: 'relative', zIndex: 50 }}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: '#FFFFFF',
                padding: '6px 14px 6px 6px',
                borderRadius: '40px',
                border: '1px solid #E2E8F0',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#C084FC';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(192, 132, 252, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E2E8F0';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
              }}
            >
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #A855F7 0%, #7E22CE 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                fontSize: '15px',
                boxShadow: '0 2px 6px rgba(168, 85, 247, 0.4)'
              }}>
                {inicial}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#1C1335', lineHeight: '1.2' }}>
                  {nombreUsuario}
                </span>
                <span style={{ fontSize: '11px', fontWeight: '600', color: '#9333EA', lineHeight: '1.2' }}>
                  {rolUsuario}
                </span>
              </div>

              <ChevronDown size={14} color="#64748B" style={{ marginLeft: '4px', transform: showProfileMenu ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
            </button>

            {showProfileMenu && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                width: '180px',
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                border: '1px solid #F1F5F9',
                padding: '6px',
                display: 'flex',
                flexDirection: 'column',
                animation: 'slideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '10px 14px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#EF4444',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <LogOut size={18} strokeWidth={2} />
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>

        {/* PESTAÑA: BANDEJA DE COTIZACIONES */}
        {activeTab === 'bandeja_cotizaciones' && (
          <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
            <BandejaCotizaciones />
          </div>
        )}

        {/* PESTAÑA: PREFACTURA WEB */}
        {activeTab === 'llenado_web' && (
          <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
            <FormularioPreFactura empresas={empresas} clientes={clientes} />
          </div>
        )}

        {/* PESTAÑA: BANDEJA DE APROBACIÓN */}
        {activeTab === 'bandeja_aprovación' && (
          <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
            <BandejaAprobacion />
          </div>
        )}

        {/* PESTAÑA: HOJAS MEMBRETADAS */}
        {activeTab === 'membretadas' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '40px', boxShadow: '0 16px 40px -8px rgba(147, 51, 234, 0.1)', border: '1px solid #F0E6FF', animation: 'fadeIn 0.4s ease-out' }}>
            <GestorMembretadas />
          </div>
        )}

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        @keyframes spin { 100% { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }

        .cotizador-mobile-header {
          display: none;
        }

        .cotizador-main-content {
          padding: 48px 60px;
        }

        @media (max-width: 768px) {
          .cotizador-app-container {
            flex-direction: column !important;
          }

          .cotizador-desktop-sidebar {
            display: none !important;
          }

          .cotizador-mobile-header {
            display: flex !important;
            justify-content: space-between;
            align-items: center;
            height: 60px;
          }

          .cotizador-main-content {
            padding: 20px 16px !important;
          }
        }
      `}</style>
    </div>
  );
}
