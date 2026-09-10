import React, { useState, useRef } from 'react';
import {
    X, UploadCloud, FileSpreadsheet, Calendar, AlertTriangle,
    CheckCircle2, Send, Download, Loader2, Building2, User, Mail, Eye,
    Database, FileText, Info
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function GenerarCotizacionExcelModal({ isOpen, onClose, onSuccess }) {
    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [loadingAnalysis, setLoadingAnalysis] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [loadingPreview, setLoadingPreview] = useState(false);

    const [fechaOperacion, setFechaOperacion] = useState(new Date().toISOString().split('T')[0]);
    const [analysis, setAnalysis] = useState(null);

    // Decisiones de cliente cuando no hace match
    const [tipoCliente, setTipoCliente] = useState('catalogo'); // 'catalogo' | 'unica_operacion'
    const [correoManual, setCorreoManual] = useState('');

    if (!isOpen) return null;

    const resetModal = () => {
        setFile(null);
        setAnalysis(null);
        setCorreoManual('');
        setTipoCliente('catalogo');
        setLoadingAnalysis(false);
        setGenerating(false);
        setLoadingPreview(false);
        onClose();
    };

    const handleFile = async (selectedFile) => {
        if (!selectedFile) return;
        if (!selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
            return toast.error('El archivo debe ser un Excel (.xlsx, .xls)');
        }

        setFile(selectedFile);
        setLoadingAnalysis(true);
        const loadingToast = toast.loading('Analizando archivo Excel...');

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const res = await fetch(`http://${window.location.hostname}:8000/api/cotizador/analizar-excel/`, {
                method: 'POST',
                body: formData
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al analizar el archivo');

            setAnalysis(data);
            if (data.cliente?.correo) {
                setCorreoManual(data.cliente.correo);
            } else {
                setCorreoManual('');
            }
            toast.success('Documento analizado correctamente', { id: loadingToast });
        } catch (error) {
            toast.error(error.message, { id: loadingToast });
            setFile(null);
            setAnalysis(null);
        } finally {
            setLoadingAnalysis(false);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault(); e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
        else if (e.type === "dragleave") setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault(); e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handlePreview = async () => {
        if (!file || !analysis) return toast.error('Debes subir y analizar un archivo primero');
        if (!analysis.empresa_emisora?.id) {
            return toast.error('No se pudo identificar la empresa emisora');
        }

        const nuevaPestana = window.open('', '_blank');
        if (!nuevaPestana) {
            return toast.error('Por favor permite las ventanas emergentes en tu navegador para ver la vista previa');
        }

        nuevaPestana.document.write('<html><body style="font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #F8FAFC; color: #64748B;"><h2>Generando vista previa del PDF... Por favor espera.</h2></body></html>');

        setLoadingPreview(true);
        const loadingToast = toast.loading('Generando vista previa...');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('empresa_id', analysis.empresa_emisora.id);
        formData.append('fecha', fechaOperacion);

        try {
            const res = await fetch(`http://${window.location.hostname}:8000/api/cotizador/generar/`, {
                method: 'POST',
                body: formData
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || 'Error al generar la vista previa del PDF');
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            nuevaPestana.location.href = url;
            toast.dismiss(loadingToast);
        } catch (error) {
            nuevaPestana.close();
            toast.error(error.message, { id: loadingToast });
        } finally {
            setLoadingPreview(false);
        }
    };

    const handleGenerar = async () => {
        if (!file || !analysis) return toast.error('Debes subir y analizar un archivo primero');
        if (!analysis.empresa_emisora?.id) {
            return toast.error('No se pudo identificar la empresa emisora en el sistema');
        }

        setGenerating(true);
        const accionTexto = correoManual.trim() && analysis.empresa_emisora?.tiene_correo ? 'Generando y enviando...' : 'Generando cotización...';
        const loadingToast = toast.loading(accionTexto);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('fecha', fechaOperacion);
        formData.append('empresa_id', analysis.empresa_emisora.id);
        formData.append('tipo_cliente', tipoCliente);
        formData.append('cliente_id', analysis.cliente?.id || '');
        formData.append('correo_cliente', correoManual.trim());
        formData.append('cliente_data', JSON.stringify(analysis.cliente?.datos_excel || {}));

        try {
            const token = localStorage.getItem('access_token');
            const res = await fetch(`http://${window.location.hostname}:8000/api/cotizador/generar-desde-excel/`, {
                method: 'POST',
                headers: {
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: formData
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al generar la cotización');

            if (data.accion === 'enviado') {
                toast.success(data.mensaje || `Cotización ${data.folio} enviada por correo`, { id: loadingToast });
            } else if (data.accion === 'descargado' && data.pdf_base64) {
                const byteCharacters = atob(data.pdf_base64);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Cotizacion_${data.folio}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                toast.success(`Cotización ${data.folio} descargada con éxito`, { id: loadingToast });
            }

            if (onSuccess) onSuccess();
            resetModal();
        } catch (error) {
            toast.error(error.message, { id: loadingToast });
        } finally {
            setGenerating(false);
        }
    };

    const hayCorreoDestino = Boolean(correoManual.trim());
    const empresaPuedeEnviar = Boolean(analysis?.empresa_emisora?.tiene_correo);
    const enviaraPorCorreo = hayCorreoDestino && empresaPuedeEnviar;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 99999, padding: '24px'
        }}>
            <div style={{
                backgroundColor: '#FFFFFF', borderRadius: '28px',
                width: '100%', maxWidth: '820px', maxHeight: '92vh',
                display: 'flex', flexDirection: 'column',
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3)',
                overflow: 'hidden', border: '1px solid #E2E8F0'
            }}>
                {/* Header con aire y elegancia */}
                <div style={{
                    padding: '24px 32px', borderBottom: '1px solid #F1F5F9',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: 'linear-gradient(135deg, #FAF5FF 0%, #FFFFFF 100%)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: '#F3E8FF', color: '#9333EA', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(147,51,234,0.12)' }}>
                            <FileSpreadsheet size={24} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.4px' }}>
                                Generar Cotización desde Excel
                            </h3>
                            <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#64748B' }}>
                                Procesa tu archivo y despacha o descarga la cotización oficial.
                            </p>
                        </div>
                    </div>
                    <button onClick={resetModal} style={{ background: '#F1F5F9', border: 'none', borderRadius: '12px', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B', transition: 'background-color 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#E2E8F0'} onMouseLeave={e => e.currentTarget.style.backgroundColor = '#F1F5F9'}>
                        <X size={18} />
                    </button>
                </div>

                {/* Contenido con Scroll y espacios amplios */}
                <div style={{ padding: '28px 32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '22px' }}>

                    {/* Fila 1: Archivo y Fecha en paralelo */}
                    {!file ? (
                        <div
                            onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                                border: `2px dashed ${dragActive ? '#9333EA' : '#CBD5E1'}`,
                                backgroundColor: dragActive ? '#FAF5FF' : '#F8FAFC',
                                borderRadius: '20px', padding: '44px 24px',
                                textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s'
                            }}
                        >
                            <input ref={fileInputRef} type="file" accept=".xlsx, .xls" onChange={e => e.target.files && handleFile(e.target.files[0])} style={{ display: 'none' }} />
                            <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#F3E8FF', color: '#9333EA', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                                {loadingAnalysis ? <Loader2 size={30} className="animate-spin" /> : <UploadCloud size={30} />}
                            </div>
                            <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: '700', color: '#0F172A' }}>
                                {loadingAnalysis ? 'Analizando archivo Excel...' : 'Arrastra tu archivo Excel aquí o haz clic para seleccionarlo'}
                            </h4>
                            <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>Compatible con formatos .xlsx o .xls con hoja de facturación 4.0</p>
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '14px', alignItems: 'center'
                        }}>
                            {/* Pastilla de Archivo Cargado */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', backgroundColor: '#FAF5FF', border: '1px solid #DDD6FE', borderRadius: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                                    <FileSpreadsheet size={24} color="#9333EA" style={{ flexShrink: 0 }} />
                                    <div style={{ minWidth: 0, overflow: 'hidden' }}>
                                        <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#1E293B', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{file.name}</p>
                                        <span style={{ fontSize: '12px', color: '#64748B' }}>{(file.size / 1024).toFixed(1)} KB</span>
                                    </div>
                                </div>
                                <button onClick={() => { setFile(null); setAnalysis(null); }} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '13px', fontWeight: '600', flexShrink: 0, marginLeft: '10px' }}>
                                    Cambiar
                                </button>
                            </div>

                            {/* Selector de Fecha de Emisión */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', backgroundColor: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                                <span style={{ fontSize: '13px', fontWeight: '700', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Calendar size={16} color="#9333EA" /> Emisión:
                                </span>
                                <input
                                    type="date"
                                    value={fechaOperacion}
                                    onChange={e => setFechaOperacion(e.target.value)}
                                    style={{ border: 'none', outline: 'none', fontSize: '14px', color: '#0F172A', fontWeight: '700', backgroundColor: 'transparent', cursor: 'pointer' }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Contenido cuando el análisis está listo */}
                    {analysis && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                            {/* BANNERS DE ADVERTENCIA (Si faltan) */}
                            {(!analysis.empresa_emisora?.tiene_membretada || !analysis.empresa_emisora?.tiene_correo) && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {!analysis.empresa_emisora?.tiene_membretada && (
                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '12px 16px', backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '12px', color: '#B45309', fontSize: '13px' }}>
                                            <AlertTriangle size={18} style={{ flexShrink: 0 }} />
                                            <span><strong>Plantilla Membretada:</strong> {analysis.empresa_emisora?.alerta_membretada}</span>
                                        </div>
                                    )}
                                    {!analysis.empresa_emisora?.tiene_correo && (
                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '12px 16px', backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '12px', color: '#B45309', fontSize: '13px' }}>
                                            <AlertTriangle size={18} style={{ flexShrink: 0 }} />
                                            <span><strong>Correo Emisor SMTP:</strong> {analysis.empresa_emisora?.alerta_correo} (Se descargará en PDF).</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Fila 2: EMISOR Y RECEPTOR EN PARALELO (2 Columnas) */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

                                {/* Tarjeta: Empresa Emisora */}
                                <div style={{ padding: '18px 20px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                                            Empresa Emisora
                                        </span>
                                        {analysis.empresa_emisora?.match ? (
                                            <span style={{ fontSize: '11px', fontWeight: '700', color: '#059669', backgroundColor: '#ECFDF5', padding: '3px 10px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <CheckCircle2 size={12} /> En catálogo
                                            </span>
                                        ) : (
                                            <span style={{ fontSize: '11px', fontWeight: '700', color: '#DC2626', backgroundColor: '#FEF2F2', padding: '3px 10px', borderRadius: '20px' }}>
                                                No registrada
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9333EA', flexShrink: 0 }}>
                                            <Building2 size={18} />
                                        </div>
                                        <div style={{ minWidth: 0 }}>
                                            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0F172A', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                                {analysis.empresa_emisora?.nombre}
                                            </h4>
                                        </div>
                                    </div>
                                </div>

                                {/* Tarjeta: Cliente Receptor */}
                                <div style={{ padding: '18px 20px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '18px', display: 'flex', flexDirection: 'column', gap: '10px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                                            Cliente Receptor
                                        </span>
                                        {analysis.cliente?.match ? (
                                            <span style={{ fontSize: '11px', fontWeight: '700', color: '#059669', backgroundColor: '#ECFDF5', padding: '3px 10px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <CheckCircle2 size={12} /> Registrado
                                            </span>
                                        ) : (
                                            <span style={{ fontSize: '11px', fontWeight: '700', color: '#D97706', backgroundColor: '#FEF3C7', padding: '3px 10px', borderRadius: '20px' }}>
                                                Cliente Nuevo
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#FAF5FF', border: '1px solid #DDD6FE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9333EA', flexShrink: 0 }}>
                                            <User size={18} />
                                        </div>
                                        <div style={{ minWidth: 0 }}>
                                            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0F172A', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                                {analysis.cliente?.nombre}
                                            </h4>
                                            {analysis.cliente?.datos_excel?.rfc && (
                                                <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '600' }}>
                                                    RFC: {analysis.cliente.datos_excel.rfc}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* Fila 3: Opciones si es Cliente Nuevo */}
                            {!analysis.cliente?.match && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>
                                        ¿Cómo deseas procesar a este cliente nuevo?
                                    </span>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <div
                                            onClick={() => setTipoCliente('catalogo')}
                                            style={{
                                                display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px 16px',
                                                borderRadius: '14px', border: `1.5px solid ${tipoCliente === 'catalogo' ? '#9333EA' : '#E2E8F0'}`,
                                                backgroundColor: tipoCliente === 'catalogo' ? '#FAF5FF' : '#FFFFFF',
                                                cursor: 'pointer', transition: 'all 0.2s'
                                            }}
                                        >
                                            <Database size={20} color={tipoCliente === 'catalogo' ? '#9333EA' : '#94A3B8'} style={{ marginTop: '2px', flexShrink: 0 }} />
                                            <div>
                                                <div style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A' }}>Guardar en Catálogo</div>
                                                <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>Se registrará en el sistema para futuras operaciones.</div>
                                            </div>
                                        </div>

                                        <div
                                            onClick={() => setTipoCliente('unica_operacion')}
                                            style={{
                                                display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px 16px',
                                                borderRadius: '14px', border: `1.5px solid ${tipoCliente === 'unica_operacion' ? '#9333EA' : '#E2E8F0'}`,
                                                backgroundColor: tipoCliente === 'unica_operacion' ? '#FAF5FF' : '#FFFFFF',
                                                cursor: 'pointer', transition: 'all 0.2s'
                                            }}
                                        >
                                            <FileText size={20} color={tipoCliente === 'unica_operacion' ? '#9333EA' : '#94A3B8'} style={{ marginTop: '2px', flexShrink: 0 }} />
                                            <div>
                                                <div style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A' }}>Operación Única</div>
                                                <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>Solo para esta cotización sin crear ficha de cliente.</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Fila 4: Correo Electrónico con Indicador Inteligente */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>
                                    Correo Electrónico de Destino (Opcional):
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={18} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '14px' }} />
                                    <input
                                        type="email"
                                        placeholder="correo@cliente.com"
                                        value={correoManual}
                                        onChange={e => setCorreoManual(e.target.value)}
                                        style={{
                                            width: '100%', padding: '12px 16px 12px 46px',
                                            borderRadius: '14px', border: '1px solid #CBD5E1',
                                            fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                                            backgroundColor: '#F8FAFC', color: '#0F172A', fontWeight: '600'
                                        }}
                                    />
                                </div>
                                <div style={{ fontSize: '12px', color: enviaraPorCorreo ? '#059669' : '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    {enviaraPorCorreo ? (
                                        <>
                                            <CheckCircle2 size={14} color="#059669" />
                                            Se enviará automáticamente por correo al generar la cotización.
                                        </>
                                    ) : (
                                        <>
                                            <Info size={14} color="#64748B" style={{ flexShrink: 0 }} />
                                            {hayCorreoDestino
                                                ? 'La empresa emisora no cuenta con SMTP configurado; se descargará en PDF.'
                                                : 'Si no indicas un correo, se descargará automáticamente en PDF.'}
                                        </>
                                    )}
                                </div>
                            </div>

                        </div>
                    )}

                </div>

                {/* Footer con botones ordenados y espacios generosos */}
                <div style={{
                    padding: '18px 32px', borderTop: '1px solid #F1F5F9', backgroundColor: '#F8FAFC',
                    display: 'flex', justifyContent: 'flex-end', gap: '14px', alignItems: 'center'
                }}>
                    <button
                        onClick={resetModal}
                        disabled={generating || loadingPreview}
                        style={{ padding: '11px 20px', borderRadius: '12px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#475569', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}
                    >
                        Cancelar
                    </button>

                    {analysis && (
                        <button
                            onClick={handlePreview}
                            disabled={generating || loadingPreview || !analysis.empresa_emisora?.id}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '11px 18px', borderRadius: '12px',
                                background: '#FFFFFF', border: '1.5px solid #DDD6FE', color: '#9333EA',
                                cursor: (generating || loadingPreview || !analysis.empresa_emisora?.id) ? 'not-allowed' : 'pointer',
                                fontWeight: '700', fontSize: '14px', transition: 'all 0.2s'
                            }}
                            onMouseEnter={e => {
                                if (!generating && !loadingPreview) {
                                    e.currentTarget.style.backgroundColor = '#FAF5FF';
                                    e.currentTarget.style.borderColor = '#C084FC';
                                }
                            }}
                            onMouseLeave={e => {
                                if (!generating && !loadingPreview) {
                                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                                    e.currentTarget.style.borderColor = '#DDD6FE';
                                }
                            }}
                        >
                            {loadingPreview ? <Loader2 size={16} className="animate-spin" /> : <Eye size={16} />}
                            Vista Previa
                        </button>
                    )}

                    {analysis && (
                        <button
                            onClick={handleGenerar}
                            disabled={generating || loadingPreview || !analysis.empresa_emisora?.id}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '11px 26px', borderRadius: '12px',
                                background: 'linear-gradient(135deg, #9333EA 0%, #7C3AED 100%)',
                                border: 'none', color: '#FFFFFF', fontWeight: '700', fontSize: '14px',
                                cursor: (generating || loadingPreview || !analysis.empresa_emisora?.id) ? 'not-allowed' : 'pointer',
                                opacity: (generating || loadingPreview || !analysis.empresa_emisora?.id) ? 0.6 : 1,
                                boxShadow: '0 4px 14px rgba(147, 51, 234, 0.3)'
                            }}
                        >
                            {generating ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" /> Procesando...
                                </>
                            ) : enviaraPorCorreo ? (
                                <>
                                    <Send size={18} /> Generar y Enviar
                                </>
                            ) : (
                                <>
                                    <Download size={18} /> Generar y Descargar
                                </>
                            )}
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
}
