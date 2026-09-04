import React, { useState, useEffect } from 'react';
import { Eye, Download, Send, RefreshCw, User, Calendar, FileText, Building, Clock, Search, CheckCircle2, ArrowRight } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

export default function BandejaCotizaciones() {
    const [subTab, setSubTab] = useState(() => {
        return localStorage.getItem('bandeja_cotizaciones_subtab') || 'por_enviar';
    });

    const cambiarSubTab = (tab) => {
        setSubTab(tab);
        localStorage.setItem('bandeja_cotizaciones_subtab', tab);
    }; // 'por_enviar' | 'enviadas'
    const [pendientes, setPendientes] = useState([]);
    const [enviadas, setEnviadas] = useState([]);
    const [loading, setLoading] = useState(true);

    const [busquedaEnviadas, setBusquedaEnviadas] = useState('');

    const enviadasFiltradas = enviadas.filter(cot => {
        const termino = busquedaEnviadas.toLowerCase();
        const folio = (cot.referencia_unica || '').toLowerCase();
        const folioOrigen = (cot.folio_prefactura || '').toLowerCase();
        const cliente = (cot.cliente || '').toLowerCase();
        const empresa = (cot.empresa_emisora || '').toLowerCase();
        const enviadoPor = (cot.enviado_por || '').toLowerCase();

        return folio.includes(termino) ||
            folioOrigen.includes(termino) ||
            cliente.includes(termino) ||
            empresa.includes(termino) ||
            enviadoPor.includes(termino);
    });


    const fetchData = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const [resPendientes, resEnviadas] = await Promise.all([
                fetch(`http://${window.location.hostname}:8000/api/cotizador/listar-prefacturas/?estado=por_enviar`),
                fetch(`http://${window.location.hostname}:8000/api/cotizador/listar-prefacturas/?estado=enviadas`)
            ]);

            if (!resPendientes.ok || !resEnviadas.ok) {
                throw new Error('Error al consultar las cotizaciones');
            }

            const dataPendientes = await resPendientes.json();
            const dataEnviadas = await resEnviadas.json();

            setPendientes(dataPendientes);
            setEnviadas(dataEnviadas);
        } catch (error) {
            if (!silent) toast.error(error.message);
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

    const handleGenerarEnviar = async (prefacturaId) => {
        const loadingToast = toast.loading('Generando Cotización y enviando correo...');
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`http://${window.location.hostname}:8000/api/cotizador/generar-cotizacion/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ prefactura_id: prefacturaId })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Error al generar cotización');

            toast.success(data.mensaje, { id: loadingToast });
            fetchData(); // Refresca ambas listas
        } catch (error) {
            toast.error(error.message, { id: loadingToast });
        }
    };

    const handleGenerarDescargar = async (prefacturaId) => {
        const loadingToast = toast.loading('Generando Folio Oficial...');
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`http://${window.location.hostname}:8000/api/cotizador/generar-cotizacion/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ prefactura_id: prefacturaId, solo_descargar: true })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Error al generar cotización');

            toast.success(data.mensaje, { id: loadingToast });
            fetchData(); // Refresca ambas listas

            // Llamamos a tu función nativa de descarga con la info actualizada
            handleDownload(data.datos_formulario, data.referencia_unica);

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
            link.setAttribute('download', `Cotizacion_${referencia}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            toast.success('Descarga completada', { id: loadingToast });
        } catch (error) {
            toast.error('Error al descargar', { id: loadingToast });
        }
    };

    return (
        <div className="bandeja-cotizaciones-container" style={{ backgroundColor: 'transparent', width: '100%', fontFamily: "'Inter', sans-serif" }}>
            <Toaster position="top-right" />

            {/* Cabecera Principal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0F172A', margin: 0 }}>Bandeja de Cotizaciones</h1>
                    <p style={{ color: '#64748B', margin: '8px 0 0 0', fontSize: '15px' }}>
                        Gestiona las prefacturas pendientes y consulta el histórico de cotizaciones enviadas a clientes.
                    </p>
                </div>
                <button
                    onClick={fetchData}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', color: '#475569', fontWeight: '600', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', transition: 'background-color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                >
                    <RefreshCw size={18} /> Actualizar
                </button>
            </div>

            {/* Sub-pestañas y Buscador */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '8px', backgroundColor: '#F1F5F9', padding: '6px', borderRadius: '14px', width: 'fit-content' }}>
                    <button
                        onClick={() => cambiarSubTab('por_enviar')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 20px',
                            borderRadius: '10px',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: '700',
                            fontSize: '14px',
                            transition: 'all 0.2s',
                            backgroundColor: subTab === 'por_enviar' ? '#9333EA' : 'transparent',
                            color: subTab === 'por_enviar' ? '#FFFFFF' : '#64748B',
                            boxShadow: subTab === 'por_enviar' ? '0 4px 12px rgba(147, 51, 234, 0.2)' : 'none'
                        }}
                    >
                        <Clock size={16} />
                        Por Enviar
                        <span style={{
                            backgroundColor: subTab === 'por_enviar' ? '#FFFFFF' : '#E2E8F0',
                            color: subTab === 'por_enviar' ? '#9333EA' : '#475569',
                            padding: '2px 8px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '800'
                        }}>
                            {pendientes.length}
                        </span>
                    </button>

                    <button
                        onClick={() => cambiarSubTab('enviadas')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 20px',
                            borderRadius: '10px',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: '700',
                            fontSize: '14px',
                            transition: 'all 0.2s',
                            backgroundColor: subTab === 'enviadas' ? '#9333EA' : 'transparent',
                            color: subTab === 'enviadas' ? '#FFFFFF' : '#64748B',
                            boxShadow: subTab === 'enviadas' ? '0 4px 12px rgba(147, 51, 234, 0.2)' : 'none'
                        }}
                    >
                        <Send size={16} />
                        Enviadas
                        <span style={{
                            backgroundColor: subTab === 'enviadas' ? '#FFFFFF' : '#E2E8F0',
                            color: subTab === 'enviadas' ? '#9333EA' : '#475569',
                            padding: '2px 8px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '800'
                        }}>
                            {enviadas.length}
                        </span>
                    </button>
                </div>

                {/* Buscador interactivo solo en pestaña Enviadas */}
                {subTab === 'enviadas' && (
                    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '12px', padding: '8px 16px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <Search size={18} color="#64748B" />
                        <input
                            type="text"
                            placeholder="Buscar por folio, cliente, empresa o remitente..."
                            value={busquedaEnviadas}
                            onChange={(e) => setBusquedaEnviadas(e.target.value)}
                            style={{ border: 'none', outline: 'none', marginLeft: '10px', fontSize: '13px', width: '320px', color: '#1E293B' }}
                        />
                    </div>
                )}
            </div>


            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#64748B' }}>Cargando información...</div>
            ) : (
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflowX: 'auto', WebkitOverflowScrolling: 'touch', border: '1px solid #E2E8F0' }}>

                    {/* VISTA 1: COTIZACIONES POR ENVIAR (PREFACTURAS PENDIENTES) */}
                    {subTab === 'por_enviar' && (
                        <table style={{ width: '100%', minWidth: '760px', borderCollapse: 'collapse', textAlign: 'left' }}>
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
                                {pendientes.map((pref) => {
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

                                            <td style={{ padding: '20px 24px' }}>
                                                <div style={{ fontWeight: '700', color: '#0F172A', fontSize: '14px' }}>{pref.cliente}</div>
                                            </td>

                                            <td style={{ padding: '20px 24px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontSize: '14px' }}>
                                                    <Building size={14} color="#94A3B8" /> {pref.empresa_emisora}
                                                </div>
                                            </td>

                                            <td style={{ padding: '20px 24px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0F172A', fontSize: '13px', marginBottom: '6px', fontWeight: '600' }}>
                                                    <User size={14} color="#9333EA" /> {pref.creado_por}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', fontSize: '13px' }}>
                                                    <Calendar size={14} color="#94A3B8" /> {fechaLocal}
                                                </div>
                                            </td>

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

                                                    {/* Evaluamos si tiene correo válido. Si tiene, mostramos Enviar. Si no, Descargar Oficial */}
                                                    {pref.datos_formulario?.receptor_correo || pref.datos_formulario?.correo_receptor ? (
                                                        <button
                                                            onClick={() => handleGenerarEnviar(pref.id)}
                                                            title="Generar Cotización Oficial (Heredar Folio) y Enviar"
                                                            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 16px', height: '36px', borderRadius: '8px', background: '#9333EA', border: 'none', color: '#FFFFFF', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}
                                                        >
                                                            <Send size={16} /> Generar y Enviar
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleGenerarDescargar(pref.id)}
                                                            title="Generar Cotización Oficial y Descargar"
                                                            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 16px', height: '36px', borderRadius: '8px', background: '#64748B', border: 'none', color: '#FFFFFF', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}
                                                        >
                                                            <Download size={16} /> Generar y Descargar
                                                        </button>
                                                    )}

                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}

                                {pendientes.length === 0 && (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '60px', color: '#94A3B8' }}>
                                            No hay cotizaciones pendientes por enviar.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}

                    {/* VISTA 2: COTIZACIONES YA ENVIADAS */}
                    {subTab === 'enviadas' && (
                        <table style={{ width: '100%', minWidth: '760px', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                                <tr>
                                    <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Folio Oficial</th>
                                    <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Cliente</th>
                                    <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Empresa Emisora</th>
                                    <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Enviado Por</th>
                                    <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {enviadasFiltradas.map((cot) => {
                                    const fechaEnvioLocal = cot.fecha_envio
                                        ? new Date(cot.fecha_envio).toLocaleString('es-MX', {
                                            day: '2-digit', month: '2-digit', year: 'numeric',
                                            hour: '2-digit', minute: '2-digit', hour12: true
                                        })
                                        : 'Sin fecha';

                                    return (
                                        <tr key={cot.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                            <td style={{ padding: '20px 24px' }}>
                                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', backgroundColor: '#ECFDF5', color: "#9333EA", borderRadius: '20px', fontSize: '13px', fontWeight: '700' }}>
                                                    <CheckCircle2 size={14} />
                                                    {cot.referencia_unica}
                                                </div>
                                                {cot.folio_prefactura && cot.folio_prefactura !== 'N/A' && (
                                                    <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                                                        Origen: <span style={{ fontWeight: '600' }}>{cot.folio_prefactura}</span>
                                                    </div>
                                                )}
                                            </td>

                                            <td style={{ padding: '20px 24px' }}>
                                                <div style={{ fontWeight: '700', color: '#0F172A', fontSize: '14px' }}>{cot.cliente}</div>
                                            </td>

                                            <td style={{ padding: '20px 24px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontSize: '14px' }}>
                                                    <Building size={14} color="#94A3B8" /> {cot.empresa_emisora}
                                                </div>
                                            </td>

                                            {/* Columna Quien la Envio */}
                                            <td style={{ padding: '20px 24px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0F172A', fontSize: '13px', marginBottom: '6px', fontWeight: '600' }}>
                                                    <User size={14} color="#9333EA" /> {cot.enviado_por}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', fontSize: '13px' }}>
                                                    <Calendar size={14} color="#94A3B8" /> {fechaEnvioLocal}
                                                </div>
                                            </td>

                                            <td style={{ padding: '20px 24px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                                    <button
                                                        onClick={() => handlePreview(cot.datos_formulario)}
                                                        title="Vista Previa PDF Oficial"
                                                        style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDownload(cot.datos_formulario, cot.referencia_unica)}
                                                        title="Descargar PDF Oficial"
                                                        style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                                    >
                                                        <Download size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}

                                {enviadasFiltradas.length === 0 && (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '60px', color: '#94A3B8' }}>
                                            {busquedaEnviadas ? 'No se encontraron cotizaciones con ese criterio de búsqueda.' : 'Aún no hay cotizaciones enviadas registradas.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            <style>{`
        @media (max-width: 768px) {
          .bandeja-header-flex {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 14px !important;
          }
          .bandeja-search-box {
            width: 100% !important;
          }
          .bandeja-search-box input {
            width: 100% !important;
          }
        }
      `}</style>

        </div>
    );
}
