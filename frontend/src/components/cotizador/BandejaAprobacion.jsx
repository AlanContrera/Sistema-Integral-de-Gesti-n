import React, { useState, useEffect } from 'react';
import { Eye, Download, Send, Search, CheckCircle2, Building2, FileText, FileSpreadsheet, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function BandejaAprobacion() {
    const [subTab, setSubTab] = useState(() => {
        return localStorage.getItem('bandeja_aprobacion_subtab') || 'llegadas';
    });

    const cambiarSubTab = (tab) => {
        setSubTab(tab);
        localStorage.setItem('bandeja_aprobacion_subtab', tab);
    };

    const [llegadas, setLlegadas] = useState([]);
    const [enviadas, setEnviadas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [procesandoId, setProcesandoId] = useState(null);
    const [busqueda, setBusqueda] = useState('');

    const fetchData = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const [resLlegadas, resEnviadas] = await Promise.all([
                fetch(`http://${window.location.hostname}:8000/api/cotizador/operaciones-pendientes/?estado=llegadas`),
                fetch(`http://${window.location.hostname}:8000/api/cotizador/operaciones-pendientes/?estado=enviadas`)
            ]);

            if (!resLlegadas.ok || !resEnviadas.ok) {
                throw new Error('Error al consultar las facturas de Monterrey');
            }

            const dataLlegadas = await resLlegadas.json();
            const dataEnviadas = await resEnviadas.json();

            setLlegadas(dataLlegadas);
            setEnviadas(dataEnviadas);
        } catch (error) {
            console.error(error);
            if (!silent) toast.error('Error al cargar la bandeja de aprobación');
        } finally {
            if (!silent) setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(() => {
            fetchData(true);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const listaActiva = subTab === 'llegadas' ? llegadas : enviadas;

    const listaFiltrada = listaActiva.filter(op => {
        const termino = busqueda.toLowerCase();
        return (
            (op.referencia || '').toLowerCase().includes(termino) ||
            (op.cliente || '').toLowerCase().includes(termino) ||
            (op.empresa_emisora || '').toLowerCase().includes(termino)
        );
    });

    const handleAprobar = async (id, referencia, pdf_url, soloDescargar = false) => {
        setProcesandoId(id);
        const loadingToast = toast.loading(
            soloDescargar ? `Empaquetando y descargando factura ${referencia}...` : `Aprobando y enviando factura ${referencia}...`
        );
        try {
            const response = await fetch(`http://${window.location.hostname}:8000/api/cotizador/aprobar-operacion/${id}/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ solo_descargar: soloDescargar })
            });

            if (!response.ok) {
                // Si la respuesta no es OK, tratamos de leer el error JSON
                const errData = await response.json();
                throw new Error(errData.error || 'Error al procesar la operación');
            }

            if (soloDescargar) {
                // El backend nos devolvió un archivo ZIP directamente
                const blob = await response.blob();
                const blobUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = `${referencia}_Archivos.zip`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(blobUrl);

                toast.success('Archivos descargados exitosamente!', { id: loadingToast });
            } else {
                // El backend nos devolvió un mensaje JSON normal
                const data = await response.json();
                toast.success(data.mensaje || 'Proceso completado exitosamente!', { id: loadingToast });
            }

            fetchData();

        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Ocurrió un error', { id: loadingToast });
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
                    <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#1C1335', margin: '0 0 8px 0' }}></h1>
                    <p style={{ color: '#64748B', fontSize: '16px', margin: 0 }}></p>
                </div>

                {/* Sub-Tabs y Buscador */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', background: '#FFFFFF', padding: '8px 16px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={() => cambiarSubTab('llegadas')}
                            style={{
                                padding: '10px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px',
                                background: subTab === 'llegadas' ? '#9333EA' : 'transparent',
                                color: subTab === 'llegadas' ? '#FFFFFF' : '#64748B'
                            }}
                        >
                            <ArrowRight size={16} /> Llegadas de MTY
                            <span style={{ background: subTab === 'llegadas' ? 'rgba(255,255,255,0.2)' : '#F1F5F9', color: subTab === 'llegadas' ? '#FFF' : '#475569', padding: '2px 8px', borderRadius: '10px', fontSize: '12px' }}>{llegadas.length}</span>
                        </button>
                        <button
                            onClick={() => cambiarSubTab('enviadas')}
                            style={{
                                padding: '10px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px',
                                background: subTab === 'enviadas' ? '#9333EA' : 'transparent',
                                color: subTab === 'enviadas' ? '#FFFFFF' : '#64748B'
                            }}
                        >
                            <CheckCircle2 size={16} /> Historial (Enviadas)
                            <span style={{ background: subTab === 'enviadas' ? 'rgba(255,255,255,0.2)' : '#F1F5F9', color: subTab === 'enviadas' ? '#FFF' : '#475569', padding: '2px 8px', borderRadius: '10px', fontSize: '12px' }}>{enviadas.length}</span>
                        </button>
                    </div>

                    <div style={{ position: 'relative', width: '300px' }}>
                        <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            type="text"
                            placeholder="Buscar factura o cliente..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
                        />
                    </div>
                </div>

                {/* Tabla */}
                <div style={{ background: '#FFFFFF', borderRadius: '20px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
                                    <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Referencia</th>
                                    <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cliente / Emisor</th>
                                    <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Importes</th>
                                    <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>Archivos</th>
                                    <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listaFiltrada.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
                                            No hay registros para mostrar en esta vista.
                                        </td>
                                    </tr>
                                ) : (
                                    listaFiltrada.map((op) => (
                                        <tr key={op.id} style={{ borderBottom: '1px solid #E2E8F0', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                            <td style={{ padding: '20px 24px' }}>
                                                <div style={{ background: '#F3E8FF', color: '#9333EA', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', display: 'inline-block' }}>
                                                    {op.referencia}
                                                </div>
                                                <div style={{ fontSize: '12px', color: '#64748B', marginTop: '6px' }}>{op.fecha}</div>
                                            </td>

                                            <td style={{ padding: '20px 24px' }}>
                                                <div style={{ fontWeight: '700', color: '#1E293B', fontSize: '15px' }}>{op.cliente}</div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
                                                    <Building2 size={12} /> {op.empresa_emisora}
                                                </div>
                                                {!op.tiene_correo && (
                                                    <span style={{ display: 'inline-block', marginTop: '6px', fontSize: '11px', background: '#FEE2E2', color: '#EF4444', padding: '2px 6px', borderRadius: '6px', fontWeight: '600' }}>
                                                        Sin Correo Registrado
                                                    </span>
                                                )}
                                            </td>

                                            <td style={{ padding: '20px 24px' }}>
                                                <div style={{ fontSize: '12px', color: '#64748B' }}>Sub: ${parseFloat(op.subtotal).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                                                <div style={{ fontWeight: '800', color: '#059669', fontSize: '16px' }}>Tot: ${parseFloat(op.total).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                                            </td>

                                            <td style={{ padding: '20px 24px', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                                    <a href={op.pdf_url} target="_blank" rel="noreferrer" title="Ver PDF" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', background: '#FFF1F2', color: '#E11D48', borderRadius: '10px', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#FFE4E6'} onMouseLeave={e => e.currentTarget.style.background = '#FFF1F2'}>
                                                        <FileText size={18} />
                                                    </a>
                                                    <a href={op.xml_url} target="_blank" rel="noreferrer" download title="Bajar XML" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', background: '#F0FDF4', color: '#16A34A', borderRadius: '10px', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#DCFCE7'} onMouseLeave={e => e.currentTarget.style.background = '#F0FDF4'}>
                                                        <FileSpreadsheet size={18} />
                                                    </a>
                                                </div>
                                            </td>

                                            <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                                                {subTab === 'llegadas' ? (
                                                    op.tiene_correo ? (
                                                        <button
                                                            onClick={() => handleAprobar(op.id, op.referencia, op.pdf_url, false)}
                                                            disabled={procesandoId === op.id}
                                                            style={{ padding: '10px 16px', borderRadius: '10px', background: '#9333EA', color: '#FFFFFF', border: 'none', cursor: procesandoId === op.id ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'background 0.2s' }}
                                                            onMouseEnter={e => { if (procesandoId !== op.id) e.currentTarget.style.background = '#7C3AED' }}
                                                            onMouseLeave={e => { if (procesandoId !== op.id) e.currentTarget.style.background = '#9333EA' }}
                                                        >
                                                            {procesandoId === op.id ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                                            Aprobar y Enviar
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleAprobar(op.id, op.referencia, op.pdf_url, true)}
                                                            disabled={procesandoId === op.id}
                                                            style={{ padding: '10px 16px', borderRadius: '10px', background: '#F59E0B', color: '#FFFFFF', border: 'none', cursor: procesandoId === op.id ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'background 0.2s' }}
                                                            onMouseEnter={e => { if (procesandoId !== op.id) e.currentTarget.style.background = '#D97706' }}
                                                            onMouseLeave={e => { if (procesandoId !== op.id) e.currentTarget.style.background = '#F59E0B' }}
                                                        >
                                                            {procesandoId === op.id ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                                                            Solo Descargar
                                                        </button>
                                                    )
                                                ) : (
                                                    <span style={{ color: '#10B981', fontWeight: '700', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                                                        <CheckCircle2 size={16} /> Procesado
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes spin { 100% { transform: rotate(360deg); } }
                .animate-spin { animation: spin 1s linear infinite; }
            `}</style>
        </div>
    );
}
