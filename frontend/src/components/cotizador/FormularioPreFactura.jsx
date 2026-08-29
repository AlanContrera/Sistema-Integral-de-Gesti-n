import React, { useState, useEffect, useRef } from 'react';
import {
    Plus, Trash2, Download, Send, Calculator, FileSpreadsheet, Search,
    ChevronDown, ChevronUp, Building2, FileText, CheckCircle2, Eye,
    UserPlus, FolderOpen, Clock, RefreshCw, User, Calendar, X
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function FormularioPreFactura({ empresas, clientes }) {
    // --- ESTADOS DE PESTAÑAS (FORMULARIO VS HISTORIAL) ---
    const [subTab, setSubTab] = useState('formulario'); // 'formulario' | 'historial'
    const [historialPrefacturas, setHistorialPrefacturas] = useState([]);
    const [loadingHistorial, setLoadingHistorial] = useState(false);
    const [busquedaHistorial, setBusquedaHistorial] = useState('');

    // --- ESTADOS DE CLIENTES Y EMPRESAS ---
    const [listaClientes, setListaClientes] = useState(clientes || []);
    const [empresaId, setEmpresaId] = useState('');
    const [clienteId, setClienteId] = useState('');

    // Sincronizar clientes que vienen de props
    useEffect(() => {
        if (clientes && clientes.length > 0) {
            setListaClientes(clientes);
        }
    }, [clientes]);

    // Estados para UX del buscador
    const [busquedaCliente, setBusquedaCliente] = useState('');
    const [mostrarResultados, setMostrarResultados] = useState(false);
    const [mostrarConfigFiscal, setMostrarConfigFiscal] = useState(false);
    const buscadorRef = useRef(null);

    // Estados para Modales de Éxito y Confirmación
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [folioGuardado, setFolioGuardado] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [modalConfig, setModalConfig] = useState({ titulo: '', mensaje: '', onConfirm: () => { } });

    // Estado para Modal de Cliente Nuevo / Única Operación
    const [showModalNuevoCliente, setShowModalNuevoCliente] = useState(false);
    const [nuevoClienteData, setNuevoClienteData] = useState({
        empresa: '',
        rfc: '',
        correo: '',
        correos_cc: '',
        regimen_fiscal: '601 - General de Ley Personas Morales',
        uso_cfdi_preferido: 'G03 - GASTOS EN GENERAL',
        codigo_postal: '',
        calle_numero: '',
        colonia: '',
        ciudad: '',
        estado: ''
    });

    // Parámetros fiscales predeterminados
    const [parametros, setParametros] = useState({
        fecha_pago: '',
        moneda: 'MXN - Peso Mexicano',
        tipo_cambio: '1',
        forma_pago: '03 - TRANSFERENCIA ELECTRÓNICA DE FONDOS',
        metodo_pago: 'PUE - Pago en una sola exhibición',
        uso_cfdi: 'G03 - GASTOS EN GENERAL'
    });

    // Partidas
    const [partidas, setPartidas] = useState([
        { id: Date.now(), clave_prod: '', cantidad: 1, clave_unidad: 'E48', unidad: 'SERVICIO', descripcion: '', valor_unitario: 0, tasa_iva: 0.16, impuesto_label: '002 - IVA' }
    ]);

    // Memoria para recordar si estamos editando una prefactura existente
    const [cotizacionOrigen, setCotizacionOrigen] = useState(null);

    // --- CARGA DEL HISTORIAL ---
    const fetchHistorial = async () => {
        setLoadingHistorial(true);
        try {
            const response = await fetch(`http://${window.location.hostname}:8000/api/cotizador/listar-prefacturas/`);
            if (!response.ok) throw new Error('Error al cargar historial');
            const data = await response.json();
            setHistorialPrefacturas(data);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoadingHistorial(false);
        }
    };

    useEffect(() => {
        fetchHistorial();
    }, []);

    // Cerrar buscador de clientes al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (buscadorRef.current && !buscadorRef.current.contains(event.target)) {
                setMostrarResultados(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Actualizar uso de CFDI según el cliente seleccionado
    useEffect(() => {
        if (clienteId) {
            const clienteSel = listaClientes.find(c => c.id.toString() === clienteId.toString());
            if (clienteSel) {
                setParametros(prev => ({ ...prev, uso_cfdi: clienteSel.uso_cfdi_preferido || 'G03 - GASTOS EN GENERAL' }));
            }
        }
    }, [clienteId, listaClientes]);

    const clienteSeleccionado = listaClientes.find(c => c.id.toString() === clienteId.toString());
    const empresaSeleccionada = empresas.find(e => e.id.toString() === empresaId.toString());

    const clientesFiltrados = listaClientes.filter(c =>
        (c.empresa && c.empresa.toLowerCase().includes(busquedaCliente.toLowerCase())) ||
        (c.rfc && c.rfc.toLowerCase().includes(busquedaCliente.toLowerCase()))
    ).slice(0, 5);

    const empresasDisponibles = clienteSeleccionado
        ? (clienteSeleccionado.empresas_emisoras && clienteSeleccionado.empresas_emisoras.length > 0
            ? empresas.filter(e => clienteSeleccionado.empresas_emisoras.includes(e.id))
            : [...empresas]).sort((a, b) => a.nombre_empresa.localeCompare(b.nombre_empresa))
        : [];

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
            empresa_id: empresaId,
            empresa_nombre: empresaSel?.nombre_empresa || '',
            tipo_comprobante: 'I - INGRESO',
            cliente_id: clienteId,
            rfc_receptor: clienteSeleccionado?.rfc || '',
            razon_social: clienteSeleccionado?.razon_social || clienteSeleccionado?.empresa || '',
            calle_numero: clienteSeleccionado?.calle_numero || '',
            colonia: clienteSeleccionado?.colonia || '',
            ciudad: clienteSeleccionado?.ciudad || '',
            estado: clienteSeleccionado?.estado || '',
            codigo_postal: clienteSeleccionado?.codigo_postal || '',
            regimen_fiscal: clienteSeleccionado?.regimen_fiscal || '',
            ...parametros,
            partidas: partidas,
            prefactura_id: cotizacionOrigen
        };
    };

    // --- ACCIÓN: REGISTRAR CLIENTE NUEVO O EXPRÉS ---
    const handleCrearCliente = async (e) => {
        e.preventDefault();
        if (!nuevoClienteData.empresa.trim()) {
            return toast.error('El nombre comercial o razón social es obligatorio');
        }
        if (!nuevoClienteData.correo.trim()) {
            return toast.error('El correo electrónico es obligatorio');
        }

        const loadingToast = toast.loading('Registrando cliente...');
        try {
            const response = await fetch(`http://${window.location.hostname}:8000/api/cotizador/clientes/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...nuevoClienteData,
                    razon_social: nuevoClienteData.razon_social || nuevoClienteData.empresa
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Error al crear cliente');
            }

            const clienteCreado = await response.json();

            // Agregar a la lista local y seleccionar automáticamente
            setListaClientes(prev => [clienteCreado, ...prev]);
            setClienteId(clienteCreado.id);
            setShowModalNuevoCliente(false);
            setBusquedaCliente('');
            setMostrarResultados(false);

            // Reiniciar formulario del modal
            setNuevoClienteData({
                empresa: '', rfc: '', correo: '', correos_cc: '',
                regimen_fiscal: '601 - General de Ley Personas Morales',
                uso_cfdi_preferido: 'G03 - GASTOS EN GENERAL',
                codigo_postal: '', calle_numero: '', colonia: '', ciudad: '', estado: ''
            });

            toast.success(`Cliente "${clienteCreado.empresa}" registrado y asignado`, { id: loadingToast });
        } catch (error) {
            toast.error(error.message, { id: loadingToast });
        }
    };

    // --- ACCIÓN: CARGAR PREFACTURA DESDE EL HISTORIAL ---
    const handleCargarPrefactura = (pref) => {
        if (!pref.datos_formulario) {
            return toast.error('No se encontraron datos para esta prefactura');
        }
        const df = pref.datos_formulario;

        if (df.cliente_id) setClienteId(df.cliente_id);
        if (df.empresa_id) setEmpresaId(df.empresa_id);

        if (df.partidas && df.partidas.length > 0) {
            setPartidas(df.partidas);
        }

        setParametros({
            fecha_pago: df.fecha_pago || '',
            moneda: df.moneda || 'MXN - Peso Mexicano',
            tipo_cambio: df.tipo_cambio || '1',
            forma_pago: df.forma_pago || '03 - TRANSFERENCIA ELECTRÓNICA DE FONDOS',
            metodo_pago: df.metodo_pago || 'PUE - Pago en una sola exhibición',
            uso_cfdi: df.uso_cfdi || 'G03 - GASTOS EN GENERAL'
        });

        setCotizacionOrigen(pref.id);
        setSubTab('formulario');
        toast.success(`Prefactura ${pref.referencia_unica} cargada en el formulario`);
    };

    // --- ACCIÓN: DESCARGAR EXCEL ---
    const handleDescargarExcel = async (payloadEspecifico = null) => {
        const payload = payloadEspecifico || construirPayload();
        if (!payload.empresa_id || !payload.cliente_id) {
            return toast.error('Selecciona Empresa y Cliente primero.');
        }

        const loadingToast = toast.loading('Generando formato Excel...');
        try {
            const res = await fetch(`http://${window.location.hostname}:8000/api/cotizador/descargar-excel-prefactura/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
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
        } catch (error) {
            toast.error('Error de conexión', { id: loadingToast });
        }
    };

    // --- ACCIÓN: GUARDAR PREFACTURA SILENCIOSA ---
    const handleGuardarPrefactura = async () => {
        if (!empresaSeleccionada || !clienteSeleccionado) {
            toast.error('Por favor seleccione una empresa emisora y un cliente antes de guardar.', { duration: 4000 });
            return;
        }

        const loadingToast = toast.loading('Guardando Prefactura en el sistema...');

        try {
            const payload = construirPayload();
            payload.enviar_correo = false;

            const token = localStorage.getItem('access_token');

            const response = await fetch(`http://${window.location.hostname}:8000/api/cotizador/solicitar-factura-monterrey/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Error al guardar prefactura en el sistema.');

            toast.dismiss(loadingToast);

            setFolioGuardado(data.referencia);
            setShowSuccessModal(true);
            setCotizacionOrigen(data.prefactura_id);
            fetchHistorial(); // Refrescar historial
        } catch (error) {
            console.error("Error en Guardar Prefactura:", error);
            toast.dismiss(loadingToast);
            toast.error(`Ocurrió un error al guardar: ${error.message}`, { duration: 6000 });
        }
    };

    // --- ACCIÓN: ENVIAR SOLICITUD A MONTERREY ---
    const triggerSolicitarMonterrey = () => {
        if (!empresaSeleccionada || !clienteSeleccionado) {
            toast.error('Seleccione empresa emisora y cliente');
            return;
        }
        setModalConfig({
            titulo: 'Confirmar Solicitud a Monterrey',
            mensaje: `Se solicitará la Factura Oficial al equipo de Monterrey.\n\nEmisor: ${empresaSeleccionada.nombre_empresa}\nCliente: ${clienteSeleccionado.empresa}\n\n¿Deseas proceder y despachar la solicitud?`,
            onConfirm: handleSolicitarMonterrey
        });

        setShowConfirmModal(true);
    };

    const handleSolicitarMonterrey = async () => {
        const loadingToast = toast.loading('Enviando solicitud a Monterrey...');
        try {
            const payload = construirPayload();
            payload.enviar_correo = true;

            const token = localStorage.getItem('access_token');
            const response = await fetch(`http://${window.location.hostname}:8000/api/cotizador/solicitar-factura-monterrey/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Error en la solicitud');
            toast.success(data.mensaje, { id: loadingToast });
            fetchHistorial();
        } catch (error) {
            toast.error(error.message, { id: loadingToast });
        }
    };

    // --- VISTA PREVIA PDF ---
    const handlePreviewPDF = async (datosFormulario) => {
        const nuevaPestana = window.open('', '_blank');
        if (!nuevaPestana) return toast.error('Desactiva el bloqueador de ventanas emergentes.');
        nuevaPestana.document.write('<html><body style="font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f1f5f9; color: #475569;"><h2>Generando vista previa del documento...</h2></body></html>');

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

    // Filtro de búsqueda para la tabla de historial
    const historialFiltrado = historialPrefacturas.filter(p =>
        (p.referencia_unica && p.referencia_unica.toLowerCase().includes(busquedaHistorial.toLowerCase())) ||
        (p.cliente && p.cliente.toLowerCase().includes(busquedaHistorial.toLowerCase())) ||
        (p.empresa_emisora && p.empresa_emisora.toLowerCase().includes(busquedaHistorial.toLowerCase()))
    );

    // Estilos SaaS
    const styles = {
        mainWrapper: { backgroundColor: '#F8FAFC', borderRadius: '24px', border: '1px solid #E2E8F0', padding: '32px', fontFamily: '"Inter", "Segoe UI", sans-serif', position: 'relative', paddingBottom: subTab === 'formulario' ? '120px' : '32px' },
        headerCard: { backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px -10px rgba(0,0,0,0.05)', marginBottom: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' },
        label: { display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' },
        input: { width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', fontSize: '15px', color: '#1E293B', outline: 'none', transition: 'all 0.2s' },
        searchBox: { position: 'relative' },
        searchInputContainer: { display: 'flex', alignItems: 'center', backgroundColor: '#FFFFFF', border: '2px solid #E2E8F0', borderRadius: '12px', padding: '12px 16px', transition: 'border-color 0.2s' },
        searchInput: { border: 'none', outline: 'none', width: '100%', fontSize: '15px', marginLeft: '12px' },
        searchResults: { position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#FFFFFF', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', marginTop: '8px', zIndex: 50, border: '1px solid #E2E8F0', overflow: 'hidden' },
        resultItem: { padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #F1F5F9', transition: 'background-color 0.2s', display: 'flex', flexDirection: 'column' },
        clientCard: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px' },
        clientCardTitle: { fontSize: '15px', fontWeight: '700', color: '#1E1B4B', margin: '0 0 4px 0' },
        clientCardSub: { fontSize: '13px', color: '#64748B', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' },
        configHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', padding: '16px 24px', borderRadius: '16px', cursor: 'pointer', border: '1px solid #E2E8F0', marginBottom: mostrarConfigFiscal ? '16px' : '24px', transition: 'all 0.2s' },
        configBody: { backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', marginBottom: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' },
        partidasCard: { backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 4px 20px -10px rgba(0,0,0,0.05)' },
        partidasHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #E2E8F0' },
        btnOutline: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '10px', border: '1px solid #C7D2FE', backgroundColor: '#EEF2FF', color: '#4F46E5', fontWeight: '600', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s' },
        bigInput: { width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', fontSize: '15px', color: '#0F172A', outline: 'none' },
        importeText: { fontSize: '20px', fontWeight: '700', color: '#1E1B4B', margin: '12px 0 0 0' },
        stickyBar: { position: 'absolute', bottom: '0', left: '0', right: '0', backgroundColor: '#FFFFFF', padding: '20px 32px', borderTop: '1px solid #E2E8F0', borderRadius: '0 0 24px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 -10px 40px -10px rgba(0,0,0,0.08)' },
        totalesBlock: { display: 'flex', gap: '32px', alignItems: 'center' },
        totalItem: { display: 'flex', flexDirection: 'column' },
        totalLabel: { fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' },
        totalValue: { fontSize: '18px', fontWeight: '600', color: '#1E293B', marginTop: '4px' },
        totalFinalValue: { fontSize: '22px', fontWeight: '800', color: '#4F46E5', marginTop: '4px' }
    };

    return (
        <div style={styles.mainWrapper}>
            <Toaster position="top-right" />

            {/* --- SELECTOR DE SUB-PESTAÑAS SUPERIOR --- */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', backgroundColor: '#F1F5F9', padding: '6px', borderRadius: '14px', width: 'fit-content' }}>
                <button
                    onClick={() => setSubTab('formulario')}
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
                        backgroundColor: subTab === 'formulario' ? '#4F46E5' : 'transparent',
                        color: subTab === 'formulario' ? '#FFFFFF' : '#64748B',
                        boxShadow: subTab === 'formulario' ? '0 4px 12px rgba(79, 70, 229, 0.2)' : 'none'
                    }}
                >
                    <FileSpreadsheet size={16} />
                    Llenado de Prefactura
                </button>

                <button
                    onClick={() => { setSubTab('historial'); fetchHistorial(); }}
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
                        backgroundColor: subTab === 'historial' ? '#4F46E5' : 'transparent',
                        color: subTab === 'historial' ? '#FFFFFF' : '#64748B',
                        boxShadow: subTab === 'historial' ? '0 4px 12px rgba(79, 70, 229, 0.2)' : 'none'
                    }}
                >
                    <Clock size={16} />
                    Historial de Prefacturas
                    <span style={{
                        backgroundColor: subTab === 'historial' ? '#FFFFFF' : '#E2E8F0',
                        color: subTab === 'historial' ? '#4F46E5' : '#475569',
                        padding: '2px 8px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '800'
                    }}>
                        {historialPrefacturas.length}
                    </span>
                </button>
            </div>

            {/* ========================================================================= */}
            {/* VISTA 1: FORMULARIO DE LLENADO DE PREFACTURA                             */}
            {/* ========================================================================= */}
            {subTab === 'formulario' && (
                <>
                    {/* Indicador si estamos editando una prefactura existente */}
                    {cotizacionOrigen && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', padding: '12px 20px', borderRadius: '12px', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1E40AF', fontSize: '14px', fontWeight: '600' }}>
                                <FolderOpen size={18} />
                                Editando datos de la Prefactura vinculada ID #{cotizacionOrigen}
                            </div>
                            <button
                                onClick={() => {
                                    setCotizacionOrigen(null);
                                    setClienteId('');
                                    setEmpresaId('');
                                    setPartidas([{ id: Date.now(), clave_prod: '84111500', cantidad: 1, clave_unidad: 'E48', unidad: 'SERVICIO', descripcion: '', valor_unitario: 0, tasa_iva: 0.16, impuesto_label: '002 - IVA' }]);
                                    toast('Formulario reiniciado para nueva captura');
                                }}
                                style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
                            >
                                Limpiar y Capturar Nueva
                            </button>
                        </div>
                    )}

                    {/* --- SECCIÓN 1: CABECERA (EMISOR Y RECEPTOR) --- */}
                    <div style={styles.headerCard}>

                        {/* 1. Buscar o Registrar Cliente Receptor */}
                        <div ref={buscadorRef} style={styles.searchBox}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <label style={{ ...styles.label, margin: 0 }}>Cliente Receptor</label>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setNuevoClienteData(prev => ({ ...prev, empresa: busquedaCliente }));
                                        setShowModalNuevoCliente(true);
                                    }}
                                    style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: '#4F46E5', fontSize: '12px', fontWeight: '700', cursor: 'pointer', padding: '2px 6px' }}
                                >
                                    <UserPlus size={14} /> + Cliente Nuevo / Única Operación
                                </button>
                            </div>

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
                                    <button onClick={() => { setClienteId(''); setBusquedaCliente(''); setEmpresaId(''); }} style={{ background: 'none', border: 'none', color: '#4F46E5', fontSize: '13px', fontWeight: '600', cursor: 'pointer', padding: '4px' }}>
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
                                        <div style={{ padding: '16px', textAlign: 'center', color: '#64748B', fontSize: '14px' }}>
                                            No se encontraron clientes registrados.
                                        </div>
                                    )}

                                    {/* Opción para registrar directamente desde el buscador */}
                                    <div
                                        onClick={() => {
                                            setNuevoClienteData(prev => ({ ...prev, empresa: busquedaCliente }));
                                            setShowModalNuevoCliente(true);
                                            setMostrarResultados(false);
                                        }}
                                        style={{ padding: '12px 16px', borderTop: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#4F46E5', fontWeight: '700', fontSize: '13px' }}
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#EEF2FF'}
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                                    >
                                        <UserPlus size={16} /> + Registrar "{busquedaCliente || 'Cliente Nuevo'}"
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 2. Empresa que Factura */}
                        <div>
                            <label style={styles.label}>Empresa que Factura</label>
                            <div style={{ position: 'relative' }}>
                                <Building2 size={18} color={!clienteId ? "#CBD5E1" : "#94A3B8"} style={{ position: 'absolute', left: '16px', top: '16px' }} />
                                <select
                                    style={{ ...styles.input, paddingLeft: '44px', backgroundColor: !clienteId ? '#F8FAFC' : '#FFFFFF', cursor: !clienteId ? 'not-allowed' : 'pointer' }}
                                    value={empresaId}
                                    onChange={(e) => setEmpresaId(e.target.value)}
                                    disabled={!clienteId}
                                >
                                    <option value="">{clienteId ? '-- Selecciona Empresa --' : '-- Selecciona un Cliente primero --'}</option>
                                    {empresasDisponibles.map(e => <option key={e.id} value={e.id}>{e.nombre_empresa}</option>)}
                                </select>
                            </div>
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

                    {/* --- SECCIÓN 3: PARTIDAS DINÁMICAS --- */}
                    <div style={styles.partidasCard}>
                        <div style={styles.partidasHeader}>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1E1B4B' }}>Conceptos a Facturar</h3>
                            <button onClick={agregarPartida} style={styles.btnOutline} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#E0E7FF'} onMouseLeave={e => e.currentTarget.style.backgroundColor = '#EEF2FF'}>
                                <Plus size={16} /> Agregar Nueva Fila
                            </button>
                        </div>

                        <div>
                            {partidas.map((p) => (
                                <div key={p.id} style={{ padding: '24px', borderBottom: '1px solid #F1F5F9', backgroundColor: '#FFFFFF' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                        <div>
                                            <label style={styles.label}>Clave Prod Serv</label>
                                            <input type="text" placeholder="Ej. 84111500" value={p.clave_prod || ''} onChange={(e) => actualizarPartida(p.id, 'clave_prod', e.target.value)} style={styles.bigInput} />
                                        </div>
                                        <div>
                                            <label style={styles.label}>Cant.</label>
                                            <input type="number" min="1" value={p.cantidad} onChange={(e) => actualizarPartida(p.id, 'cantidad', parseFloat(e.target.value) || 0)} style={{ ...styles.bigInput, textAlign: 'center' }} />
                                        </div>
                                        <div>
                                            <label style={styles.label}>Clave Unidad</label>
                                            <input type="text" placeholder="Ej. E48" value={p.clave_unidad || ''} onChange={(e) => actualizarPartida(p.id, 'clave_unidad', e.target.value)} style={styles.bigInput} />
                                        </div>
                                        <div>
                                            <label style={styles.label}>Unidad</label>
                                            <input type="text" placeholder="Ej. SERVICIO" value={p.unidad || ''} onChange={(e) => actualizarPartida(p.id, 'unidad', e.target.value)} style={styles.bigInput} />
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 2fr) 1fr 140px 140px 40px', gap: '20px', alignItems: 'flex-start' }}>
                                        <div>
                                            <label style={styles.label}>Descripción</label>
                                            <textarea rows="2" placeholder="Descripción del producto o servicio..." value={p.descripcion || ''} onChange={(e) => actualizarPartida(p.id, 'descripcion', e.target.value)} style={{ ...styles.bigInput, resize: 'vertical' }} />
                                        </div>
                                        <div>
                                            <label style={styles.label}>Precio Unitario</label>
                                            <div style={{ position: 'relative' }}>
                                                <span style={{ position: 'absolute', left: '14px', top: '15px', color: '#64748B', fontWeight: 'bold' }}>$</span>
                                                <input type="number" step="0.01" value={p.valor_unitario} onChange={(e) => actualizarPartida(p.id, 'valor_unitario', parseFloat(e.target.value) || 0)} style={{ ...styles.bigInput, paddingLeft: '30px' }} />
                                            </div>
                                        </div>
                                        <div>
                                            <label style={styles.label}>Impuesto</label>
                                            <div style={{ ...styles.input, backgroundColor: '#F1F5F9', color: '#4F46E5', fontWeight: '700', textAlign: 'center', border: '1px solid #E2E8F0', cursor: 'not-allowed' }}>
                                                16% IVA
                                            </div>
                                        </div>
                                        <div>
                                            <label style={styles.label}>Importe</label>
                                            <p style={styles.importeText}>
                                                ${(p.cantidad * p.valor_unitario).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </p>
                                        </div>
                                        <div style={{ paddingTop: '28px' }}>
                                            <button onClick={() => eliminarPartida(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', padding: '8px', opacity: 0.7 }} title="Eliminar fila">
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* --- SECCIÓN 4: BARRA STICKY (TOTALES Y ACCIONES) --- */}
                    <div style={styles.stickyBar}>
                        <div style={styles.totalesBlock}>
                            <div style={styles.totalItem}>
                                <span style={styles.totalLabel}>Subtotal</span>
                                <span style={styles.totalValue}>${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                            <div style={{ width: '1px', height: '30px', backgroundColor: '#E2E8F0' }}></div>
                            <div style={styles.totalItem}>
                                <span style={styles.totalLabel}>IVA Trasladado</span>
                                <span style={styles.totalValue}>${iva.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                            <div style={{ width: '1px', height: '30px', backgroundColor: '#E2E8F0' }}></div>
                            <div style={styles.totalItem}>
                                <span style={styles.totalLabel}>Total Final</span>
                                <span style={styles.totalFinalValue}>${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <button onClick={() => handleDescargarExcel()} style={{ padding: '12px 18px', borderRadius: '10px', background: '#FFFFFF', color: '#475569', border: '1px solid #CBD5E1', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F1F5F9'} onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFFFFF'}>
                                <FileSpreadsheet size={16} /> Descargar Excel
                            </button>
                            <button onClick={handleGuardarPrefactura} style={{ padding: '12px 20px', borderRadius: '10px', background: '#FFFFFF', color: '#0F172A', border: '1px solid #CBD5E1', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAFC'} onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFFFFF'}>
                                Guardar Borrador
                            </button>
                            <button onClick={triggerSolicitarMonterrey} style={{ padding: '12px 24px', borderRadius: '10px', background: '#4F46E5', color: '#FFFFFF', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#4338CA'} onMouseLeave={e => e.currentTarget.style.backgroundColor = '#4F46E5'}>
                                <Send size={18} /> Solicitar Factura a Monterrey
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* ========================================================================= */}
            {/* VISTA 2: HISTORIAL DE PREFACTURAS                                         */}
            {/* ========================================================================= */}
            {subTab === 'historial' && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1E1B4B', margin: '0 0 4px 0' }}>
                                Historial de Prefacturas Guardadas
                            </h3>
                            <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>
                                Consulta, recupera o descarga cualquiera de las prefacturas emitidas en el sistema.
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '10px', padding: '8px 14px' }}>
                                <Search size={16} color="#94A3B8" />
                                <input
                                    type="text"
                                    placeholder="Buscar por Folio, Cliente..."
                                    value={busquedaHistorial}
                                    onChange={e => setBusquedaHistorial(e.target.value)}
                                    style={{ border: 'none', outline: 'none', marginLeft: '8px', fontSize: '13px', width: '220px' }}
                                />
                            </div>
                            <button
                                onClick={fetchHistorial}
                                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 14px', borderRadius: '10px', background: '#FFFFFF', border: '1px solid #CBD5E1', color: '#475569', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}
                            >
                                <RefreshCw size={16} /> Actualizar
                            </button>
                        </div>
                    </div>

                    {loadingHistorial ? (
                        <div style={{ textAlign: 'center', padding: '60px', color: '#64748B' }}>Cargando historial...</div>
                    ) : (
                        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                                    <tr>
                                        <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Folio</th>
                                        <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Cliente</th>
                                        <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Empresa Emisora</th>
                                        <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Total</th>
                                        <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Estado</th>
                                        <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Registro</th>
                                        <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {historialFiltrado.map((pref) => {
                                        const fechaLocal = pref.fecha_creacion
                                            ? new Date(pref.fecha_creacion).toLocaleString('es-MX', {
                                                day: '2-digit', month: '2-digit', year: 'numeric',
                                                hour: '2-digit', minute: '2-digit', hour12: true
                                            })
                                            : 'Sin fecha';

                                        const estadoLabels = {
                                            'NO_SOLICITADA': { label: 'Borrador', bg: '#F1F5F9', color: '#475569' },
                                            'ENVIADA_A_MONTERREY': { label: 'Enviada a MTY', bg: '#FEF3C7', color: '#D97706' },
                                            'RECIBIDA_DE_MONTERREY': { label: 'Recibida de MTY', bg: '#EFF6FF', color: '#2563EB' },
                                            'ENVIADA_AL_CLIENTE': { label: 'Factura Entregada', bg: '#EEF2FF', color: '#4F46E5' },
                                        };
                                        const badge = estadoLabels[pref.estado_factura] || { label: pref.estado_factura, bg: '#F1F5F9', color: '#475569' };

                                        return (
                                            <tr key={pref.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                                <td style={{ padding: '16px 20px' }}>
                                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 12px', backgroundColor: '#EFF6FF', color: '#2563EB', borderRadius: '20px', fontSize: '13px', fontWeight: '700' }}>
                                                        <FileText size={14} />
                                                        {pref.referencia_unica}
                                                    </div>
                                                </td>

                                                <td style={{ padding: '16px 20px', fontWeight: '700', color: '#0F172A', fontSize: '14px' }}>
                                                    {pref.cliente}
                                                </td>

                                                <td style={{ padding: '16px 20px', color: '#475569', fontSize: '14px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <Building2 size={14} color="#94A3B8" />
                                                        {pref.empresa_emisora}
                                                    </div>
                                                </td>

                                                <td style={{ padding: '16px 20px', fontWeight: '700', color: '#1E1B4B', fontSize: '14px' }}>
                                                    ${parseFloat(pref.total || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </td>

                                                <td style={{ padding: '16px 20px' }}>
                                                    <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700', backgroundColor: badge.bg, color: badge.color }}>
                                                        {badge.label}
                                                    </span>
                                                </td>

                                                <td style={{ padding: '16px 20px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0F172A', fontSize: '13px', fontWeight: '600' }}>
                                                        <User size={13} color="#4F46E5" /> {pref.creado_por}
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', fontSize: '12px', marginTop: '2px' }}>
                                                        <Calendar size={13} color="#94A3B8" /> {fechaLocal}
                                                    </div>
                                                </td>

                                                <td style={{ padding: '16px 20px' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                                                        <button
                                                            onClick={() => handleCargarPrefactura(pref)}
                                                            title="Cargar datos en el formulario para editar"
                                                            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '8px', background: '#EEF2FF', border: '1px solid #C7D2FE', color: '#4F46E5', fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}
                                                        >
                                                            <FolderOpen size={14} /> Cargar / Editar
                                                        </button>

                                                        <button
                                                            onClick={() => handleDescargarExcel(pref.datos_formulario)}
                                                            title="Descargar Excel"
                                                            style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                                        >
                                                            <FileSpreadsheet size={15} />
                                                        </button>

                                                        <button
                                                            onClick={() => handlePreviewPDF(pref.datos_formulario)}
                                                            title="Vista Previa PDF"
                                                            style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                                        >
                                                            <Eye size={15} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}

                                    {historialFiltrado.length === 0 && (
                                        <tr>
                                            <td colSpan="7" style={{ textAlign: 'center', padding: '50px', color: '#94A3B8' }}>
                                                No se encontraron prefacturas registradas.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* ========================================================================= */}
            {/* MODAL: REGISTRAR CLIENTE NUEVO O EXPRÉS (OPERACIÓN ÚNICA)                */}
            {/* ========================================================================= */}
            {showModalNuevoCliente && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', width: '560px', maxWidth: '95%', padding: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', animation: 'slideUp 0.3s ease-out' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <div>
                                <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
                                    Registrar Cliente / Operación Única
                                </h3>
                                <p style={{ color: '#64748B', fontSize: '13px', margin: '4px 0 0 0' }}>
                                    Ingresa los datos para asignar de inmediato este cliente a la prefactura.
                                </p>
                            </div>
                            <button onClick={() => setShowModalNuevoCliente(false)} style={{ background: '#F1F5F9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleCrearCliente}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={styles.label}>Nombre Comercial / Razón Social *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Ej. Distribuidora del Norte S.A. de C.V."
                                        value={nuevoClienteData.empresa}
                                        onChange={e => setNuevoClienteData({ ...nuevoClienteData, empresa: e.target.value })}
                                        style={styles.input}
                                    />
                                </div>

                                <div>
                                    <label style={styles.label}>RFC (Opcional / Genérico)</label>
                                    <input
                                        type="text"
                                        placeholder="Ej. XAXX010101000"
                                        value={nuevoClienteData.rfc}
                                        onChange={e => setNuevoClienteData({ ...nuevoClienteData, rfc: e.target.value.toUpperCase() })}
                                        style={styles.input}
                                    />
                                </div>

                                <div>
                                    <label style={styles.label}>Código Postal (CP)</label>
                                    <input
                                        type="text"
                                        maxLength="5"
                                        placeholder="Ej. 64000"
                                        value={nuevoClienteData.codigo_postal}
                                        onChange={e => setNuevoClienteData({ ...nuevoClienteData, codigo_postal: e.target.value })}
                                        style={styles.input}
                                    />
                                </div>

                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={styles.label}>Correo Electrónico Principal *</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="contacto@cliente.com"
                                        value={nuevoClienteData.correo}
                                        onChange={e => setNuevoClienteData({ ...nuevoClienteData, correo: e.target.value })}
                                        style={styles.input}
                                    />
                                </div>

                                <div>
                                    <label style={styles.label}>Régimen Fiscal</label>
                                    <select
                                        value={nuevoClienteData.regimen_fiscal}
                                        onChange={e => setNuevoClienteData({ ...nuevoClienteData, regimen_fiscal: e.target.value })}
                                        style={styles.input}
                                    >
                                        <option value="601 - General de Ley Personas Morales">601 - Personas Morales</option>
                                        <option value="612 - Personas Físicas con Actividades Empresariales y Profesionales">612 - Personas Físicas con Act. Emp.</option>
                                        <option value="626 - Régimen Simplificado de Confianza">626 - RESICO</option>
                                        <option value="616 - Sin obligaciones fiscales">616 - Sin obligaciones fiscales</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={styles.label}>Uso CFDI Preferido</label>
                                    <select
                                        value={nuevoClienteData.uso_cfdi_preferido}
                                        onChange={e => setNuevoClienteData({ ...nuevoClienteData, uso_cfdi_preferido: e.target.value })}
                                        style={styles.input}
                                    >
                                        <option value="G03 - GASTOS EN GENERAL">G03 - Gastos en General</option>
                                        <option value="G01 - ADQUISICIÓN DE MERCANCIAS">G01 - Adquisición de Mercancías</option>
                                        <option value="S01 - Sin efectos fiscales">S01 - Sin efectos fiscales</option>
                                        <option value="CP01 - Pagos">CP01 - Pagos</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowModalNuevoCliente(false)}
                                    style={{ padding: '12px 20px', borderRadius: '10px', background: '#F1F5F9', border: 'none', color: '#64748B', fontWeight: '700', cursor: 'pointer' }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    style={{ padding: '12px 24px', borderRadius: '10px', background: '#4F46E5', border: 'none', color: '#FFFFFF', fontWeight: '700', cursor: 'pointer' }}
                                >
                                    Guardar y Asignar Cliente
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- MODAL DE CONFIRMACIÓN DE SOLICITUD A MONTERREY --- */}
            {showConfirmModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '32px', width: '600px', maxWidth: '90%', padding: '40px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', animation: 'slideUp 0.3s ease-out', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>Confirmación de Datos</h3>
                            <button onClick={() => setShowConfirmModal(false)} style={{ background: '#F1F5F9', border: 'none', width: '40px', height: '40px', borderRadius: '50%', color: '#64748B', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
                        </div>

                        <div style={{ whiteSpace: 'pre-line', color: '#475569', fontSize: '15px', lineHeight: '1.6', marginBottom: '32px' }}>
                            {modalConfig.mensaje}
                        </div>

                        <button
                            onClick={() => { setShowConfirmModal(false); if (modalConfig.onConfirm) modalConfig.onConfirm(); }}
                            style={{ padding: '16px 24px', borderRadius: '16px', background: '#4F46E5', color: '#FFFFFF', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '16px', transition: 'background 0.2s', width: '100%' }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#4338CA'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#4F46E5'}
                        >
                            Confirmar Solicitud a Monterrey
                        </button>
                    </div>
                </div>
            )}

            {/* --- MODAL DE ÉXITO DE GUARDADO SILENCIOSO --- */}
            {showSuccessModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '32px', width: '400px', maxWidth: '90%', padding: '40px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', animation: 'slideUp 0.3s ease-out', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#D1FAE5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                            <CheckCircle2 size={36} />
                        </div>

                        <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#1E1B4B', margin: '0 0 16px 0' }}>La prefactura se guardó correctamente.</h3>

                        <p style={{ fontSize: '22px', fontWeight: '800', color: '#4F46E5', margin: '0 0 32px 0' }}>
                            {folioGuardado}
                        </p>

                        <button
                            onClick={() => { setShowSuccessModal(false); setFolioGuardado(null); }}
                            style={{ width: '100%', padding: '16px', borderRadius: '16px', background: '#4F46E5', color: '#FFFFFF', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '16px', transition: 'background 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#4338CA'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#4F46E5'}
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
