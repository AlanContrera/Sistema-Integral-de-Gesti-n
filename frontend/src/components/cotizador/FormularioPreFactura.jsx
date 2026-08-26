import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Download, Send, Calculator, FileSpreadsheet, Search, ChevronDown, ChevronUp, Building2, FileText, CheckCircle2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FormularioPreFactura({ empresas, clientes }) {
    const [empresaId, setEmpresaId] = useState('');
    const [clienteId, setClienteId] = useState('');

    // Estados para UX
    const [busquedaCliente, setBusquedaCliente] = useState('');
    const [mostrarResultados, setMostrarResultados] = useState(false);
    const [mostrarConfigFiscal, setMostrarConfigFiscal] = useState(false);
    const buscadorRef = useRef(null);

    const [parametros, setParametros] = useState({
        fecha_pago: '',
        moneda: 'MXN - Peso Mexicano',
        tipo_cambio: '1',
        forma_pago: '03 - TRANSFERENCIA ELECTRÓNICA DE FONDOS',
        metodo_pago: 'PUE - Pago en una sola exhibición',
        uso_cfdi: 'G03 - GASTOS EN GENERAL'
    });

    const [partidas, setPartidas] = useState([
        { id: Date.now(), clave_prod: '84111500', cantidad: 1, clave_unidad: 'E48', unidad: 'SERVICIO', descripcion: '', valor_unitario: 0, tasa_iva: 0.16, impuesto_label: '002 - IVA' }
    ]);

    // --- ESTADOS PARA MODALES DE CONFIRMACIÓN ---
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [modalConfig, setModalConfig] = useState({ titulo: '', mensaje: '', onConfirm: () => { } });

    // Cerrar buscador al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (buscadorRef.current && !buscadorRef.current.contains(event.target)) {
                setMostrarResultados(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (clienteId) {
            const clienteSel = clientes.find(c => c.id.toString() === clienteId.toString());
            if (clienteSel) {
                setParametros(prev => ({ ...prev, uso_cfdi: clienteSel.uso_cfdi_preferido || 'G03 - GASTOS EN GENERAL' }));
            }
        }
    }, [clienteId, clientes]);

    const clienteSeleccionado = clientes.find(c => c.id.toString() === clienteId.toString());
    const empresaSeleccionada = empresas.find(e => e.id.toString() === empresaId.toString());
    const clientesFiltrados = clientes.filter(c =>
        c.empresa.toLowerCase().includes(busquedaCliente.toLowerCase()) ||
        (c.rfc && c.rfc.toLowerCase().includes(busquedaCliente.toLowerCase()))
    ).slice(0, 5); // Mostrar solo top 5

    const handleChangeParam = (e) => setParametros({ ...parametros, [e.target.name]: e.target.value });

    const agregarPartida = () => {
        setPartidas([...partidas, { id: Date.now(), clave_prod: '84111500', cantidad: 1, clave_unidad: 'E48', unidad: 'SERVICIO', descripcion: '', valor_unitario: 0, tasa_iva: 0.16, impuesto_label: '002 - IVA' }]);
    };

    const eliminarPartida = (id) => {
        if (partidas.length > 1) setPartidas(partidas.filter(p => p.id !== id));
        else toast.error('Debe haber al menos una partida.');
    };

    const actualizarPartida = (id, campo, valor) => {
        setPartidas(partidas.map(p => p.id === id ? { ...p, [campo]: valor } : p));
    };

    const subtotal = partidas.reduce((acc, p) => acc + (p.cantidad * p.valor_unitario), 0);
    const iva = partidas.reduce((acc, p) => acc + (p.cantidad * p.valor_unitario * p.tasa_iva), 0);
    const total = subtotal + iva;

    const construirPayload = () => {
        const empresaSel = empresas.find(e => e.id.toString() === empresaId.toString());
        return {
            empresa_id: empresaId, empresa_nombre: empresaSel?.nombre_empresa || '', tipo_comprobante: 'I - INGRESO',
            cliente_id: clienteId, rfc_receptor: clienteSeleccionado?.rfc || '', razon_social: clienteSeleccionado?.razon_social || clienteSeleccionado?.empresa || '',
            calle_numero: clienteSeleccionado?.calle_numero || '', colonia: clienteSeleccionado?.colonia || '', ciudad: clienteSeleccionado?.ciudad || '',
            estado: clienteSeleccionado?.estado || '', codigo_postal: clienteSeleccionado?.codigo_postal || '', regimen_fiscal: clienteSeleccionado?.regimen_fiscal || '',
            ...parametros, partidas: partidas
        };
    };

    const handleDescargarExcel = async () => {
        if (!empresaId || !clienteId) return toast.error('Selecciona Empresa y Cliente primero.');
        const loadingToast = toast.loading('Generando formato Excel...');
        try {
            const res = await fetch(`http://${window.location.hostname}:8000/api/cotizador/descargar-excel-prefactura/`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(construirPayload())
            });

            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                const disposition = res.headers.get('Content-Disposition');
                let filename = 'Prefactura.xlsx';
                if (disposition && disposition.includes('filename="')) {
                    filename = disposition.split('filename="')[1].split('"')[0];
                }
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                a.remove();
                toast.success('Excel descargado correctamente', { id: loadingToast });
            } else {
                toast.error('Error al generar el Excel', { id: loadingToast });
            }
        } catch (e) {
            toast.error('Error de red', { id: loadingToast });
        }
    };

    // Estilos Premium (SaaS Layout)
    const styles = {
        mainWrapper: { backgroundColor: '#F8FAFC', borderRadius: '24px', border: '1px solid #E2E8F0', padding: '32px', fontFamily: '"Inter", "Segoe UI", sans-serif', position: 'relative', paddingBottom: '120px' },
        headerCard: { backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px -10px rgba(0,0,0,0.05)', marginBottom: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' },
        label: { display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' },
        input: { width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', fontSize: '15px', color: '#1E293B', outline: 'none', transition: 'all 0.2s', boxShadow: 'inset 0 2px 4px 0 rgba(0,0,0,0.02)' },

        // Buscador Inteligente
        searchBox: { position: 'relative' },
        searchInputContainer: { display: 'flex', alignItems: 'center', backgroundColor: '#FFFFFF', border: '2px solid #E2E8F0', borderRadius: '12px', padding: '12px 16px', transition: 'border-color 0.2s' },
        searchInput: { border: 'none', outline: 'none', width: '100%', fontSize: '15px', marginLeft: '12px' },
        searchResults: { position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#FFFFFF', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', marginTop: '8px', zIndex: 50, border: '1px solid #E2E8F0', overflow: 'hidden' },
        resultItem: { padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #F1F5F9', transition: 'background-color 0.2s', display: 'flex', flexDirection: 'column' },

        // Tarjeta de Cliente
        clientCard: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px' },
        clientCardTitle: { fontSize: '15px', fontWeight: '700', color: '#1E1B4B', margin: '0 0 4px 0' },
        clientCardSub: { fontSize: '13px', color: '#64748B', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' },

        // Acordeón Configuración
        configHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', padding: '16px 24px', borderRadius: '16px', cursor: 'pointer', border: '1px solid #E2E8F0', marginBottom: mostrarConfigFiscal ? '16px' : '24px', transition: 'all 0.2s' },
        configBody: { backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', marginBottom: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', animation: 'fadeInDown 0.3s ease-out' },

        // Partidas Rediseñadas
        partidasCard: { backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 4px 20px -10px rgba(0,0,0,0.05)' },
        partidasHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #E2E8F0' },
        row: { display: 'flex', gap: '16px', padding: '24px', borderBottom: '1px solid #F1F5F9', alignItems: 'flex-start' },
        colCant: { width: '80px' },
        colDesc: { flex: 1 },
        colPrecio: { width: '180px' },
        colIva: { width: '220px' },
        colImporte: { width: '150px', textAlign: 'right' },
        colAction: { width: '40px', paddingTop: '32px' }, // Alinear con el input central

        // Inputs grandes para Partidas
        bigInput: { width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', fontSize: '15px', color: '#0F172A', outline: 'none', transition: 'border-color 0.2s' },

        // Botones tipo Píldora para IVA
        pillsContainer: { display: 'flex', backgroundColor: '#F1F5F9', borderRadius: '10px', padding: '4px', gap: '4px' },
        pill: (active) => ({ flex: 1, textAlign: 'center', padding: '8px 4px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', border: 'none', transition: 'all 0.2s', backgroundColor: active ? '#FFFFFF' : 'transparent', color: active ? '#4F46E5' : '#64748B', boxShadow: active ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }),

        importeText: { fontSize: '20px', fontWeight: '700', color: '#1E293B', margin: '12px 0 0 0' },

        // Barra Flotante Sticky
        stickyBar: { position: 'absolute', bottom: '0', left: '0', right: '0', backgroundColor: '#FFFFFF', padding: '20px 32px', borderTop: '1px solid #E2E8F0', borderRadius: '0 0 24px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 -10px 40px -10px rgba(0,0,0,0.08)' },
        totalesBlock: { display: 'flex', gap: '32px', alignItems: 'center' },
        totalItem: { display: 'flex', flexDirection: 'column' },
        totalLabel: { fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' },
        totalValue: { fontSize: '18px', fontWeight: '600', color: '#334155' },
        totalFinalValue: { fontSize: '28px', fontWeight: '800', color: '#4F46E5' },

        // Botones
        btnPrimary: { backgroundColor: '#4F46E5', color: '#FFFFFF', padding: '14px 28px', borderRadius: '12px', fontWeight: '600', fontSize: '15px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 8px 16px -4px rgba(79, 70, 229, 0.4)', transition: 'transform 0.1s' },
        btnSecondary: { backgroundColor: '#F8FAFC', color: '#1E293B', padding: '14px 28px', borderRadius: '12px', fontWeight: '600', fontSize: '15px', border: '1px solid #E2E8F0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'background-color 0.2s' },
        btnOutline: { backgroundColor: '#EEF2FF', color: '#4F46E5', padding: '10px 20px', borderRadius: '10px', fontWeight: '600', fontSize: '14px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' },
    };

    // -------------------------------------------------------------
    // FUNCIONES DE BIFURCACIÓN DE FLUJO
    // -------------------------------------------------------------

    const triggerSolicitarMonterrey = () => {
        if (!empresaSeleccionada || !clienteSeleccionado) {
            toast.error('Seleccione empresa emisora y cliente');
            return;
        }
        setModalConfig({
            titulo: 'Confirmar Solicitud a Monterrey',
            mensaje: `Se solicitará la Factura Oficial al equipo de Monterrey.\n\nEmisor: ${empresaSeleccionada.nombre_empresa}\nCliente asignado: ${clienteSeleccionado.empresa}\n\n¿Deseas proceder y enviar la prefactura?`,
            onConfirm: handleSolicitarMonterrey
        });

        setShowConfirmModal(true);
    };

    const handleSolicitarMonterrey = async () => {
        const loadingToast = toast.loading('Generando Excel y enviando a Monterrey...');
        try {
            const payload = {
                empresa_id: empresaSeleccionada.id,
                cliente_id: clienteSeleccionado.id,
                ...parametros,
                partidas
            };
            const response = await fetch(`http://${window.location.hostname}:8000/api/cotizador/solicitar-factura-monterrey/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error('Error en la petición');
            const data = await response.json();
            toast.success(`Factura solicitada. Referencia: ${data.referencia}`, { id: loadingToast });
        } catch (error) {
            console.error(error);
            toast.error('Error al enviar la solicitud a Monterrey', { id: loadingToast });
        }
    };

    const triggerGenerarCotizacion = () => {
        if (!empresaSeleccionada || !clienteSeleccionado) {
            toast.error('Seleccione empresa emisora y cliente');
            return;
        }
        setModalConfig({
            titulo: 'Confirmar Envío de Cotización',
            mensaje: `Vas a enviar la Cotización Final al cliente.\n\nDestinatario: ${clienteSeleccionado.empresa}\nCorreo: ${clienteSeleccionado.correo || 'No registrado'}\n\n¿Estás totalmente seguro de enviarla?`,
            onConfirm: handleGenerarCotizacion
        });
        setShowConfirmModal(true);
    };

    const handleGenerarCotizacion = async () => {
        const loadingToast = toast.loading('Generando cotización y enviando al cliente...');
        try {
            const payload = {
                empresa_id: empresaSeleccionada.id,
                cliente_id: clienteSeleccionado.id,
                ...parametros,
                partidas
            };
            const response = await fetch(`http://${window.location.hostname}:8000/api/cotizador/generar-cotizacion/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error('Error en la petición');
            const data = await response.json();
            toast.success(`Cotización enviada. Referencia: ${data.referencia}`, { id: loadingToast });
        } catch (error) {
            console.error(error);
            toast.error('Error al generar la cotización', { id: loadingToast });
        }
    };

    const handlePreviewCotizacion = async () => {
        if (!empresaSeleccionada || !clienteSeleccionado) {
            toast.error('Seleccione empresa emisora y cliente');
            return;
        }

        const nuevaPestana = window.open('', '_blank');
        if (!nuevaPestana) {
            toast.error('Desactiva el bloqueador de ventanas emergentes para este sitio.');
            return;
        }
        nuevaPestana.document.write('<html><body style="font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f1f5f9; color: #475569;"><h2>Generando vista previa del PDF... Por favor espera.</h2></body></html>');

        try {
            const payload = {
                empresa_id: empresaSeleccionada.id,
                cliente_id: clienteSeleccionado.id,
                ...parametros,
                partidas
            };

            const response = await fetch(`http://${window.location.hostname}:8000/api/cotizador/preview-cotizacion-pdf/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error('Error en la petición');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            nuevaPestana.location.href = url;

        } catch (error) {
            console.error(error);
            nuevaPestana.close();
            toast.error('Error al generar la vista previa del PDF');
        }
    };

    const handleDescargarCotizacion = async () => {
        if (!empresaSeleccionada || !clienteSeleccionado) {
            toast.error('Seleccione empresa emisora y cliente');
            return;
        }

        const loadingToast = toast.loading('Generando PDF...');
        try {
            const payload = {
                empresa_id: empresaSeleccionada.id,
                cliente_id: clienteSeleccionado.id,
                ...parametros,
                partidas
            };

            const response = await fetch(`http://${window.location.hostname}:8000/api/cotizador/preview-cotizacion-pdf/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error('Error en la petición');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Cotizacion_${clienteSeleccionado.empresa.replace(/\s+/g, '_')}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            toast.success('PDF descargado', { id: loadingToast });
        } catch (error) {
            console.error(error);
            toast.error('Error al descargar el PDF', { id: loadingToast });
        }
    };


    return (
        <div style={styles.mainWrapper}>

            {/* --- SECCIÓN 1: CABECERA (EMISOR Y RECEPTOR) --- */}
            <div style={styles.headerCard}>
                <div>
                    <label style={styles.label}>Empresa que Factura</label>
                    <div style={{ position: 'relative' }}>
                        <Building2 size={18} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '16px' }} />
                        <select style={{ ...styles.input, paddingLeft: '44px' }} value={empresaId} onChange={(e) => setEmpresaId(e.target.value)}>
                            <option value="">-- Selecciona Empresa --</option>
                            {empresas.map(e => <option key={e.id} value={e.id}>{e.nombre_empresa}</option>)}
                        </select>
                    </div>
                </div>

                <div ref={buscadorRef} style={styles.searchBox}>
                    <label style={styles.label}>Cliente Receptor</label>

                    {!clienteId ? (
                        <div style={{ ...styles.searchInputContainer, borderColor: mostrarResultados ? '#4F46E5' : '#E2E8F0' }}>
                            <Search size={18} color={mostrarResultados ? '#4F46E5' : '#94A3B8'} />
                            <input
                                type="text"
                                placeholder="Buscar por Nombre o RFC..."
                                style={styles.searchInput}
                                value={busquedaCliente}
                                onChange={(e) => { setBusquedaCliente(e.target.value); setMostrarResultados(true); }}
                                onFocus={() => setMostrarResultados(true)}
                            />
                        </div>
                    ) : (
                        <div style={styles.clientCard}>
                            <div>
                                <h4 style={styles.clientCardTitle}>{clienteSeleccionado?.empresa}</h4>
                                <p style={styles.clientCardSub}><FileText size={14} /> RFC: {clienteSeleccionado?.rfc || 'No registrado'}</p>
                            </div>
                            <button onClick={() => { setClienteId(''); setBusquedaCliente(''); }} style={{ background: 'none', border: 'none', color: '#4F46E5', fontSize: '13px', fontWeight: '600', cursor: 'pointer', padding: '4px' }}>
                                Cambiar
                            </button>
                        </div>
                    )}

                    {mostrarResultados && !clienteId && (
                        <div style={styles.searchResults}>
                            {clientesFiltrados.length > 0 ? (
                                clientesFiltrados.map(c => (
                                    <div key={c.id} style={styles.resultItem} onClick={() => { setClienteId(c.id); setMostrarResultados(false); }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAFC'} onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFFFFF'}>
                                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#1E1B4B' }}>{c.empresa}</span>
                                        <span style={{ fontSize: '12px', color: '#64748B' }}>RFC: {c.rfc || 'S/N'}</span>
                                    </div>
                                ))
                            ) : (
                                <div style={{ padding: '16px', textAlign: 'center', color: '#64748B', fontSize: '14px' }}>No se encontraron clientes</div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* --- SECCIÓN 2: CONFIGURACIÓN FISCAL OCULTA --- */}
            <div
                style={styles.configHeader}
                onClick={() => setMostrarConfigFiscal(!mostrarConfigFiscal)}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFFFFF'}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Calculator size={20} color="#4F46E5" />
                    <span style={{ fontSize: '15px', fontWeight: '600', color: '#1E293B' }}>Configuración Fiscal (Opcional)</span>
                    <span style={{ fontSize: '13px', color: '#64748B', backgroundColor: '#F1F5F9', padding: '2px 8px', borderRadius: '12px' }}>Pre-llenado</span>
                </div>
                {mostrarConfigFiscal ? <ChevronUp size={20} color="#64748B" /> : <ChevronDown size={20} color="#64748B" />}
            </div>

            {mostrarConfigFiscal && (
                <div style={styles.configBody}>
                    <div>
                        <label style={styles.label}>Fecha de Pago</label>
                        <input type="date" name="fecha_pago" value={parametros.fecha_pago} onChange={handleChangeParam} style={styles.input} />
                    </div>
                    <div>
                        <label style={styles.label}>Moneda</label>
                        <select name="moneda" value={parametros.moneda} onChange={handleChangeParam} style={styles.input}>
                            <option value="MXN - Peso Mexicano">MXN - Peso Mexicano</option>
                            <option value="USD - Dolar americano">USD - Dólar americano</option>
                        </select>
                    </div>
                    <div>
                        <label style={styles.label}>Tipo de Cambio</label>
                        <input type="number" step="0.01" name="tipo_cambio" value={parametros.tipo_cambio} onChange={handleChangeParam} disabled={parametros.moneda.startsWith('MXN')} style={{ ...styles.input, backgroundColor: parametros.moneda.startsWith('MXN') ? '#E2E8F0' : '#F8FAFC' }} />
                    </div>
                    <div>
                        <label style={styles.label}>Forma de Pago</label>
                        <select name="forma_pago" value={parametros.forma_pago} onChange={handleChangeParam} style={styles.input}>
                            <option value="03 - TRANSFERENCIA ELECTRÓNICA DE FONDOS">03 - TRANSFERENCIA ELECTRÓNICA DE FONDOS</option>
                            <option value="01 - EFECTIVO">01 - EFECTIVO</option>
                            <option value="02 - CHEQUE NOMINATIVO">02 - CHEQUE NOMINATIVO</option>
                        </select>
                    </div>
                    <div>
                        <label style={styles.label}>Método de Pago</label>
                        <select name="metodo_pago" value={parametros.metodo_pago} onChange={handleChangeParam} style={styles.input}>
                            <option value="PUE - Pago en una sola exhibición">PUE - Pago en una sola exhibición</option>
                            <option value="PPD - Pago en parcialidades o diferido">PPD - Pago en parcialidades o diferido</option>
                        </select>
                    </div>
                    <div>
                        <label style={styles.label}>Uso de CFDI</label>
                        <select name="uso_cfdi" value={parametros.uso_cfdi} onChange={handleChangeParam} style={styles.input}>
                            <option value="G03 - GASTOS EN GENERAL">G03 - GASTOS EN GENERAL</option>
                            <option value="G01 - ADQUISICIÓN DE MERCANCIAS">G01 - ADQUISICIÓN DE MERCANCIAS</option>
                        </select>
                    </div>
                </div>
            )}

            {/* --- SECCIÓN 3: PARTIDAS DINÁMICAS (Diseño Moderno) --- */}
            <div style={styles.partidasCard}>
                <div style={styles.partidasHeader}>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1E1B4B' }}>Conceptos a Facturar</h3>
                    <button onClick={agregarPartida} style={styles.btnOutline} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#E0E7FF'} onMouseLeave={e => e.currentTarget.style.backgroundColor = '#EEF2FF'}>
                        <Plus size={16} /> Agregar Nueva Fila
                    </button>
                </div>

                <div>
                    {partidas.map((p, index) => (
                        <div key={p.id} style={styles.row}>
                            <div style={styles.colCant}>
                                <label style={styles.label}>Cant.</label>
                                <input type="number" min="1" value={p.cantidad} onChange={(e) => actualizarPartida(p.id, 'cantidad', parseFloat(e.target.value) || 0)} style={{ ...styles.bigInput, textAlign: 'center' }} />
                            </div>
                            <div style={styles.colDesc}>
                                <label style={styles.label}>Descripción / Estrategia</label>
                                <input type="text" placeholder="Ej. Implementación de Estrategia Operativa..." value={p.descripcion} onChange={(e) => actualizarPartida(p.id, 'descripcion', e.target.value)} style={styles.bigInput} />
                            </div>
                            <div style={styles.colPrecio}>
                                <label style={styles.label}>Precio Unitario</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '16px', top: '15px', color: '#94A3B8', fontWeight: '600' }}>$</span>
                                    <input type="number" step="0.01" value={p.valor_unitario} onChange={(e) => actualizarPartida(p.id, 'valor_unitario', parseFloat(e.target.value) || 0)} style={{ ...styles.bigInput, paddingLeft: '32px', textAlign: 'right' }} />
                                </div>
                            </div>
                            <div style={styles.colIva}>
                                <label style={styles.label}>Impuesto (IVA)</label>
                                <div style={{ ...styles.input, backgroundColor: '#F1F5F9', color: '#4F46E5', fontWeight: '700', textAlign: 'center', border: '1px solid #E2E8F0', cursor: 'not-allowed' }}>
                                    16% IVA
                                </div>
                            </div>
                            <div style={styles.colImporte}>
                                <label style={styles.label}>Importe</label>
                                <p style={styles.importeText}>${(p.cantidad * p.valor_unitario).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                            </div>
                            <div style={styles.colAction}>
                                <button onClick={() => eliminarPartida(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', padding: '8px', opacity: 0.7, transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0.7} title="Eliminar fila">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- SECCIÓN 4: BARRA STICKY (TOTALES Y ACCIONES) --- */}
            <div style={styles.stickyBar}>

                {/* Bloque de Totales */}
                <div style={styles.totalesBlock}>
                    <div style={styles.totalItem}>
                        <span style={styles.totalLabel}>Subtotal</span>
                        <span style={styles.totalValue}>${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div style={{ width: '1px', height: '30px', backgroundColor: '#E2E8F0' }}></div>
                    <div style={styles.totalItem}>
                        <span style={styles.totalLabel}>IVA Trasladado</span>
                        <span style={styles.totalValue}>${iva.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div style={{ width: '1px', height: '30px', backgroundColor: '#E2E8F0' }}></div>
                    <div style={styles.totalItem}>
                        <span style={styles.totalLabel}>Total Final</span>
                        <span style={styles.totalFinalValue}>${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>
                {/* Botones de Acción: Bifurcación del Proceso (Diseño Compacto) */}
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>

                    {/* Camino 2: Facturación a Monterrey */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#059669', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Vía Facturación (Monterrey)
                        </span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={handleDescargarExcel} style={{ padding: '10px 14px', borderRadius: '8px', background: '#FFFFFF', color: '#475569', border: '1px solid #CBD5E1', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F1F5F9'} onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFFFFF'}>
                                <FileText size={16} /> Descargar
                            </button>
                            <button onClick={triggerSolicitarMonterrey} style={{ flex: 1, padding: '12px', borderRadius: '10px', background: '#059669', color: '#FFFFFF', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: '600', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#047857'} onMouseLeave={e => e.currentTarget.style.backgroundColor = '#059669'}>
                                <Send size={18} /> Solicitar Factura
                            </button>
                        </div>
                    </div>

                    {/* Separador visual */}
                    <div style={{ width: '1px', height: '40px', backgroundColor: '#E2E8F0', marginTop: '16px' }}></div>

                    {/* Camino 1: Cotización al Cliente */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Vía Cotización (Cliente)
                        </span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={handlePreviewCotizacion} title="Vista Previa PDF" style={{ padding: '12px 16px', borderRadius: '10px', background: '#FFFFFF', color: '#4F46E5', border: '1px solid #A5B4FC', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F5F3FF'} onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFFFFF'}>
                                <Eye size={18} />
                            </button>
                            <button onClick={handleDescargarCotizacion} style={{ padding: '12px 16px', borderRadius: '10px', background: '#FFFFFF', color: '#475569', border: '1px solid #A5B4FC', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F5F3FF'} onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFFFFF'}>
                                <FileText size={18} /> Descargar
                            </button>
                            <button onClick={triggerGenerarCotizacion} style={{ flex: 1, padding: '12px', borderRadius: '10px', background: '#4F46E5', color: '#FFFFFF', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: '600', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#4338CA'} onMouseLeave={e => e.currentTarget.style.backgroundColor = '#4F46E5'}>
                                <Send size={18} /> Enviar
                            </button>
                        </div>
                    </div>

                </div>

                {/* Modal de Confirmación Estilo Moderno */}
                {showConfirmModal && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '32px', width: '600px', maxWidth: '90%', padding: '40px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', animation: 'slideUp 0.3s ease-out', display: 'flex', flexDirection: 'column' }}>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                                <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>Confirmación de Datos</h3>
                                <button onClick={() => setShowConfirmModal(false)} style={{ background: '#F1F5F9', border: 'none', width: '40px', height: '40px', borderRadius: '50%', color: '#64748B', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>

                                {/* Remitente */}
                                <div style={{ backgroundColor: '#EEF2FF', border: '1px solid #C7D2FE', padding: '24px', borderRadius: '20px' }}>
                                    <p style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: '700', color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Building2 size={16} /> Empresa Emisora (Remitente)
                                    </p>
                                    <div>
                                        <p style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1E1B4B' }}>{empresaSeleccionada?.nombre_empresa}</p>
                                        <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#64748B', fontWeight: '500' }}>{empresaSeleccionada?.correo_remitente || 'Correo no registrado'}</p>
                                    </div>
                                </div>

                                {/* Destinatario Dinámico (Detecta qué botón lo abrió por el título) */}
                                <div style={{ backgroundColor: modalConfig.titulo.includes('Monterrey') ? '#FFFBEB' : '#EEF2FF', border: `1px solid ${modalConfig.titulo.includes('Monterrey') ? '#FDE68A' : '#C7D2FE'}`, padding: '24px', borderRadius: '20px' }}>
                                    <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: modalConfig.titulo.includes('Monterrey') ? '#D97706' : '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                        <FileText size={16} /> Destinatario
                                    </p>
                                    <div>
                                        {modalConfig.titulo.includes('Monterrey') ? (
                                            <>
                                                <p style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#92400E' }}>Equipo de Monterrey (Interno)</p>
                                                <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#B45309', fontWeight: '600' }}>soportecnico@solucionesvallux.net</p>
                                                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#D97706', fontWeight: '500' }}>+ 5 correos en copia</p>
                                            </>
                                        ) : (
                                            <>
                                                <p style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1E1B4B' }}>{clienteSeleccionado?.empresa}</p>
                                                <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#64748B', fontWeight: '500' }}>{clienteSeleccionado?.correo || 'No registrado'}</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => { setShowConfirmModal(false); modalConfig.onConfirm(); }}
                                style={{ padding: '16px 24px', borderRadius: '16px', background: modalConfig.titulo.includes('Monterrey') ? '#D97706' : '#4F46E5', color: '#FFFFFF', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '16px', transition: 'background 0.2s', width: '100%' }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = modalConfig.titulo.includes('Monterrey') ? '#B45309' : '#4338CA'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = modalConfig.titulo.includes('Monterrey') ? '#D97706' : '#4F46E5'}
                            >
                                {modalConfig.titulo.includes('Monterrey') ? 'Confirmar Solicitud a Monterrey' : 'Confirmar y Enviar Cotización'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Animaciones CSS inyectadas */}
            <style>{`
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

        </div>
    );
}
