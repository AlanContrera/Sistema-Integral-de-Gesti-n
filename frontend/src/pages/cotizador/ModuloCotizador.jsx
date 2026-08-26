import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UploadCloud, FileSpreadsheet, CheckCircle, Loader2, Calendar, LayoutTemplate, Building2, UserPlus, Send, FileText, PieChart, Users, Menu, AlertCircle, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import GestorMembretadas from '../../components/cotizador/GestorMembretadas';
import FormularioPreFactura from '../../components/cotizador/FormularioPreFactura';
import BandejaAprobacion from '../../components/cotizador/BandejaAprobacion';

export default function ModuloCotizador() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState('generar');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      console.error("Error cargando catálogos:", e);
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
      toast.error("Error de conexión al crear cliente");
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
        throw new Error("El servidor devolvió una respuesta no válida. Revisa tu Excel.");
      }

      if (!res.ok) throw new Error(data.error || "Error al analizar Excel");

      toast.success('Documento procesado con éxito', { id: toastId });
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
    if (!fechaOperacion) { toast.error("Selecciona una Fecha de Operación"); return false; }
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
      throw new Error(errorData.error || "Error generando PDF de la cotización");
    }

    const blob = await resPdf.blob();
    const folio = resPdf.headers.get('X-Folio-Generado') || "Generada";

    return { blob, folio };
  }

  const handleUpload = async () => {
    if (!validateForm()) return;
    setLoading(true);
    const toastId = toast.loading('Generando Cotización PDF...');

    try {
      // Extraemos tanto el blob como el folio
      const { blob, folio } = await generatePDFBlob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${folio}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success('Cotización generada y descargada', { id: toastId });
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

    // 1. Abrimos la pestaña INMEDIATAMENTE (Evita que el navegador lo bloquee por ser asíncrono)
    const nuevaPestana = window.open('', '_blank');

    if (!nuevaPestana) {
      toast.error("Por favor, desactiva el bloqueador de ventanas emergentes para este sitio.");
      return;
    }

    // 2. Le ponemos un mensaje de carga a la nueva pestaña para que el usuario no se desespere
    nuevaPestana.document.write('<html><body style="font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f1f5f9; color: #475569;"><h2>Generando vista previa del PDF... Por favor espera.</h2></body></html>');

    setLoading(true);

    try {
      const { blob } = await generatePDFBlob();
      const url = window.URL.createObjectURL(blob);

      // 3. Ya que tenemos el PDF, recargamos esa pestaña con el archivo real
      nuevaPestana.location.href = url;

    } catch (error) {
      nuevaPestana.close(); // Si falla, cerramos la pestaña que abrimos
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
        toast.success('Cotización enviada exitosamente por correo', { id: toastId });
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
    <div style={{ display: 'flex', height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0, fontFamily: "'Outfit', sans-serif", backgroundColor: '#F8FAFC', zIndex: 40 }}>

      <div className={!isSidebarOpen ? 'sidebar-collapsed' : ''} style={{ width: isSidebarOpen ? '280px' : '90px', backgroundColor: '#1E1B4B', color: '#FFFFFF', display: 'flex', flexDirection: 'column', padding: '24px 16px', boxShadow: '4px 0 24px rgba(0,0,0,0.1)', zIndex: 10, transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>






        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          {isSidebarOpen && <p style={{ color: '#6366F1', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', padding: '0 8px' }}>Menú Principal</p>}
          <button className="sidebar-btn" data-tooltip="Generar Cotización" onClick={() => setActiveTab('generar')} style={{ display: 'flex', alignItems: 'center', justifyContent: isSidebarOpen ? 'flex-start' : 'center', gap: '12px', padding: '14px', borderRadius: '12px', backgroundColor: activeTab === 'generar' ? '#4F46E5' : 'transparent', color: activeTab === 'generar' ? '#FFFFFF' : '#A5B4FC', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '15px', transition: 'all 0.2s', whiteSpace: 'nowrap' }} onMouseEnter={(e) => { if (activeTab !== 'generar') e.currentTarget.style.backgroundColor = '#312E81'; }} onMouseLeave={(e) => { if (activeTab !== 'generar') e.currentTarget.style.backgroundColor = 'transparent'; }}>
            <FileText size={20} style={{ minWidth: '20px' }} />
            {isSidebarOpen && <span>Generar Cotización</span>}
          </button>
          <button className="sidebar-btn" data-tooltip="Hojas Membretadas" onClick={() => setActiveTab('membretadas')} style={{ display: 'flex', alignItems: 'center', justifyContent: isSidebarOpen ? 'flex-start' : 'center', gap: '12px', padding: '14px', borderRadius: '12px', backgroundColor: activeTab === 'membretadas' ? '#4F46E5' : 'transparent', color: activeTab === 'membretadas' ? '#FFFFFF' : '#A5B4FC', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '15px', transition: 'all 0.2s', whiteSpace: 'nowrap' }} onMouseEnter={(e) => { if (activeTab !== 'membretadas') e.currentTarget.style.backgroundColor = '#312E81'; }} onMouseLeave={(e) => { if (activeTab !== 'membretadas') e.currentTarget.style.backgroundColor = 'transparent'; }}>
            <LayoutTemplate size={20} style={{ minWidth: '20px' }} />
            {isSidebarOpen && <span>Hojas Membretadas</span>}
          </button>
          <button className="sidebar-btn" data-tooltip="Prefactura Web" onClick={() => setActiveTab('llenado_web')} style={{ display: 'flex', alignItems: 'center', justifyContent: isSidebarOpen ? 'flex-start' : 'center', gap: '12px', padding: '14px', borderRadius: '12px', backgroundColor: activeTab === 'llenado_web' ? '#4F46E5' : 'transparent', color: activeTab === 'llenado_web' ? '#FFFFFF' : '#A5B4FC', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '15px', transition: 'all 0.2s', whiteSpace: 'nowrap' }} onMouseEnter={(e) => { if (activeTab !== 'llenado_web') e.currentTarget.style.backgroundColor = '#312E81'; }} onMouseLeave={(e) => { if (activeTab !== 'llenado_web') e.currentTarget.style.backgroundColor = 'transparent'; }}>
            <FileSpreadsheet size={20} style={{ minWidth: '20px' }} />
            {isSidebarOpen && <span>Prefactura Web</span>}
          </button>
          <button className="sidebar-btn" data-tooltip="Bandeja de Aprobación" onClick={() => setActiveTab('bandeja_aprovación')} style={{ display: 'flex', alignItems: 'center', justifyContent: isSidebarOpen ? 'flex-start' : 'center', gap: '12px', padding: '14px', borderRadius: '12px', backgroundColor: activeTab === 'bandeja_aprovación' ? '#4F46E5' : 'transparent', color: activeTab === 'bandeja_aprovación' ? '#FFFFFF' : '#A5B4FC', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '15px', transition: 'all 0.2s', whiteSpace: 'nowrap' }} onMouseEnter={(e) => { if (activeTab !== 'bandeja_aprovación') e.currentTarget.style.backgroundColor = '#312E81'; }} onMouseLeave={(e) => { if (activeTab !== 'bandeja_aprovación') e.currentTarget.style.backgroundColor = 'transparent'; }}>
            <CheckCircle size={20} style={{ minWidth: '20px' }} />
            {isSidebarOpen && <span>Bandeja de Aprobación</span>}
          </button>
        </nav>

        <button className="sidebar-btn" data-tooltip="Volver al Sistema" onClick={() => navigate(-1)} style={{ background: '#312E81', border: '1px solid #4338CA', color: '#C7D2FE', display: 'flex', alignItems: 'center', justifyContent: isSidebarOpen ? 'center' : 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', padding: isSidebarOpen ? '16px' : '16px 0', borderRadius: '12px', transition: 'all 0.2s', marginTop: 'auto', whiteSpace: 'nowrap' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#4338CA'; e.currentTarget.style.color = '#FFFFFF'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#312E81'; e.currentTarget.style.color = '#C7D2FE'; }}>
          <ArrowLeft size={20} style={{ minWidth: '20px' }} />
          {isSidebarOpen && <span>Volver al Sistema</span>}
        </button>
      </div>

      <div style={{ flex: 1, padding: '48px 60px', overflowY: 'auto' }}>
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '32px', color: '#1E1B4B', margin: '0 0 8px 0', fontWeight: '700', letterSpacing: '-0.5px' }}>
            {activeTab === 'generar' ? 'Generador de Cotizaciones' : activeTab === 'llenado_web' ? 'Generador de Prefactura Web' : 'Configuración de Plantillas'}
          </h2>

        </div>

        {activeTab === 'generar' && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0', animation: 'fadeIn 0.5s ease-out' }}>

            {/* CONTENEDOR CENTRALIZADO */}
            <div style={{ width: '100%', maxWidth: '850px', backgroundColor: '#FFFFFF', borderRadius: '32px', boxShadow: '0 24px 50px -12px rgba(79, 70, 229, 0.15)', border: '1px solid #EEF2FF', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

              {/* HEADER / FECHA INTEGRADA */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '32px 48px', borderBottom: '1px solid #F1F5F9', backgroundColor: '#FAFAF9' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#1E1B4B', letterSpacing: '-0.5px' }}>Nueva Cotización</h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6366F1', fontWeight: '500' }}>Selecciona la fecha oficial de emisión para tu documento.</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#FFFFFF', padding: '10px 20px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                  <Calendar size={20} color="#4F46E5" />
                  <input type="date" value={fechaOperacion} onChange={e => setFechaOperacion(e.target.value)} style={{ border: 'none', outline: 'none', color: '#1E1B4B', fontWeight: '800', fontSize: '16px', fontFamily: "'Outfit', sans-serif", cursor: 'pointer', backgroundColor: 'transparent' }} />
                </div>
              </div>

              {/* DROPZONE AMPLIO Y LIMPIO */}
              <div style={{ padding: '56px 48px' }}>
                <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} onClick={() => fileInputRef.current.click()} style={{ border: `2px dashed ${dragActive ? '#4F46E5' : '#CBD5E1'}`, backgroundColor: dragActive ? '#F5F3FF' : '#FFFFFF', borderRadius: '24px', padding: '72px 24px', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} onMouseEnter={e => { if (!dragActive) { e.currentTarget.style.backgroundColor = '#F8FAFC'; e.currentTarget.style.borderColor = '#94A3B8'; } }} onMouseLeave={e => { if (!dragActive) { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.borderColor = '#CBD5E1'; } }}>

                  <input ref={fileInputRef} type="file" accept=".xlsx, .xls" onChange={handleFileSelect} style={{ display: 'none' }} />

                  <div style={{ backgroundColor: dragActive ? '#E0E7FF' : '#F1F5F9', width: '88px', height: '88px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px auto', color: dragActive ? '#4F46E5' : '#64748B', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', transform: dragActive ? 'scale(1.1) translateY(-4px)' : 'scale(1)' }}>
                    {loading ? <Loader2 size={40} className="animate-spin" /> : <UploadCloud size={40} strokeWidth={1.5} />}
                  </div>

                  <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#1E1B4B', margin: '0 0 12px 0', letterSpacing: '-0.5px' }}>
                    {loading ? 'Analizando Documento...' : (dragActive ? 'Suelta tu archivo aquí' : 'Sube tu documento Excel (.xlsx)')}
                  </h3>
                  <p style={{ color: '#64748B', margin: 0, fontSize: '15px', fontWeight: '500', maxWidth: '420px', lineHeight: '1.6', textAlign: 'center' }}>
                    Sube tu formato de prefactura y el sistema armará la cotización completa en segundos.
                  </p>

                </div>
              </div>
            </div>

          </div>
        )}



        {activeTab === 'membretadas' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '40px', boxShadow: '0 16px 40px -8px rgba(79, 70, 229, 0.15)', animation: 'fadeIn 0.4s ease-out' }}>
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


      </div>

      {
        analysisResult && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(6px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '32px', width: '600px', maxWidth: '90%', padding: '40px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', animation: 'slideUp 0.3s ease-out', display: 'flex', flexDirection: 'column' }}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>Confirmación de Datos</h3>
                <button onClick={() => { setAnalysisResult(null); setFile(null); }} style={{ background: '#F1F5F9', border: 'none', width: '40px', height: '40px', borderRadius: '50%', color: '#64748B', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>

                {/* Remitente */}
                <div style={{ backgroundColor: analysisResult.empresa_emisora.match ? '#EEF2FF' : '#F8FAFC', border: `1px solid ${analysisResult.empresa_emisora.match ? '#C7D2FE' : '#E2E8F0'}`, padding: '24px', borderRadius: '20px' }}>
                  <p style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: '700', color: analysisResult.empresa_emisora.match ? '#4F46E5' : '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Building2 size={16} /> Empresa Emisora (Remitente)
                  </p>

                  {analysisResult.empresa_emisora.match ? (
                    <div>
                      <p style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1E1B4B' }}>{analysisResult.empresa_emisora.nombre}</p>
                      {analysisResult.empresa_emisora.correo && (
                        <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#64748B', fontWeight: '500' }}>{analysisResult.empresa_emisora.correo}</p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p style={{ margin: '0 0 12px 0', color: '#475569', fontSize: '14px', fontWeight: '600' }}>
                        No pudimos vincular "{analysisResult.empresa_emisora.nombre}" automáticamente. Selecciona una manualmente:
                      </p>
                      <select value={selectedEmpresa} onChange={e => setSelectedEmpresa(e.target.value)} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', outline: 'none', color: '#1E1B4B', fontWeight: '600', fontSize: '15px', fontFamily: "'Outfit', sans-serif", transition: 'border 0.2s' }}>
                        <option value="">-- Selecciona --</option>
                        {empresas.map(emp => (
                          <option key={emp.id} value={emp.id}>{emp.nombre_empresa}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Destinatario */}
                <div style={{ backgroundColor: analysisResult.cliente.match ? '#EEF2FF' : '#F8FAFC', border: `1px solid ${analysisResult.cliente.match ? '#C7D2FE' : '#E2E8F0'}`, padding: '24px', borderRadius: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: analysisResult.cliente.match ? '#4F46E5' : '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Users size={16} /> Cliente (Destinatario)
                    </p>
                    {!analysisResult.cliente.match && (
                      <button onClick={() => setShowNewCliente(!showNewCliente)} style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', color: '#4F46E5', cursor: 'pointer', fontSize: '12px', fontWeight: '700', padding: '6px 12px', borderRadius: '8px', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#E2E8F0'} onMouseLeave={e => e.currentTarget.style.background = '#F1F5F9'}>+ NUEVO CLIENTE</button>
                    )}
                  </div>

                  {analysisResult.cliente.match ? (
                    <div>
                      <p style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1E1B4B' }}>{analysisResult.cliente.nombre}</p>
                      {analysisResult.cliente.correo && (
                        <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#64748B', fontWeight: '500' }}>{analysisResult.cliente.correo}</p>
                      )}
                    </div>
                  ) : (
                    <div>
                      {showNewCliente ? (
                        <div style={{ animation: 'fadeIn 0.3s' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', marginBottom: '12px' }}>
                            <input type="text" placeholder="Nombre de la empresa *" value={newClienteData.empresa} onChange={e => setNewClienteData({ ...newClienteData, empresa: e.target.value })} style={{ padding: '14px', borderRadius: '10px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '14px', fontFamily: "'Outfit', sans-serif" }} />
                            <input type="email" placeholder="Correo electrónico *" value={newClienteData.correo} onChange={e => setNewClienteData({ ...newClienteData, correo: e.target.value })} style={{ padding: '14px', borderRadius: '10px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '14px', fontFamily: "'Outfit', sans-serif" }} />
                          </div>
                          <button onClick={handleCrearCliente} style={{ width: '100%', padding: '14px', backgroundColor: '#4F46E5', color: '#FFFFFF', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#312E81'} onMouseLeave={e => e.currentTarget.style.backgroundColor = '#4F46E5'}>
                            Guardar Cliente en CRM
                          </button>
                        </div>
                      ) : (
                        <div>
                          <p style={{ margin: '0 0 12px 0', color: '#475569', fontSize: '14px', fontWeight: '600' }}>
                            No detectamos "{analysisResult.cliente.nombre}". Selecciónalo de la lista:
                          </p>
                          <select value={selectedCliente} onChange={e => setSelectedCliente(e.target.value)} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', outline: 'none', color: '#1E1B4B', fontWeight: '600', fontSize: '15px', fontFamily: "'Outfit', sans-serif", transition: 'border 0.2s' }}>
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
                  <button
                    onClick={handlePreview}
                    disabled={loading || sendingEmail}
                    title="Vista Previa"
                    style={{ padding: '20px', borderRadius: '16px', background: '#F1F5F9', color: '#4F46E5', border: '2px solid #E2E8F0', cursor: (loading || sendingEmail) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0 }}
                    onMouseEnter={(e) => { if (!loading && !sendingEmail) { e.currentTarget.style.background = '#EEF2FF'; e.currentTarget.style.borderColor = '#C7D2FE'; } }}
                    onMouseLeave={(e) => { if (!loading && !sendingEmail) { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.borderColor = '#E2E8F0'; } }}
                  >
                    {loading ? <Loader2 size={20} className="animate-spin" /> : <Eye size={20} />}
                  </button>

                  <button
                    onClick={handleUpload}
                    disabled={loading || sendingEmail}
                    style={{ flex: 1, padding: '20px', borderRadius: '16px', fontSize: '15px', fontWeight: '700', background: '#F1F5F9', color: '#475569', border: '2px solid #E2E8F0', cursor: (loading || sendingEmail) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => { if (!loading && !sendingEmail) { e.currentTarget.style.background = '#E2E8F0'; } }}
                    onMouseLeave={(e) => { if (!loading && !sendingEmail) { e.currentTarget.style.background = '#F1F5F9'; } }}
                  >
                    {loading ? <Loader2 size={20} className="animate-spin" /> : <FileText size={20} />}
                    {loading ? 'Procesando...' : 'Descargar'}
                  </button>
                </div>

                <button
                  onClick={handleUploadAndSend}
                  disabled={loading || sendingEmail}
                  style={{ padding: '20px', borderRadius: '16px', fontSize: '16px', fontWeight: '700', background: '#4F46E5', color: '#FFFFFF', border: 'none', cursor: (loading || sendingEmail) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'all 0.2s', boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.4)' }}
                  onMouseEnter={(e) => { if (!loading && !sendingEmail) { e.currentTarget.style.background = '#312E81'; } }}
                  onMouseLeave={(e) => { if (!loading && !sendingEmail) { e.currentTarget.style.background = '#4F46E5'; } }}
                >
                  {sendingEmail ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                  {sendingEmail ? 'Enviando...' : 'Generar y Enviar'}
                </button>
              </div>

            </div>
          </div>
        )
      }

      <style>{`
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
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #C7D2FE; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #818CF8; }
        
        .sidebar-collapsed .sidebar-btn { position: relative; }
        .sidebar-collapsed .sidebar-btn::after {
          content: attr(data-tooltip); position: absolute; left: 100%; top: 50%; transform: translateY(-50%) translateX(10px);
          background-color: #4F46E5; color: #FFFFFF; padding: 8px 14px; border-radius: 8px; font-size: 13px; font-weight: 600;
          white-space: nowrap; opacity: 0; visibility: hidden; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1); pointer-events: none; z-index: 50;
        }
        .sidebar-collapsed .sidebar-btn::before {
          content: ''; position: absolute; left: 100%; top: 50%; transform: translateY(-50%) translateX(4px);
          border-width: 6px; border-style: solid; border-color: transparent #4F46E5 transparent transparent;
          opacity: 0; visibility: hidden; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); pointer-events: none; z-index: 50;
        }
        .sidebar-collapsed .sidebar-btn:hover::after { opacity: 1; visibility: visible; transform: translateY(-50%) translateX(16px); }
        .sidebar-collapsed .sidebar-btn:hover::before { opacity: 1; visibility: visible; transform: translateY(-50%) translateX(10px); }
      `}</style>
    </div >
  );
}
