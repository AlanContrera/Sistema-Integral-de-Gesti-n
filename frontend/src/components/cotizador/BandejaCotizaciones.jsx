import React, { useState, useEffect } from 'react';
import { Eye, Download, Send, RefreshCw, User, Calendar, FileText, Building } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

export default function BandejaCotizaciones() {
    const [prefacturas, setPrefacturas] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPrefacturas = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://${window.location.hostname}:8000/api/cotizador/listar-prefacturas/`);
            if (!response.ok) throw new Error('Error al cargar la bandeja');
            const data = await response.json();
            setPrefacturas(data);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrefacturas();
    }, []);

    const handleGenerarEnviar = async (prefacturaId) => {
        const loadingToast = toast.loading('Generando Cotización y enviando correo...');
        try {
            const response = await fetch(`http://${window.location.hostname}:8000/api/cotizador/generar-cotizacion/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prefactura_id: prefacturaId })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Error al generar cotización');
            toast.success(data.mensaje, { id: loadingToast });
            fetchPrefacturas(); // Refrescar la tabla
        } catch (error) {
            toast.error(error.message, { id: loadingToast });
        }
    };

    const handlePreview = async (datosFormulario) => {
        const nuevaPestana = window.open('', '_blank');
        if (!nuevaPestana) return toast.error('Desactiva el bloqueador de ventanas emergentes.');
        nuevaPestana.document.write('<html><body style="font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f1f5f9; color: #475569;"><h2>Generando vista previa...</h2></body></html>');

        try {
            const response = await fetch(`http://${window.location.hostname}:8000/api/cotizador/preview-cotizacion-pdf/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosFormulario)
            });
            if (!response.ok) throw new Error('Error en la petición');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            nuevaPestana.location.href = url;
        } catch (error) {
            nuevaPestana.close();
            toast.error('Error al generar vista previa');
        }
    };

    const handleDownload = async (datosFormulario, referencia) => {
        const loadingToast = toast.loading('Descargando PDF...');
        try {
            const response = await fetch(`http://${window.location.hostname}:8000/api/cotizador/preview-cotizacion-pdf/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosFormulario)
            });
            if (!response.ok) throw new Error('Error en la petición');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Prefactura_${referencia}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            toast.success('Descarga completada', { id: loadingToast });
        } catch (error) {
            toast.error('Error al descargar', { id: loadingToast });
        }
    };

    return (
        <div style={{ padding: '32px', backgroundColor: '#F8FAFC', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
            <Toaster position="top-right" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0F172A', margin: 0 }}>Bandeja de Cotizaciones</h1>
                    <p style={{ color: '#64748B', margin: '8px 0 0 0', fontSize: '15px' }}>Convierte tus prefacturas guardadas en cotizaciones formales para los clientes.</p>
                </div>
                <button
                    onClick={fetchPrefacturas}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', color: '#475569', fontWeight: '600', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                >
                    <RefreshCw size={18} /> Actualizar
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#64748B' }}>Cargando bandeja...</div>
            ) : (
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                            <tr>
                                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Folio Prefactura</th>
                                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Cliente</th>
                                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Empresa Emisora</th>
                                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Registro</th>
                                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prefacturas.map((pref) => {
                                // Formatear la fecha a la zona horaria de tu computadora y al formato DD/MM/YYYY hh:mm AM/PM
                                const fechaLocal = pref.fecha_creacion
                                    ? new Date(pref.fecha_creacion).toLocaleString('es-MX', {
                                        day: '2-digit', month: '2-digit', year: 'numeric',
                                        hour: '2-digit', minute: '2-digit', hour12: true
                                    })
                                    : 'Sin fecha';

                                return (
                                    <tr key={pref.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                        <td style={{ padding: '20px 24px' }}>
                                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', backgroundColor: '#EFF6FF', color: '#2563EB', borderRadius: '20px', fontSize: '13px', fontWeight: '700' }}>
                                                <FileText size={14} />
                                                {pref.referencia_unica}
                                            </div>
                                        </td>

                                        {/* Nueva Columna: Solo Cliente */}
                                        <td style={{ padding: '20px 24px' }}>
                                            <div style={{ fontWeight: '700', color: '#0F172A', fontSize: '14px' }}>{pref.cliente}</div>
                                        </td>

                                        {/* Nueva Columna: Solo Empresa */}
                                        <td style={{ padding: '20px 24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontSize: '14px' }}>
                                                <Building size={14} color="#94A3B8" /> {pref.empresa_emisora}
                                            </div>
                                        </td>

                                        {/* Columna de Registro (Antes Auditoría) */}
                                        <td style={{ padding: '20px 24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0F172A', fontSize: '13px', marginBottom: '6px', fontWeight: '600' }}>
                                                <User size={14} color="#4F46E5" /> {pref.creado_por}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', fontSize: '13px' }}>
                                                <Calendar size={14} color="#94A3B8" /> {fechaLocal}
                                            </div>
                                        </td>

                                        {/* Acciones */}
                                        <td style={{ padding: '20px 24px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                                <button
                                                    onClick={() => handlePreview(pref.datos_formulario)}
                                                    title="Vista Previa PDF"
                                                    style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDownload(pref.datos_formulario, pref.referencia_unica)}
                                                    title="Descargar Borrador PDF"
                                                    style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                                >
                                                    <Download size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleGenerarEnviar(pref.id)}
                                                    title="Generar Cotización Oficial (Heredar Folio) y Enviar"
                                                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 16px', height: '36px', borderRadius: '8px', background: '#4F46E5', border: 'none', color: '#FFFFFF', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}
                                                >
                                                    <Send size={16} /> Generar y Enviar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}

                            {prefacturas.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '60px', color: '#94A3B8' }}>
                                        No hay prefacturas guardadas en el sistema todavía.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                </div>
            )}
        </div>
    );
}
