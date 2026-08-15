// frontend/src/pages/reclutamiento/VistaReportes.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FileText, Download, UserCheck, FileSearch, Loader2, Mail, ChevronDown, CheckCircle2 } from 'lucide-react';
import { fetchConToken } from '../../services/api';
import toast from 'react-hot-toast';

import PDFPerfilador from '../../components/reportes/PDFPerfilador';
import PDFEntrevistaInicial from '../../components/reportes/PDFEntrevistaInicial';
import PDFEntrevistaProfunda from '../../components/reportes/PDFEntrevistaProfunda';

const VistaReportes = () => {
    const [reporteActivo, setReporteActivo] = useState(null);
    const [seleccion, setSeleccion] = useState("");

    const [vacantes, setVacantes] = useState([]);
    const [candidatos, setCandidatos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [descargando, setDescargando] = useState(null);

    const [datosPdf, setDatosPdf] = useState({
        vacante: null,
        candidato: null,
        entrevistaInicial: null,
        entrevistaProfunda: null
    });

    const pdfRefs = {
        perfilador: useRef(null),
        inicial: useRef(null),
        profunda: useRef(null)
    };

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const [resVacantes, resCandidatos] = await Promise.all([
                    fetchConToken('/reclutamiento/vacantes/'),
                    fetchConToken('/reclutamiento/candidatos/')
                ]);

                if (resVacantes.ok && resCandidatos.ok) {
                    setVacantes(await resVacantes.json());
                    setCandidatos(await resCandidatos.json());
                }
            } catch (error) {
                console.error("Error de red:", error);
            } finally {
                setCargando(false);
            }
        };
        cargarDatos();
    }, []);

    const reportesDisponibles = [
        {
            id: 'perfilador',
            titulo: 'Reporte Perfilador',
            descripcion: 'Resumen completo del levantamiento de la vacante.',
            icono: FileSearch,
            requiere: 'vacante'
        },
        {
            id: 'inicial',
            titulo: 'Entrevista Inicial',
            descripcion: 'Filtro rápido y viabilidad inicial del candidato.',
            icono: FileText,
            requiere: 'candidato'
        },
        {
            id: 'profunda',
            titulo: 'Entrevista Profunda',
            descripcion: 'Dossier ejecutivo con evaluación de rubros.',
            icono: UserCheck,
            requiere: 'candidato'
        }
    ];

    const handleActivar = (id) => {
        setReporteActivo(id);
        setSeleccion("");
    };

    const triggerPdf = (reporteId, filename) => {
        const elemento = pdfRefs[reporteId].current;
        if (!elemento) {
            toast.error("Error: Plantilla no encontrada en el DOM");
            setDescargando(null);
            return;
        }

        const opciones = {
            margin: [10, 0, 10, 0],
            filename: `${filename}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' },
            pagebreak: { mode: 'css', avoid: ['tr', 'h2', 'h3', 'h4', '.evitar-salto', '[style*="pageBreakInside: avoid"]'] }
        };

        toast.promise(
            window.html2pdf().set(opciones).from(elemento).save(),
            {
                loading: 'Generando PDF...',
                success: '¡PDF descargado exitosamente!',
                error: 'Error al generar el PDF.'
            }
        ).finally(() => setDescargando(null));
    };

    const triggerPdfEmail = async (reporteId, filename, correo) => {
        const elemento = pdfRefs[reporteId].current;
        if (!elemento) return toast.error("Error: Plantilla no encontrada en el DOM");

        const opciones = {
            margin: [10, 0, 10, 0],
            filename: `${filename}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' },
            pagebreak: { mode: 'css', avoid: ['tr', 'h2', 'h3', 'h4', '.evitar-salto', '[style*="pageBreakInside: avoid"]'] }
        };

        try {
            const pdfBase64 = await window.html2pdf().set(opciones).from(elemento).output('datauristring');

            const res = await fetchConToken('/reclutamiento/utilidades/enviar_pdf_email/', {
                method: 'POST',
                body: JSON.stringify({
                    email_cliente: correo,
                    mensaje_adicional: '', // Eliminamos el mensaje adicional
                    candidato_nombre: datosPdf.candidato ? datosPdf.candidato.nombre_completo : '', // SOLUCIÓN BUGS NOMBRES
                    vacante_nombre: datosPdf.vacante?.puesto_nombre || datosPdf.vacante?.nombre_puesto || 'Posición',
                    filename: `${filename}.pdf`,
                    pdf_base64: pdfBase64
                })
            });

            if (res.ok) {
                toast.success("Correo enviado exitosamente al cliente.");
            } else {
                toast.error("Error del servidor al intentar enviar el correo.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error generando el PDF para enviar.");
        } finally {
            setDescargando(null);
        }
    };

    const handleAccion = async (reporteId, accion, correo_cliente = null) => {
        if (!seleccion) return toast.error("Selecciona un registro primero.");
        setDescargando(reporteId);

        try {
            // SOLUCIÓN BUG: Limpiamos por completo la memoria del estado anterior
            let datosTemporales = { vacante: null, candidato: null, entrevistaInicial: null, entrevistaProfunda: null };

            if (reporteId === 'perfilador') {
                const res = await fetchConToken(`/reclutamiento/vacantes/${seleccion}/`);
                if (res.ok) {
                    const vacante = await res.json();
                    datosTemporales = { ...datosTemporales, vacante };
                    setDatosPdf(datosTemporales);

                    setTimeout(() => {
                        const nombreArchivo = `Perfilador_${vacante.puesto_nombre?.replace(/\s+/g, '_') || 'Vacante'}`;
                        if (accion === 'descargar') triggerPdf('perfilador', nombreArchivo);
                        else triggerPdfEmail('perfilador', nombreArchivo, correo_cliente);
                    }, 500);
                }
            } else if (reporteId === 'inicial' || reporteId === 'profunda') {
                const resCand = await fetchConToken(`/reclutamiento/candidatos/${seleccion}/`);
                const resEnt = await fetchConToken(`/reclutamiento/entrevistas-${reporteId === 'inicial' ? 'iniciales' : 'profundas'}/?candidato=${seleccion}`);

                if (resCand.ok && resEnt.ok) {
                    const candidato = await resCand.json();
                    const entrevistas = await resEnt.json();
                    const miEntrevista = entrevistas.find(e => e.candidato === parseInt(seleccion));

                    if (!miEntrevista) {
                        toast.error(`El candidato no tiene una entrevista ${reporteId} registrada.`);
                        setDescargando(null);
                        return;
                    }

                    let vacanteData = null;
                    if (candidato.vacante) {
                        const resVac = await fetchConToken(`/reclutamiento/vacantes/${candidato.vacante}/`);
                        if (resVac.ok) vacanteData = await resVac.json();
                    }

                    datosTemporales = {
                        ...datosTemporales,
                        candidato,
                        vacante: vacanteData,
                        entrevistaInicial: reporteId === 'inicial' ? miEntrevista : null,
                        entrevistaProfunda: reporteId === 'profunda' ? miEntrevista : null
                    };

                    setDatosPdf(datosTemporales);

                    setTimeout(() => {
                        const nombreArchivo = `Entrevista_${reporteId === 'inicial' ? 'Inicial' : 'Profunda'}_${candidato.nombre_completo.replace(/\s+/g, '_')}`;
                        if (accion === 'descargar') triggerPdf(reporteId, nombreArchivo);
                        else triggerPdfEmail(reporteId, nombreArchivo, correo_cliente);
                    }, 500);
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Ocurrió un error al cargar los datos.");
            setDescargando(null);
        }
    };

    if (cargando) {
        return <div style={{ padding: '40px', color: '#64748B', display: 'flex', justifyContent: 'center' }}><Loader2 className="animate-spin" size={32} /></div>;
    }

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", color: '#0F172A', maxWidth: '1000px', margin: '0 auto', paddingBottom: '60px' }}>

            <div style={{ marginBottom: '40px', borderBottom: '1px solid #E2E8F0', paddingBottom: '24px' }}>
                <h2 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 8px 0', color: '#1E293B' }}>Centro de Reportes Ejecutivos</h2>
                <p style={{ color: '#64748B', fontSize: '16px', margin: 0 }}>Genera, visualiza y envía expedientes PDF de forma automatizada.</p>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ backgroundColor: '#1A237E', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>1</span>
                Selecciona el tipo de reporte
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                {reportesDisponibles.map((reporte) => {
                    const Icono = reporte.icono;
                    const isActivo = reporteActivo === reporte.id;

                    return (
                        <div
                            key={reporte.id}
                            onClick={() => handleActivar(reporte.id)}
                            style={{
                                backgroundColor: isActivo ? '#F8FAFC' : '#FFFFFF',
                                border: isActivo ? '2px solid #1A237E' : '1px solid #E2E8F0',
                                borderRadius: '16px',
                                padding: '24px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: isActivo ? '0 10px 15px -3px rgba(26, 35, 126, 0.1)' : '0 1px 3px rgba(0,0,0,0.05)',
                                transform: isActivo ? 'translateY(-2px)' : 'none',
                                position: 'relative'
                            }}
                        >
                            {isActivo && (
                                <div style={{ position: 'absolute', top: '16px', right: '16px', color: '#1A237E' }}>
                                    <CheckCircle2 size={24} fill="#EFF6FF" />
                                </div>
                            )}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                                <div style={{ backgroundColor: isActivo ? '#E0E7FF' : '#F1F5F9', padding: '12px', borderRadius: '12px', transition: 'background-color 0.2s' }}>
                                    <Icono size={28} color={isActivo ? '#1A237E' : '#64748B'} />
                                </div>
                                <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0, color: isActivo ? '#1E293B' : '#475569' }}>
                                    {reporte.titulo}
                                </h3>
                            </div>
                            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.5', margin: 0 }}>
                                {reporte.descripcion}
                            </p>
                        </div>
                    );
                })}
            </div>

            {reporteActivo && (
                <div style={{ animation: 'slideUpFade 0.4s ease' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ backgroundColor: '#1A237E', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>2</span>
                        Configurar y Generar
                    </h3>

                    <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>

                        <div style={{ marginBottom: seleccion ? '32px' : '0', transition: 'margin 0.3s' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                {reportesDisponibles.find(r => r.id === reporteActivo)?.requiere === 'vacante' ? 'Busca y selecciona la Vacante' : 'Busca y selecciona el Candidato'}
                            </label>

                            <div style={{ position: 'relative' }}>
                                <select
                                    value={seleccion}
                                    onChange={(e) => setSeleccion(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '16px 20px',
                                        borderRadius: '12px',
                                        border: '2px solid #E2E8F0',
                                        backgroundColor: '#F8FAFC',
                                        color: '#0F172A',
                                        fontSize: '16px',
                                        outline: 'none',
                                        cursor: 'pointer',
                                        appearance: 'none',
                                        transition: 'border-color 0.2s'
                                    }}
                                >
                                    <option value="" disabled>-- Haz clic aquí para elegir --</option>
                                    {reportesDisponibles.find(r => r.id === reporteActivo)?.requiere === 'vacante'
                                        ? vacantes.map(v => <option key={v.id} value={v.id}>{v.puesto_nombre || v.nombre_puesto} - {v.cliente}</option>)
                                        : candidatos.map(c => <option key={c.id} value={c.id}>{c.nombre_completo}</option>)
                                    }
                                </select>
                                <ChevronDown size={20} color="#64748B" style={{ position: 'absolute', right: '20px', top: '18px', pointerEvents: 'none' }} />
                            </div>
                        </div>

                        {seleccion && (
                            <div style={{ display: 'flex', gap: '16px', animation: 'slideUpFade 0.3s ease', paddingTop: '32px', borderTop: '1px solid #F1F5F9' }}>

                                <button
                                    onClick={() => handleAccion(reporteActivo, 'descargar')}
                                    disabled={descargando === reporteActivo}
                                    style={{
                                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                                        backgroundColor: '#FFFFFF', color: '#1E293B',
                                        border: '2px solid #E2E8F0', padding: '16px', borderRadius: '12px',
                                        fontSize: '16px', fontWeight: '600', cursor: descargando === reporteActivo ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                    }}
                                >
                                    {descargando === reporteActivo ? <Loader2 size={22} className="animate-spin" /> : <Download size={22} color="#3B82F6" />}
                                    Descargar PDF local
                                </button>

                                <button
                                    onClick={() => {
                                        const req = reportesDisponibles.find(r => r.id === reporteActivo)?.requiere;
                                        const correo = req === 'vacante'
                                            ? vacantes.find(v => v.id === parseInt(seleccion))?.correo_contacto
                                            : vacantes.find(v => v.id === candidatos.find(c => c.id === parseInt(seleccion))?.vacante)?.correo_contacto;

                                        if (!correo) {
                                            toast.error("El cliente asociado no tiene un correo de contacto registrado en la Vacante.");
                                            return;
                                        }

                                        handleAccion(reporteActivo, 'email', correo);
                                    }}
                                    disabled={descargando === reporteActivo}
                                    style={{
                                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                                        backgroundColor: '#1A237E', color: '#FFFFFF',
                                        border: 'none', padding: '16px', borderRadius: '12px',
                                        fontSize: '16px', fontWeight: '600', cursor: descargando === reporteActivo ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(26, 35, 126, 0.2)'
                                    }}
                                >
                                    {descargando === reporteActivo ? <Loader2 size={22} className="animate-spin" /> : <Mail size={22} />}
                                    Enviar al Cliente
                                </button>

                            </div>
                        )}
                    </div>
                </div>
            )}

            <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', visibility: 'hidden', zIndex: -1000 }}>
                {datosPdf.vacante && <PDFPerfilador ref={pdfRefs.perfilador} vacante={datosPdf.vacante} />}
                {datosPdf.candidato && datosPdf.entrevistaInicial && <PDFEntrevistaInicial ref={pdfRefs.inicial} candidato={datosPdf.candidato} entrevistaInicial={datosPdf.entrevistaInicial} vacante={datosPdf.vacante} />}
                {datosPdf.candidato && datosPdf.entrevistaProfunda && <PDFEntrevistaProfunda ref={pdfRefs.profunda} candidato={datosPdf.candidato} entrevistaProfunda={datosPdf.entrevistaProfunda} vacante={datosPdf.vacante} />}
            </div>

            <style>{`
                @keyframes slideUpFade {
                    from { opacity: 0; transform: translateY(15px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                button:hover {
                    opacity: 0.95;
                }
            `}</style>
        </div>
    );
};

export default VistaReportes;
