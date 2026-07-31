import React, { useState, useEffect } from 'react';

const GestorMembretadas = () => {
  const [archivos, setArchivos] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');

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

  const handleSubir = async (e) => {
    e.preventDefault();
    if (!file) return;
    
    setLoading(true);
    setMensaje('');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`http://${window.location.hostname}:8000/api/cotizador/membretadas/`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setMensaje(data.mensaje);
        setFile(null);
        cargarArchivos();
      } else {
        setMensaje(`Error: ${data.error}`);
      }
    } catch (error) {
      setMensaje("Error de conexión al subir");
    }
    setLoading(false);
  };

  const handleEliminar = async (nombre) => {
    if (!window.confirm(`¿Seguro que deseas eliminar ${nombre}?`)) return;
    
    setLoading(true);
    setMensaje('');
    try {
      const response = await fetch(`http://${window.location.hostname}:8000/api/cotizador/membretadas/?nombre=${encodeURIComponent(nombre)}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (response.ok) {
        setMensaje(data.mensaje);
        cargarArchivos();
      } else {
        setMensaje(`Error: ${data.error}`);
      }
    } catch (error) {
      setMensaje("Error de conexión al eliminar");
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Gestor de Hojas Membretadas</h2>
        <p>Sube o elimina tus archivos PDF de plantillas directamente en el servidor.</p>
        
        <form onSubmit={handleSubir} className="upload-form">
          <input 
            type="file" 
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button type="submit" disabled={!file || loading} className="btn-primary">
            {loading ? 'Subiendo...' : 'Subir PDF'}
          </button>
        </form>

        {mensaje && <div className="alert">{mensaje}</div>}

        <h3>Archivos Disponibles ({archivos.length})</h3>
        <ul className="file-list">
          {archivos.map((archivo, index) => (
            <li key={index} className="file-item">
              <span>📄 {archivo}</span>
              <button 
                onClick={() => handleEliminar(archivo)}
                disabled={loading}
                className="btn-danger"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        .container { max-width: 800px; margin: 40px auto; font-family: system-ui; }
        .card { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .upload-form { display: flex; gap: 15px; margin: 20px 0; padding: 20px; background: #f8fafc; border-radius: 8px; border: 1px dashed #cbd5e1; }
        .btn-primary { background: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; }
        .btn-primary:disabled { background: #94a3b8; cursor: not-allowed; }
        .btn-danger { background: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; }
        .btn-danger:hover { background: #dc2626; }
        .alert { padding: 10px; background: #dcfce3; color: #166534; border-radius: 6px; margin-bottom: 20px; }
        .file-list { list-style: none; padding: 0; }
        .file-item { display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid #e2e8f0; }
        .file-item:last-child { border-bottom: none; }
      `}</style>
    </div>
  );
};

export default GestorMembretadas;
