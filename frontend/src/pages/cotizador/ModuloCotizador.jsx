import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UploadCloud, Archive, FileSpreadsheet, ChevronDown, CheckCircle, Loader2, Calendar, LayoutTemplate, Building2, UserPlus, Send, FileText, PieChart, Users, Menu, AlertCircle, Eye, X, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
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
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('cotizador_active_tab') || 'generar';
  });

  const cambiarTab = (tab) => {
    setActiveTab(tab);
    localStorage.setItem('cotizador_active_tab', tab);
    setIsMobileMenuOpen(false);
  };
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  const [fechaOperacion, setFechaOperacion] = useState(new Date().toISOString().split('T')[0]);

  const [analysisResult, setAnalysisResult] = useState(null);
  const [selectedEmpresa, setSelectedEmpresa] = useState('');
  const [selectedCliente, setSelectedCliente] = useState('');

  const [empresas, setEmpresas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [showNewCliente, setShowNewCliente] = useState(false);
  const [newClienteData, setNewClienteData] = useState({ empresa: '', correo: '' });

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
  }

  const handleCrearCliente = async (e) => {
    e.preventDefault();
    if (!newClienteData.empresa || !newClienteData.correo) return toast.error("Empresa y correo son obligatorios");
    try {
      const res = await fetch(`http://${window.location.hostname}:8000/api/cotizador/clientes/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClienteData)
      });
      if (res.ok) {
        const nuevo = await res.json();
        toast.success("Cliente creado en el CRM");
        setShowNewCliente(false);
        setNewClienteData({ empresa: '', correo: '' });
        await fetchEmpresasYClientes();
        setSelectedCliente(nuevo.id);
      } else {
        toast.error("Error al crear cliente. Verifica los datos.");
      }
    } catch (e) {
      toast.error("Error de conexion al crear cliente");
    }
  }

  const analyzeExcel = async (selectedFile) => {
    setLoading(true);
    const toastId = toast.loading('Analizando documento Excel...');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await fetch(`http://${window.location.hostname}:8000/api/cotizador/analizar-excel/`, {
        method: 'POST',
        body: formData
      });

      let data;
      try {
        data = await res.json();
      } catch (e) {
        throw new Error("El servidor devolvio una respuesta no valida. Revisa tu Excel.");
      }

      if (!res.ok) throw new Error(data.error || "Error al analizar Excel");

      toast.success('Documento procesado con exito', { id: toastId });
      setAnalysisResult(data);

      if (data.empresa_emisora.match && data.empresa_emisora.id) {
        setSelectedEmpresa(data.empresa_emisora.id);
      } else {
        setSelectedEmpresa('');
      }

      if (data.cliente.match && data.cliente.id) {
        setSelectedCliente(data.cliente.id);
      } else {
        setSelectedCliente('');
      }

    } catch (error) {
      toast.error(error.message, { id: toastId });
      setFile(null);
    } finally {
      setLoading(false);
    }
  }

  const handleDrag = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      analyzeExcel(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      analyzeExcel(e.target.files[0]);
    }
  };

  const validateForm = () => {
    if (!selectedEmpresa) { toast.error("Por favor, confirma o selecciona una Empresa Emisora"); return false; }
    if (!fechaOperacion) { toast.error("Selecciona una Fecha de Operacion"); return false; }
    if (!file) { toast.error("Sube un archivo Excel"); return false; }
    return true;
  }

  const generatePDFBlob = async () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('empresa_id', selectedEmpresa);
    formData.append('fecha', fechaOperacion);

    const resPdf = await fetch(`http://${window.location.hostname}:8000/api/cotizador/generar/`, {
      method: 'POST', body: formData
    });

    if (!resPdf.ok) {
      const errorData = await resPdf.json();
      throw new Error(errorData.error || "Error generando PDF de la cotizacion");
    }

    const blob = await resPdf.blob();
    const folio = resPdf.headers.get('X-Folio-Generado') || "Generada";

    return { blob, folio };
  }

  const handleUpload = async () => {
    if (!validateForm()) return;
    setLoading(true);
    const toastId = toast.loading('Generando Cotizacion PDF...');

    try {
      const { blob, folio } = await generatePDFBlob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${folio}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success('Cotizacion generada y descargada', { id: toastId });
      setAnalysisResult(null);
      setFile(null);
    } catch (error) {
      toast.error(error.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async () => {
    if (!validateForm()) return;

    const nuevaPestana = window.open('', '_blank');

    if (!nuevaPestana) {
      toast.error("Por favor, desactiva el bloqueador de ventanas emergentes para este sitio.");
      return;
    }

    nuevaPestana.document.write('<html><body style="font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #F8FAFC; color: #64748B;"><h2>Generando vista previa del PDF... Por favor espera.</h2></body></html>');

    setLoading(true);

    try {
      const { blob } = await generatePDFBlob();
      const url = window.URL.createObjectURL(blob);
      nuevaPestana.location.href = url;

    } catch (error) {
      nuevaPestana.close();
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadAndSend = async () => {
    if (!validateForm()) return;
    if (!selectedCliente) return toast.error("Por favor, confirma el Cliente Destino");

    setSendingEmail(true);
    const toastId = toast.loading('Generando y contactando al CRM...');

    try {
      const { blob, folio } = await generatePDFBlob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64data = reader.result.split(',')[1];
        const resEmail = await fetch(`http://${window.location.hostname}:8000/api/cotizador/enviar-cotizacion/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cliente_id: selectedCliente,
            empresa_id: selectedEmpresa,
            pdf_base64: base64data,
            folio: folio
          })
        });

        if (!resEmail.ok) {
          const errData = await resEmail.json();
          throw new Error(errData.error || "Error al encolar correo");
        }
        toast.success('Cotizacion enviada exitosamente por correo', { id: toastId });
        setAnalysisResult(null);
        setFile(null);
        setSendingEmail(false);
      };
    } catch (e) {
      toast.error(e.message, { id: toastId });
      setSendingEmail(false);
    }
  }

  return (
    <div className="cotizador-app-container" style={{ display: 'flex', height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0, fontFamily: "'Plus Jakarta Sans', sans-serif", backgroundColor: '#F8FAFC', zIndex: 40 }}>

      {/* --- CABECERA MOVIL --- */}
      <div className="cotizador-mobile-header">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          style={{ background: 'none', border: 'none', color: '#1C1335', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Menu size={24} />
        </button>
        <div style={{ fontWeight: '700', fontSize: '17px', color: '#1C1335', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: "'Outfit', sans-serif" }}>
          {activeTab === 'generar' ? 'Generador' : activeTab === 'llenado_web' ? 'Prefactura' : activeTab === 'bandeja_cotizaciones' ? 'Cotizaciones' : activeTab === 'bandeja_aprovación' ? 'Aprobacion' : 'Membretadas'}
        </div>
        <button
          onClick={() => navigate(-1)}
          style={{ background: '#F3E8FF', border: 'none', width: '36px', height: '36px', borderRadius: '50%', color: '#9333EA', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ArrowLeft size={18} />
        </button>
      </div>

      {/* --- MENU LATERAL MOVIL (OVERLAY) --- */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(28, 19, 53, 0.6)', backdropFilter: 'blur(6px)', zIndex: 9999, display: 'flex' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: '280px', maxWidth: '80%', height: '100%', backgroundColor: '#1C1335', color: '#FFFFFF', padding: '24px 18px', display: 'flex', flexDirection: 'column', boxShadow: '4px 0 24px rgba(0,0,0,0.3)', animation: 'slideInLeft 0.25s ease-out' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#FFFFFF', fontFamily: "'Outfit', sans-serif" }}>Cotizador</h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#C084FC' }}>Menu de Opciones</p>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', width: '34px', height: '34px', borderRadius: '50%', color: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={18} />
              </button>
            </div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
              <button onClick={() => cambiarTab('generar')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '12px', backgroundColor: activeTab === 'generar' ? '#C084FC' : 'transparent', color: activeTab === 'generar' ? '#1C1335' : '#FFFFFF', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '15px' }}>
                <FileText size={20} /> Generar Cotizacion
              </button>
              <button onClick={() => cambiarTab('membretadas')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '12px', backgroundColor: activeTab === 'membretadas' ? '#C084FC' : 'transparent', color: activeTab === 'membretadas' ? '#1C1335' : '#FFFFFF', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '15px' }}>
                <LayoutTemplate size={20} /> Hojas Membretadas
              </button>
              <button onClick={() => cambiarTab('llenado_web')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '12px', backgroundColor: activeTab === 'llenado_web' ? '#C084FC' : 'transparent', color: activeTab === 'llenado_web' ? '#1C1335' : '#FFFFFF', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '15px' }}>
                <FileSpreadsheet size={20} /> Prefactura
              </button>
              <button onClick={() => cambiarTab('bandeja_cotizaciones')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '12px', backgroundColor: activeTab === 'bandeja_cotizaciones' ? '#C084FC' : 'transparent', color: activeTab === 'bandeja_cotizaciones' ? '#1C1335' : '#FFFFFF', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '15px' }}>
                <Archive size={20} /> Cotizaciones
              </button>
              <button onClick={() => cambiarTab('bandeja_aprovación')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '12px', backgroundColor: activeTab === 'bandeja_aprovación' ? '#C084FC' : 'transparent', color: activeTab === 'bandeja_aprovación' ? '#1C1335' : '#FFFFFF', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '15px' }}>
                <CheckCircle size={20} /> Bandeja de Aprobacion
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
          <button className="sidebar-btn" data-tooltip="Generar Cotización" onClick={() => cambiarTab('generar')} style={{ display: 'flex', alignItems: 'center', justifyContent: isSidebarOpen ? 'flex-start' : 'center', gap: '12px', padding: '14px', borderRadius: '12px', backgroundColor: activeTab === 'generar' ? '#C084FC' : 'transparent', color: activeTab === 'generar' ? '#1C1335' : '#D8B4FE', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '15px', transition: 'all 0.2s', whiteSpace: 'nowrap' }} onMouseEnter={(e) => { if (activeTab !== 'generar') e.currentTarget.style.backgroundColor = 'rgba(192,132,252,0.15)'; }} onMouseLeave={(e) => { if (activeTab !== 'generar') e.currentTarget.style.backgroundColor = 'transparent'; }}>
            <FileText size={20} style={{ minWidth: '20px' }} />
            {isSidebarOpen && <span>Generar Cotizacion</span>}
          </button>
          <button className="sidebar-btn" data-tooltip="Hojas Membretadas" onClick={() => cambiarTab('membretadas')} style={{ display: 'flex', alignItems: 'center', justifyContent: isSidebarOpen ? 'flex-start' : 'center', gap: '12px', padding: '14px', borderRadius: '12px', backgroundColor: activeTab === 'membretadas' ? '#C084FC' : 'transparent', color: activeTab === 'membretadas' ? '#1C1335' : '#D8B4FE', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '15px', transition: 'all 0.2s', whiteSpace: 'nowrap' }} onMouseEnter={(e) => { if (activeTab !== 'membretadas') e.currentTarget.style.backgroundColor = 'rgba(192,132,252,0.15)'; }} onMouseLeave={(e) => { if (activeTab !== 'membretadas') e.currentTarget.style.backgroundColor = 'transparent'; }}>
            <LayoutTemplate size={20} style={{ minWidth: '20px' }} />
            {isSidebarOpen && <span>Hojas Membretadas</span>}
          </button>
          <button className="sidebar-btn" data-tooltip="Prefactura Web" onClick={() => cambiarTab('llenado_web')} style={{ display: 'flex', alignItems: 'center', justifyContent: isSidebarOpen ? 'flex-start' : 'center', gap: '12px', padding: '14px', borderRadius: '12px', backgroundColor: activeTab === 'llenado_web' ? '#C084FC' : 'transparent', color: activeTab === 'llenado_web' ? '#1C1335' : '#D8B4FE', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '15px', transition: 'all 0.2s', whiteSpace: 'nowrap' }} onMouseEnter={(e) => { if (activeTab !== 'llenado_web') e.currentTarget.style.backgroundColor = 'rgba(192,132,252,0.15)'; }} onMouseLeave={(e) => { if (activeTab !== 'llenado_web') e.currentTarget.style.backgroundColor = 'transparent'; }}>
            <FileSpreadsheet size={20} style={{ minWidth: '20px' }} />
            {isSidebarOpen && <span>Prefactura</span>}
          </button>
          <button className="sidebar-btn" data-tooltip="Cotizaciones" onClick={() => cambiarTab('bandeja_cotizaciones')} style={{ display: 'flex', alignItems: 'center', justifyContent: isSidebarOpen ? 'flex-start' : 'center', gap: '12px', padding: '14px', borderRadius: '12px', backgroundColor: activeTab === 'bandeja_cotizaciones' ? '#C084FC' : 'transparent', color: activeTab === 'bandeja_cotizaciones' ? '#1C1335' : '#D8B4FE', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '15px', transition: 'all 0.2s', whiteSpace: 'nowrap' }} onMouseEnter={(e) => { if (activeTab !== 'bandeja_cotizaciones') e.currentTarget.style.backgroundColor = 'rgba(192,132,252,0.15)'; }} onMouseLeave={(e) => { if (activeTab !== 'bandeja_cotizaciones') e.currentTarget.style.backgroundColor = 'transparent'; }}>
            <Archive size={20} style={{ minWidth: '20px' }} />
            {isSidebarOpen && <span>Cotizaciones</span>}
          </button>
          <button className="sidebar-btn" data-tooltip="Bandeja de Aprobación" onClick={() => cambiarTab('bandeja_aprovación')} style={{ display: 'flex', alignItems: 'center', justifyContent: isSidebarOpen ? 'flex-start' : 'center', gap: '12px', padding: '14px', borderRadius: '12px', backgroundColor: activeTab === 'bandeja_aprovación' ? '#C084FC' : 'transparent', color: activeTab === 'bandeja_aprovación' ? '#1C1335' : '#D8B4FE', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '15px', transition: 'all 0.2s', whiteSpace: 'nowrap' }} onMouseEnter={(e) => { if (activeTab !== 'bandeja_aprovación') e.currentTarget.style.backgroundColor = 'rgba(192,132,252,0.15)'; }} onMouseLeave={(e) => { if (activeTab !== 'bandeja_aprovación') e.currentTarget.style.backgroundColor = 'transparent'; }}>
            <CheckCircle size={20} style={{ minWidth: '20px' }} />
            {isSidebarOpen && <span>Bandeja de Aprobacion</span>}
          </button>
        </nav>

        <button className="sidebar-btn" data-tooltip="Volver al Sistema" onClick={() => navigate(-1)} style={{ background: 'rgba(192,132,252,0.15)', border: '1px solid rgba(192,132,252,0.3)', color: '#D8B4FE', display: 'flex', alignItems: 'center', justifyContent: isSidebarOpen ? 'center' : 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', padding: isSidebarOpen ? '16px' : '16px 0', borderRadius: '12px', transition: 'all 0.2s', marginTop: 'auto', whiteSpace: 'nowrap' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(192,132,252,0.25)'; e.currentTarget.style.color = '#FFFFFF'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(192,132,252,0.15)'; e.currentTarget.style.color = '#D8B4FE'; }}>
          <ArrowLeft size={20} style={{ minWidth: '20px' }} />
          {isSidebarOpen && <span>Volver al Sistema</span>}
        </button>
      </div>

      <div className="cotizador-main-content" style={{ flex: 1, overflowY: 'auto' }}>

        {/* ENCABEZADO Y PERFIL DE USUARIO */}
        <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          {/* Título de la página que se había borrado */}
          <div>
            <h2 style={{ fontSize: '32px', color: '#1C1335', margin: '0 0 4px 0', fontWeight: '800', letterSpacing: '-1px', fontFamily: "'Outfit', sans-serif" }}>
              {activeTab === 'generar' ? 'Generador de Cotizaciones' : activeTab === 'llenado_web' ? 'Generador de Prefactura' : activeTab === 'bandeja_cotizaciones' ? 'Bandeja de Cotizaciones' : activeTab === 'bandeja_aprovación' ? 'Bandeja de Aprobacion' : 'Configuracion de Plantillas'}
            </h2>
            <p style={{ color: '#64748B', fontSize: '15px', margin: 0, fontWeight: '500' }}>
              Gestiona tus operaciones de forma rápida y segura.
            </p>
          </div>

          {/* NUEVO DISEÑO PERFIL DE USUARIO - PREMIUM FINTECH BADGE */}
          <div style={{ position: 'relative', zIndex: 50 }}>
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '12px', 
                background: '#FFFFFF', 
                padding: '6px 14px 6px 6px', 
                borderRadius: '50px', 
                border: '1px solid #E2E8F0', 
                boxShadow: showProfileMenu ? '0 10px 25px -5px rgba(147, 51, 234, 0.15)' : '0 4px 12px rgba(147, 51, 234, 0.06)', 
                cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: showProfileMenu ? 'translateY(-2px)' : 'none'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#C084FC'; e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(147, 51, 234, 0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { if(!showProfileMenu) { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(147, 51, 234, 0.06)'; e.currentTarget.style.transform = 'none'; } }}
            >
              {/* Avatar con Gradiente y Status Dot */}
              <div style={{ position: 'relative' }}>
                <div style={{ 
                  width: '40px', height: '40px', borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #C084FC 0%, #9333EA 100%)', 
                  color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  fontWeight: '800', fontSize: '16px', border: '2px solid #FFFFFF',
                  boxShadow: '0 2px 8px rgba(147, 51, 234, 0.3)'
                }}>
                  {inicial}
                </div>
                {/* Status Dot (Online) */}
                <div style={{
                  position: 'absolute', bottom: '2px', right: '0px',
                  width: '10px', height: '10px', borderRadius: '50%',
                  background: '#10B981', border: '2px solid #FFFFFF'
                }}></div>
              </div>

              {/* Textos: Alineados a la izquierda para un bloque sólido */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
                <span style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.3px', lineHeight: '1.2' }}>{nombreUsuario}</span>
                <span style={{ fontSize: '11px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{rolUsuario}</span>
              </div>
              
              <ChevronDown size={16} color="#94A3B8" style={{ transition: 'transform 0.3s', transform: showProfileMenu ? 'rotate(180deg)' : 'rotate(0deg)', marginLeft: '4px' }} />
            </button>

            {/* DROPDOWN MENU - MODERN CARD */}
            {showProfileMenu && (
              <div style={{ 
                position: 'absolute', top: 'calc(100% + 14px)', right: '0', 
                background: '#FFFFFF', 
                borderRadius: '20px', padding: '16px', 
                border: '1px solid #E2E8F0', 
                boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(147, 51, 234, 0.05)', 
                width: '260px', animation: 'slideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1)', transformOrigin: 'top right' 
              }}>
                
                {/* Cabecera del Dropdown */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid #F1F5F9', marginBottom: '8px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(192, 132, 252, 0.1)', color: '#9333EA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '20px' }}>
                    {inicial}
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <p style={{ margin: '0 0 2px 0', fontSize: '15px', fontWeight: '800', color: '#0F172A', fontFamily: "'Outfit', sans-serif", whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{nombreUsuario}</p>
                    <p style={{ margin: 0, fontSize: '13px', color: '#64748B', fontWeight: '500', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{usuario?.email || 'Usuario de Sistema'}</p>
                  </div>
                </div>

                <button 
                  onClick={logout}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '10px', width: '100%', 
                    padding: '12px 14px', background: '#FFF1F2', border: '1px solid transparent', 
                    color: '#E11D48', fontWeight: '700', fontSize: '14px', cursor: 'pointer', 
                    borderRadius: '12px', transition: 'all 0.2s' 
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#FFE4E6'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#FFF1F2'; }}
                >
                  <LogOut size={18} strokeWidth={2} />
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>

        
        {activeTab === 'generar' && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0', animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ width: '100%', maxWidth: '850px', backgroundColor: '#FFFFFF', borderRadius: '32px', boxShadow: '0 24px 50px -12px rgba(147, 51, 234, 0.12)', border: '1px solid #F0E6FF', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

              {/* HEADER / FECHA INTEGRADA */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '32px 48px', borderBottom: '1px solid #F3E8FF', backgroundColor: '#FDFBFF' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#1C1335', letterSpacing: '-0.5px', fontFamily: "'Outfit', sans-serif" }}>Nueva Cotizacion</h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#9333EA', fontWeight: '500' }}>Selecciona la fecha oficial de emision para tu documento.</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#FFFFFF', padding: '10px 20px', borderRadius: '16px', border: '1px solid #DDD6FE', boxShadow: '0 4px 10px rgba(147,51,234,0.06)' }}>
                  <Calendar size={20} color="#9333EA" />
                  <input type="date" value={fechaOperacion} onChange={e => setFechaOperacion(e.target.value)} style={{ border: 'none', outline: 'none', color: '#1C1335', fontWeight: '800', fontSize: '16px', fontFamily: "'Outfit', sans-serif", cursor: 'pointer', backgroundColor: 'transparent' }} />
                </div>
              </div>

              {/* DROPZONE */}
              <div style={{ padding: '56px 48px' }}>
                <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} onClick={() => fileInputRef.current.click()} style={{ border: `2px dashed ${dragActive ? '#C084FC' : '#DDD6FE'}`, backgroundColor: dragActive ? '#FAF5FF' : '#FFFFFF', borderRadius: '24px', padding: '72px 24px', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} onMouseEnter={e => { if (!dragActive) { e.currentTarget.style.backgroundColor = '#FDFBFF'; e.currentTarget.style.borderColor = '#C084FC'; } }} onMouseLeave={e => { if (!dragActive) { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.borderColor = '#DDD6FE'; } }}>

                  <input ref={fileInputRef} type="file" accept=".xlsx, .xls" onChange={handleFileSelect} style={{ display: 'none' }} />

                  <div style={{ backgroundColor: dragActive ? '#F3E8FF' : '#F8FAFC', width: '88px', height: '88px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px auto', color: dragActive ? '#9333EA' : '#64748B', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', transform: dragActive ? 'scale(1.1) translateY(-4px)' : 'scale(1)' }}>
                    {loading ? <Loader2 size={40} className="animate-spin" /> : <UploadCloud size={40} strokeWidth={1.5} />}
                  </div>

                  <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#1C1335', margin: '0 0 12px 0', letterSpacing: '-0.5px', fontFamily: "'Outfit', sans-serif" }}>
                    {loading ? 'Analizando Documento...' : (dragActive ? 'Suelta tu archivo aqui' : 'Sube tu documento Excel (.xlsx)')}
                  </h3>
                  <p style={{ color: '#64748B', margin: 0, fontSize: '15px', fontWeight: '500', maxWidth: '420px', lineHeight: '1.6', textAlign: 'center' }}>
                    Sube tu formato de prefactura y el sistema armara la cotizacion completa en segundos.
                  </p>

                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'membretadas' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '40px', boxShadow: '0 16px 40px -8px rgba(147, 51, 234, 0.1)', border: '1px solid #F0E6FF', animation: 'fadeIn 0.4s ease-out' }}>
            <GestorMembretadas />
          </div>
        )}

        {activeTab === 'llenado_web' && (
          <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
            <FormularioPreFactura empresas={empresas} clientes={clientes} />
          </div>
        )}

        {activeTab === 'bandeja_aprovación' && (
          <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
            <BandejaAprobacion />
          </div>
        )}

        {activeTab === 'bandeja_cotizaciones' && (
          <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
            <BandejaCotizaciones />
          </div>
        )}

      </div>

      {/* MODAL DE CONFIRMACION */}
      {
        analysisResult && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(28, 19, 53, 0.6)', backdropFilter: 'blur(6px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '32px', width: '600px', maxWidth: '90%', padding: '40px', boxShadow: '0 25px 50px -12px rgba(147, 51, 234, 0.2)', border: '1px solid #F0E6FF', animation: 'slideUp 0.3s ease-out', display: 'flex', flexDirection: 'column' }}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#1C1335', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Confirmacion de Datos</h3>
                <button onClick={() => { setAnalysisResult(null); setFile(null); }} style={{ background: '#F3E8FF', border: 'none', width: '40px', height: '40px', borderRadius: '50%', color: '#9333EA', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>

                {/* Remitente */}
                <div style={{ backgroundColor: analysisResult.empresa_emisora.match ? '#F3E8FF' : '#F8FAFC', border: `1px solid ${analysisResult.empresa_emisora.match ? '#DDD6FE' : '#E2E8F0'}`, padding: '24px', borderRadius: '20px' }}>
                  <p style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: '700', color: analysisResult.empresa_emisora.match ? '#9333EA' : '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Building2 size={16} /> Empresa Emisora (Remitente)
                  </p>

                  {analysisResult.empresa_emisora.match ? (
                    <div>
                      <p style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1C1335' }}>{analysisResult.empresa_emisora.nombre}</p>
                      {analysisResult.empresa_emisora.correo && (
                        <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#64748B', fontWeight: '500' }}>{analysisResult.empresa_emisora.correo}</p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p style={{ margin: '0 0 12px 0', color: '#475569', fontSize: '14px', fontWeight: '600' }}>
                        No pudimos vincular "{analysisResult.empresa_emisora.nombre}" automaticamente. Selecciona una manualmente:
                      </p>
                      <select value={selectedEmpresa} onChange={e => setSelectedEmpresa(e.target.value)} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #DDD6FE', backgroundColor: '#FFFFFF', outline: 'none', color: '#1C1335', fontWeight: '600', fontSize: '15px', fontFamily: "'Plus Jakarta Sans', sans-serif", transition: 'border 0.2s' }}>
                        <option value="">-- Selecciona --</option>
                        {empresas.map(emp => (
                          <option key={emp.id} value={emp.id}>{emp.nombre_empresa}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Destinatario */}
                <div style={{ backgroundColor: analysisResult.cliente.match ? '#F3E8FF' : '#F8FAFC', border: `1px solid ${analysisResult.cliente.match ? '#DDD6FE' : '#E2E8F0'}`, padding: '24px', borderRadius: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: analysisResult.cliente.match ? '#9333EA' : '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Users size={16} /> Cliente (Destinatario)
                    </p>
                    {!analysisResult.cliente.match && (
                      <button onClick={() => setShowNewCliente(!showNewCliente)} style={{ background: '#F3E8FF', border: '1px solid #DDD6FE', color: '#9333EA', cursor: 'pointer', fontSize: '12px', fontWeight: '700', padding: '6px 12px', borderRadius: '8px', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#EDE9FE'} onMouseLeave={e => e.currentTarget.style.background = '#F3E8FF'}>+ NUEVO CLIENTE</button>
                    )}
                  </div>

                  {analysisResult.cliente.match ? (
                    <div>
                      <p style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1C1335' }}>{analysisResult.cliente.nombre}</p>
                      {analysisResult.cliente.correo && (
                        <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#64748B', fontWeight: '500' }}>{analysisResult.cliente.correo}</p>
                      )}
                    </div>
                  ) : (
                    <div>
                      {showNewCliente ? (
                        <div style={{ animation: 'fadeIn 0.3s' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', marginBottom: '12px' }}>
                            <input type="text" placeholder="Nombre de la empresa *" value={newClienteData.empresa} onChange={e => setNewClienteData({ ...newClienteData, empresa: e.target.value })} style={{ padding: '14px', borderRadius: '10px', border: '1px solid #DDD6FE', outline: 'none', fontSize: '14px', fontFamily: "'Plus Jakarta Sans', sans-serif" }} />
                            <input type="email" placeholder="Correo electronico *" value={newClienteData.correo} onChange={e => setNewClienteData({ ...newClienteData, correo: e.target.value })} style={{ padding: '14px', borderRadius: '10px', border: '1px solid #DDD6FE', outline: 'none', fontSize: '14px', fontFamily: "'Plus Jakarta Sans', sans-serif" }} />
                          </div>
                          <button onClick={handleCrearCliente} style={{ width: '100%', padding: '14px', backgroundColor: '#9333EA', color: '#FFFFFF', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#7C3AED'} onMouseLeave={e => e.currentTarget.style.backgroundColor = '#9333EA'}>
                            Guardar Cliente en CRM
                          </button>
                        </div>
                      ) : (
                        <div>
                          <p style={{ margin: '0 0 12px 0', color: '#475569', fontSize: '14px', fontWeight: '600' }}>
                            No detectamos "{analysisResult.cliente.nombre}". Seleccionalo de la lista:
                          </p>
                          <select value={selectedCliente} onChange={e => setSelectedCliente(e.target.value)} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #DDD6FE', backgroundColor: '#FFFFFF', outline: 'none', color: '#1C1335', fontWeight: '600', fontSize: '15px', fontFamily: "'Plus Jakarta Sans', sans-serif", transition: 'border 0.2s' }}>
                            <option value="">-- Selecciona --</option>
                            {clientes.map(cli => (
                              <option key={cli.id} value={cli.id}>{cli.empresa}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>


              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={handlePreview} disabled={loading || sendingEmail} title="Vista Previa" style={{ padding: '20px', borderRadius: '16px', background: '#F3E8FF', color: '#9333EA', border: '2px solid #DDD6FE', cursor: (loading || sendingEmail) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0 }} onMouseEnter={(e) => { if (!loading && !sendingEmail) { e.currentTarget.style.background = '#EDE9FE'; e.currentTarget.style.borderColor = '#C084FC'; } }} onMouseLeave={(e) => { if (!loading && !sendingEmail) { e.currentTarget.style.background = '#F3E8FF'; e.currentTarget.style.borderColor = '#DDD6FE'; } }}>
                    {loading ? <Loader2 size={20} className="animate-spin" /> : <Eye size={20} />}
                  </button>

                  <button onClick={handleUpload} disabled={loading || sendingEmail} style={{ flex: 1, padding: '20px', borderRadius: '16px', fontSize: '15px', fontWeight: '700', background: '#F8FAFC', color: '#475569', border: '2px solid #E2E8F0', cursor: (loading || sendingEmail) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }} onMouseEnter={(e) => { if (!loading && !sendingEmail) { e.currentTarget.style.background = '#F1F5F9'; } }} onMouseLeave={(e) => { if (!loading && !sendingEmail) { e.currentTarget.style.background = '#F8FAFC'; } }}>
                    {loading ? <Loader2 size={20} className="animate-spin" /> : <FileText size={20} />}
                    {loading ? 'Procesando...' : 'Descargar'}
                  </button>
                </div>

                <button onClick={handleUploadAndSend} disabled={loading || sendingEmail} style={{ padding: '20px', borderRadius: '16px', fontSize: '16px', fontWeight: '700', background: '#9333EA', color: '#FFFFFF', border: 'none', cursor: (loading || sendingEmail) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'all 0.2s', boxShadow: '0 10px 15px -3px rgba(147, 51, 234, 0.35)' }} onMouseEnter={(e) => { if (!loading && !sendingEmail) { e.currentTarget.style.background = '#7C3AED'; } }} onMouseLeave={(e) => { if (!loading && !sendingEmail) { e.currentTarget.style.background = '#9333EA'; } }}>
                  {sendingEmail ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                  {sendingEmail ? 'Enviando...' : 'Generar y Enviar'}
                </button>
              </div>

            </div>
          </div>
        )
      }

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
            padding: 0 16px;
            background-color: #FFFFFF;
            border-bottom: 1px solid #F0E6FF;
            position: sticky;
            top: 0;
            z-index: 30;
            box-shadow: 0 1px 3px rgba(147,51,234,0.05);
          }

          .cotizador-main-content {
            padding: 16px 12px !important;
            height: calc(100vh - 60px) !important;
          }
        }

        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #DDD6FE; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #C084FC; }
        
        .sidebar-collapsed .sidebar-btn { position: relative; }
        .sidebar-collapsed .sidebar-btn::after {
          content: attr(data-tooltip); position: absolute; left: 100%; top: 50%; transform: translateY(-50%) translateX(10px);
          background-color: #9333EA; color: #FFFFFF; padding: 8px 14px; border-radius: 8px; font-size: 13px; font-weight: 600;
          white-space: nowrap; opacity: 0; visibility: hidden; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1); pointer-events: none; z-index: 50;
        }
        .sidebar-collapsed .sidebar-btn::before {
          content: ''; position: absolute; left: 100%; top: 50%; transform: translateY(-50%) translateX(4px);
          border-width: 6px; border-style: solid; border-color: transparent #9333EA transparent transparent;
          opacity: 0; visibility: hidden; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); pointer-events: none; z-index: 50;
        }
        .sidebar-collapsed .sidebar-btn:hover::after { opacity: 1; visibility: visible; transform: translateY(-50%) translateX(16px); }
        .sidebar-collapsed .sidebar-btn:hover::before { opacity: 1; visibility: visible; transform: translateY(-50%) translateX(10px); }
      `}</style>
    </div >
  );
}
