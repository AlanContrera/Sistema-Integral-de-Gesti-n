import React, { useState, useEffect } from 'react';
import { CheckCircle, Eye, FileText, Loader2, Building2, FileSpreadsheet } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BandejaAprobacion() {
    const [operaciones, setOperaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [procesandoId, setProcesandoId] = useState(null);

    useEffect(() => {
        fetchOperaciones();
    }, []);

    const fetchOperaciones = async () => {
        try {
            const response = await fetch(`http://${window.location.hostname}:8000/api/cotizador/operaciones-pendientes/`);
            if (!response.ok) throw new Error('Error al cargar datos');
            const data = await response.json();
            setOperaciones(data);
        } catch (error) {
            console.error(error);
            toast.error('Error al cargar la bandeja de aprobación');
        } finally {
            setLoading(false);
        }
    };

    const handleAprobar = async (id, referencia) => {
        setProcesandoId(id);
        const loadingToast = toast.loading(`Aprobando y enviando factura ${referencia}...`);
        try {
            const response = await fetch(`http://${window.location.hostname}:8000/api/cotizador/aprobar-operacion/${id}/`, {
                method: 'POST',
            });
            if (!response.ok) throw new Error('Error al aprobar');
            toast.success('Factura enviada al cliente exitosamente!', { id: loadingToast });
            fetchOperaciones(); // Recargar lista
        } catch (error) {
            console.error(error);
            toast.error('Ocurrió un error al enviar la factura', { id: loadingToast });
        } finally {
            setProcesandoId(null);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#F8FAFC' }}>
                <Loader2 size={40} className="animate-spin" color="#9333EA" />
            </div>
        );
    }

    return (
        <div style={{ padding: '40px', background: '#F8FAFC', minHeight: '100vh', fontFamily: "'Outfit', sans-serif" }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#1C1335', margin: '0 0 8px 0' }}>Bandeja de Aprobación</h1>
                    <p style={{ color: '#64748B', fontSize: '16px', margin: 0 }}>Facturas oficiales recibidas de Monterrey, listas para revisión y envío al cliente final.</p>
                </div>

                {operaciones.length === 0 ? (
                    <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '60px', textAlign: 'center', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)', border: '1px dashed #CBD5E1' }}>
                        <CheckCircle size={60} color="#10B981" style={{ marginBottom: '16px' }} />
                        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1E293B', margin: '0 0 8px 0' }}>¡Bandeja Limpia!</h2>
                        <p style={{ color: '#64748B', fontSize: '16px', margin: 0 }}>No hay facturas pendientes de revisión en este momento.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
                        {operaciones.map((op) => (
                            <div key={op.id} style={{ background: '#FFFFFF', borderRadius: '24px', padding: '24px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', transition: 'transform 0.2s', border: '1px solid #E2E8F0' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <span style={{ background: '#F3E8FF', color: '#9333EA', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px' }}>{op.referencia}</span>

                                </div>

                                <div style={{ marginBottom: '24px' }}>
                                    <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1E293B', margin: '0 0 4px 0' }}>{op.cliente}</h3>
                                    <p style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', fontSize: '14px', margin: 0 }}><Building2 size={14} /> Emisor: {op.empresa_emisora}</p>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC', padding: '16px', borderRadius: '16px', marginBottom: '24px' }}>
                                    <div>
                                        <p style={{ margin: 0, fontSize: '12px', color: '#64748B', fontWeight: '600', textTransform: 'uppercase' }}>Subtotal</p>
                                        <p style={{ margin: 0, fontSize: '16px', color: '#1E293B', fontWeight: '700' }}>${parseFloat(op.subtotal).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ margin: 0, fontSize: '12px', color: '#64748B', fontWeight: '600', textTransform: 'uppercase' }}>Total</p>
                                        <p style={{ margin: 0, fontSize: '20px', color: '#059669', fontWeight: '800' }}>${parseFloat(op.total).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                                    <a href={op.pdf_url} target="_blank" rel="noreferrer" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', background: '#FFF1F2', color: '#E11D48', borderRadius: '12px', textDecoration: 'none', fontWeight: '600', fontSize: '14px', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#FFE4E6'} onMouseLeave={e => e.currentTarget.style.background = '#FFF1F2'}>
                                        <FileText size={16} /> Ver PDF
                                    </a>
                                    <a href={op.xml_url} target="_blank" rel="noreferrer" download style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', background: '#F0FDF4', color: '#16A34A', borderRadius: '12px', textDecoration: 'none', fontWeight: '600', fontSize: '14px', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#DCFCE7'} onMouseLeave={e => e.currentTarget.style.background = '#F0FDF4'}>
                                        <FileSpreadsheet size={16} /> Bajar XML
                                    </a>
                                </div>

                                <button
                                    onClick={() => handleAprobar(op.id, op.referencia)}
                                    disabled={procesandoId === op.id}
                                    style={{ width: '100%', padding: '16px', borderRadius: '12px', background: '#9333EA', color: '#FFFFFF', border: 'none', cursor: procesandoId === op.id ? 'not-allowed' : 'pointer', fontWeight: '700', fontSize: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', transition: 'background 0.2s' }}
                                    onMouseEnter={e => { if (procesandoId !== op.id) e.currentTarget.style.background = '#7C3AED' }}
                                    onMouseLeave={e => { if (procesandoId !== op.id) e.currentTarget.style.background = '#9333EA' }}
                                >
                                    {procesandoId === op.id ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                                    {procesandoId === op.id ? 'Enviando...' : 'Aprobar y Enviar al Cliente'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                @keyframes spin { 100% { transform: rotate(360deg); } }
                .animate-spin { animation: spin 1s linear infinite; }
            `}</style>
        </div>
    );
}
