import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UploadCloud, FileSpreadsheet, CheckCircle2, Loader2, Calendar, Settings } from 'lucide-react';
import toast from 'react-hot-toast';
import GestorMembretadas from './GestorMembretadas';

export default function ModuloCotizador() {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showGestor, setShowGestor] = useState(false);
  const inputRef = useRef(null);
  const [fechaOperacion, setFechaOperacion] = useState(() => new Date().toISOString().split('T')[0]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (selectedFile) => {
    const validExtensions = ['.xls', '.xlsx'];
    const isValid = validExtensions.some(ext => selectedFile.name.toLowerCase().endsWith(ext));

    if (!isValid) {
      toast.error('Solo se permiten archivos Excel (.xls o .xlsx)');
      return;
    }

    setFile(selectedFile);
    toast.success('Archivo preparado correctamente');
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Por favor, selecciona un archivo primero');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fecha', fechaOperacion);

    const toastId = toast.loading('Generando cotización oficial...');

    try {
      const response = await fetch(`http://${window.location.hostname}:8000/api/cotizador/generar/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al generar la cotización');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Cotizacion_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('¡Cotización generada con éxito!', { id: toastId });
      setFile(null);
      if (inputRef.current) inputRef.current.value = '';

    } catch (error) {
      console.error(error);
      toast.error(error.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F8FAFC',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      padding: '40px 20px',
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* Decorative background blobs */}
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '40%', height: '50%', background: 'radial-gradient(circle, rgba(26,155,215,0.06) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '50%', height: '60%', background: 'radial-gradient(circle, rgba(11,74,122,0.04) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }} />

      <div style={{
        width: '100%',
        maxWidth: '540px',
        zIndex: 1,
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>

        <button
          onClick={() => navigate('/')}
          style={{
            background: 'transparent', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center',
            gap: '8px', color: '#64748B', fontSize: '15px', fontWeight: '500', marginBottom: '32px', padding: 0,
            transition: 'color 0.2s, transform 0.2s', letterSpacing: '-0.3px'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#0B4A7A'; e.currentTarget.style.transform = 'translateX(-4px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#64748B'; e.currentTarget.style.transform = 'translateX(0)'; }}
        >
          <ArrowLeft size={18} /> Volver al panel
        </button>

        {/* Main Clean Card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          boxShadow: '0 20px 40px -10px rgba(11, 74, 122, 0.08), 0 1px 3px rgba(0,0,0,0.02)',
          padding: '48px',
          position: 'relative'
        }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#0F172A', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
              Generar Cotización
            </h1>
            <p style={{ fontSize: '15px', color: '#64748B', margin: 0, lineHeight: '1.5' }}>
              Sube el archivo Excel de la operación para generar el PDF de cotizacion.
            </p>
          </div>

          {/* Date Picker Section */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '10px' }}>
              <Calendar size={16} color="#1A9BD7" />
              Fecha de la Operación
            </label>
            <input
              type='date'
              value={fechaOperacion}
              onChange={(e) => setFechaOperacion(e.target.value)}
              style={{
                width: '100%', padding: '14px 16px', borderRadius: '12px',
                border: '2px solid #E2E8F0', fontSize: '15px', color: '#0F172A', outline: 'none',
                transition: 'all 0.2s ease', backgroundColor: '#F8FAFC',
                fontFamily: 'inherit', fontWeight: '500'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#1A9BD7';
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.boxShadow = '0 0 0 4px rgba(26,155,215,0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#E2E8F0';
                e.currentTarget.style.backgroundColor = '#F8FAFC';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>



          {/* Drag & Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            style={{
              border: `2px dashed ${dragActive ? '#1A9BD7' : '#CBD5E1'}`,
              backgroundColor: dragActive ? '#F0F9FF' : '#FFFFFF',
              borderRadius: '16px',
              padding: '40px 24px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              marginBottom: '32px'
            }}
            onMouseEnter={(e) => {
              if (!dragActive) {
                e.currentTarget.style.borderColor = '#94A3B8';
                e.currentTarget.style.backgroundColor = '#F8FAFC';
              }
            }}
            onMouseLeave={(e) => {
              if (!dragActive) {
                e.currentTarget.style.borderColor = '#CBD5E1';
                e.currentTarget.style.backgroundColor = '#FFFFFF';
              }
            }}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".xls,.xlsx"
              onChange={handleChange}
              style={{ display: 'none' }}
            />

            <div style={{
              backgroundColor: dragActive ? '#E0F2FE' : '#F1F5F9',
              width: '64px', height: '64px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px auto',
              color: dragActive ? '#0B4A7A' : '#64748B',
              transition: 'all 0.3s'
            }}>
              <UploadCloud size={32} strokeWidth={2} />
            </div>

            <h3 style={{ fontSize: '17px', fontWeight: '600', color: '#0F172A', margin: '0 0 6px 0', letterSpacing: '-0.3px' }}>
              {dragActive ? 'Suelta el archivo aquí' : 'Haz clic para subir un archivo'}
            </h3>
            <p style={{ color: '#64748B', margin: 0, fontSize: '14px', fontWeight: '400' }}>
              o arrastra y suelta tu formato Excel (.xls, .xlsx)
            </p>
          </div>

          {/* File Selected State */}
          {file && (
            <div
              style={{
                padding: '16px 20px', backgroundColor: '#F0F9FF', borderRadius: '12px',
                border: '1px solid #BAE6FD', display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', marginBottom: '32px',
                animation: 'slideDown 0.3s ease-out forwards'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ backgroundColor: '#FFFFFF', padding: '10px', borderRadius: '8px', color: '#0B4A7A', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  <FileSpreadsheet size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <p style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '600', color: '#0F172A', letterSpacing: '-0.2px' }}>{file.name}</p>
                  <p style={{ margin: 0, fontSize: '13px', color: '#0EA5E9', fontWeight: '500' }}>{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
              <div style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '600' }}>
                <CheckCircle2 size={18} strokeWidth={2.5} />
              </div>
            </div>
          )}

          {/* Primary Action */}
          <button
            onClick={(e) => { e.stopPropagation(); handleUpload(); }}
            disabled={!file || loading}
            style={{
              width: '100%', padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: '600',
              background: (!file || loading) ? '#E2E8F0' : '#0B4A7A',
              color: (!file || loading) ? '#64748B' : '#FFFFFF',
              border: 'none', cursor: (!file || loading) ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              transition: 'all 0.3s',
              boxShadow: (!file || loading) ? 'none' : '0 8px 16px -4px rgba(11, 74, 122, 0.4)',
              letterSpacing: '-0.3px'
            }}
            onMouseEnter={(e) => {
              if (file && !loading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 20px -4px rgba(11, 74, 122, 0.5)';
                e.currentTarget.style.background = '#073253';
              }
            }}
            onMouseLeave={(e) => {
              if (file && !loading) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 16px -4px rgba(11, 74, 122, 0.4)';
                e.currentTarget.style.background = '#0B4A7A';
              }
            }}
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : null}
            {loading ? 'Procesando Documento...' : 'Generar Cotización PDF'}
          </button>

          <style>{`
            @keyframes spin { 100% { transform: rotate(360deg); } }
            .animate-spin { animation: spin 1s linear infinite; }
            @keyframes slideDown {
              from { opacity: 0; transform: translateY(-10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>

        {/* Botón para Configuración de Plantillas */}
        <button
          onClick={() => setShowGestor(!showGestor)}
          style={{
            width: '100%', padding: '16px', borderRadius: '12px', fontSize: '15px', fontWeight: '600',
            background: 'transparent', color: '#0B4A7A',
            border: '2px dashed #CBD5E1', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            transition: 'all 0.3s', marginTop: '24px'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0B4A7A'; e.currentTarget.style.backgroundColor = '#F0F9FF'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#CBD5E1'; e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <Settings size={20} />
          Administrar Hojas Membretadas
        </button>

      </div>

      {/* Modal para Gestor de Membretadas */}
      {showGestor && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px',
          animation: 'fadeIn 0.2s ease-out'
        }} onClick={() => setShowGestor(false)}>
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '800px',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: 'transparent',
              animation: 'slideUp 0.3s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón flotante para cerrar el modal */}
            <button
              onClick={() => setShowGestor(false)}
              style={{
                position: 'absolute', top: '15px', right: '15px',
                background: '#F1F5F9', border: 'none', width: '32px', height: '32px',
                borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: '#64748B', zIndex: 10
              }}
            >
              ✕
            </button>
            <GestorMembretadas />
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
