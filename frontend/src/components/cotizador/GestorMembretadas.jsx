import React, { useState, useEffect, useRef } from 'react';
import { UploadCloud, FileText, Trash2, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const GestorMembretadas = () => {
  const [archivos, setArchivos] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null); // Modal state

  const fileInputRef = useRef(null);

  const cargarArchivos = async () => {
    try {
      const response = await fetch(`http://${window.location.hostname}:8000/api/cotizador/membretadas/`);
      const data = await response.json();
      if (data.archivos) {
        setArchivos(data.archivos);
      }
    } catch (error) {
      console.error("Error al cargar archivos:", error);
    }
  };

  useEffect(() => {
    cargarArchivos();
  }, []);

  const handleSubir = async () => {
    if (!file) return toast.error("Selecciona un archivo PDF primero");

    setLoading(true);
    const toastId = toast.loading('Subiendo plantilla...');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`http://${window.location.hostname}:8000/api/cotizador/membretadas/`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.mensaje || 'Plantilla subida con éxito', { id: toastId });
        setFile(null);
        cargarArchivos();
      } else {
        toast.error(`Error: ${data.error}`, { id: toastId });
      }
    } catch (error) {
      toast.error("Error de conexión al subir", { id: toastId });
    }
    setLoading(false);
  };

  const handleEliminar = async (nombre) => {
    setLoading(true);
    const toastId = toast.loading('Eliminando plantilla...');
    try {
      const response = await fetch(`http://${window.location.hostname}:8000/api/cotizador/membretadas/?nombre=${encodeURIComponent(nombre)}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.mensaje || 'Plantilla eliminada', { id: toastId });
        setFileToDelete(null); // Cerrar modal
        cargarArchivos();
      } else {
        toast.error(`Error: ${data.error}`, { id: toastId });
      }
    } catch (error) {
      toast.error("Error de conexión al eliminar", { id: toastId });
    }
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif" }}>
      <h3 style={{ fontSize: '20px', color: '#1C1335', margin: '0 0 8px 0', fontWeight: '700' }}>Repositorio de Plantillas</h3>
      <p style={{ color: '#C084FC', margin: '0 0 24px 0', fontSize: '15px' }}>Sube o elimina tus archivos PDF de diseño base.</p>

      {/* ZONA DE CARGA */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: '#F8FAFC', padding: '32px', borderRadius: '20px', border: '2px dashed #DDD6FE', marginBottom: '40px' }}>

        <input
          type="file"
          accept=".pdf"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={(e) => setFile(e.target.files[0])}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => fileInputRef.current.click()}
            style={{ padding: '14px 24px', backgroundColor: '#F3E8FF', color: '#9333EA', border: '2px solid #DDD6FE', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#E0E7FF'; e.currentTarget.style.borderColor = '#818CF8'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#F3E8FF'; e.currentTarget.style.borderColor = '#DDD6FE'; }}
          >
            <UploadCloud size={20} /> Examinar Archivos...
          </button>

          <span style={{ flex: 1, color: file ? '#9333EA' : '#94A3B8', fontSize: '15px', fontWeight: '600' }}>
            {file ? file.name : 'Ningún archivo PDF seleccionado'}
          </span>

          <button
            onClick={handleSubir}
            disabled={!file || loading}
            style={{ padding: '14px 32px', backgroundColor: (!file || loading) ? '#E2E8F0' : '#9333EA', color: (!file || loading) ? '#94A3B8' : '#FFFFFF', border: 'none', borderRadius: '12px', cursor: (!file || loading) ? 'not-allowed' : 'pointer', fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', boxShadow: (!file || loading) ? 'none' : '0 10px 15px -3px rgba(147, 51, 234, 0.4)' }}
            onMouseEnter={e => { if (file && !loading) e.currentTarget.style.backgroundColor = '#7C3AED'; }}
            onMouseLeave={e => { if (file && !loading) e.currentTarget.style.backgroundColor = '#9333EA'; }}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
            {loading ? 'Subiendo...' : 'Subir Plantilla'}
          </button>
        </div>
      </div>

      {/* LISTA DE ARCHIVOS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1C1335', margin: 0 }}>Archivos Disponibles en Servidor</h3>
        <span style={{ backgroundColor: '#F3E8FF', color: '#9333EA', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '700' }}>{archivos.length} Plantillas</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {archivos.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94A3B8', backgroundColor: '#F8FAFC', borderRadius: '16px' }}>
            No hay plantillas disponibles. Sube una para comenzar.
          </div>
        )}

        {archivos.map((archivo, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', backgroundColor: '#FFFFFF', border: '1px solid #E0E7FF', borderRadius: '16px', transition: 'all 0.2s', boxShadow: '0 4px 6px -4px rgba(0,0,0,0.05)' }} onMouseEnter={e => e.currentTarget.style.borderColor = '#DDD6FE'} onMouseLeave={e => e.currentTarget.style.borderColor = '#E0E7FF'}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ backgroundColor: '#F3E8FF', padding: '12px', borderRadius: '12px', color: '#9333EA' }}><FileText size={24} /></div>
              <span style={{ fontSize: '15px', fontWeight: '600', color: '#7C3AED' }}>{archivo}</span>
            </div>
            <button
              onClick={() => setFileToDelete(archivo)}
              style={{ background: '#FEF2F2', color: '#EF4444', border: 'none', padding: '12px 16px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#FEE2E2'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#FEF2F2'; }}
            >
              <Trash2 size={18} /> <span style={{ fontSize: '14px', fontWeight: '700' }}>Eliminar</span>
            </button>
          </div>
        ))}
      </div>

      {/* MODAL PERSONALIZADO DE CONFIRMACIÓN */}
      {fileToDelete && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '40px', width: '400px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', animation: 'slideUp 0.3s ease-out' }}>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
              <div style={{ backgroundColor: '#FEF2F2', padding: '20px', borderRadius: '50%', color: '#EF4444' }}>
                <AlertCircle size={40} />
              </div>
            </div>

            <h3 style={{ textAlign: 'center', fontSize: '22px', fontWeight: '700', color: '#1C1335', margin: '0 0 12px 0' }}>Confirmar Eliminación</h3>
            <p style={{ textAlign: 'center', color: '#64748B', fontSize: '15px', margin: '0 0 32px 0', lineHeight: '1.5' }}>
              ¿Estás seguro que deseas eliminar la plantilla <strong style={{ color: '#1C1335' }}>{fileToDelete}</strong>? Esta acción no se puede deshacer.
            </p>

            <div style={{ display: 'flex', gap: '16px' }}>
              <button
                onClick={() => setFileToDelete(null)}
                disabled={loading}
                style={{ flex: 1, padding: '16px', borderRadius: '16px', border: '2px solid #E2E8F0', backgroundColor: '#FFFFFF', color: '#475569', fontWeight: '700', fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = '#F8FAFC'; }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
              >
                Cancelar
              </button>

              <button
                onClick={() => handleEliminar(fileToDelete)}
                disabled={loading}
                style={{ flex: 1, padding: '16px', borderRadius: '16px', border: 'none', backgroundColor: '#EF4444', color: '#FFFFFF', fontWeight: '700', fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', transition: 'all 0.2s', boxShadow: '0 10px 15px -3px rgba(239, 68, 68, 0.4)' }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = '#DC2626'; }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.backgroundColor = '#EF4444'; }}
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                {loading ? 'Borrando...' : 'Sí, eliminar'}
              </button>
            </div>

          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default GestorMembretadas;
