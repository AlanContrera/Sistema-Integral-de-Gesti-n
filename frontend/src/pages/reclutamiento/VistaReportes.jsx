// frontend/src/pages/reclutamiento/VistaReportes.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FileText, Download, UserCheck, FileSearch, Loader2 } from 'lucide-react';
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
                    const dataVacantes = await resVacantes.json();
                    const dataCandidatos = await resCandidatos.json();
                    setVacantes(dataVacantes);
                    setCandidatos(dataCandidatos);
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
            descripcion: 'Descarga el resumen completo del levantamiento de la vacante.',
            icono: FileSearch,
            color: '#334155',
            requiere: 'vacante'
        },
        {
            id: 'inicial',
            titulo: 'Entrevista Inicial',
            descripcion: 'Reporte del filtro rápido y viabilidad inicial del candidato.',
            icono: FileText,
            color: '#96C2DB',
            requiere: 'candidato'
        },
        {
            id: 'profunda',
            titulo: 'Entrevista Profunda',
            descripcion: 'Dossier ejecutivo con evaluación de rubros y dictamen.',
            icono: UserCheck,
            color: '#475569',
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
        ).finally(() => {
            setDescargando(null);
        });
    };

    const handleDescarga = async (reporteId) => {
        if (!seleccion) {
            toast.error("Por favor, selecciona un registro antes de descargar.");
            return;
        }

        setDescargando(reporteId);

        try {
            if (reporteId === 'perfilador') {
                const res = await fetchConToken(`/reclutamiento/vacantes/${seleccion}/`);
                if (res.ok) {
                    const vacante = await res.json();
                    setDatosPdf(prev => ({ ...prev, vacante }));

                    // Esperar renderizado y disparar PDF
                    setTimeout(() => triggerPdf('perfilador', `Perfilador_${vacante.puesto_nombre?.replace(/\s+/g, '_') || 'Vacante'}`), 500);
                }
            } else if (reporteId === 'inicial') {
                const resCand = await fetchConToken(`/reclutamiento/candidatos/${seleccion}/`);
                const resEnt = await fetchConToken(`/reclutamiento/entrevistas-iniciales/?candidato=${seleccion}`);

                if (resCand.ok && resEnt.ok) {
                    const candidato = await resCand.json();
                    const entrevistas = await resEnt.json();
                    const miEntrevista = entrevistas.find(e => e.candidato === parseInt(seleccion));

                    if (!miEntrevista) {
                        toast.error("Este candidato aún no tiene una entrevista inicial registrada.");
                        setDescargando(null);
                        return;
                    }

                    // Fetch de la vacante para obtener datos del encabezado (sueldos, ubicacion)
                    let vacanteData = null;
                    if (candidato.vacante) {
                        const resVac = await fetchConToken(`/reclutamiento/vacantes/${candidato.vacante}/`);
                        if (resVac.ok) vacanteData = await resVac.json();
                    }

                    setDatosPdf(prev => ({ ...prev, candidato, entrevistaInicial: miEntrevista, vacante: vacanteData }));
                    setTimeout(() => triggerPdf('inicial', `Entrevista_Inicial_${candidato.nombre_completo.replace(/\s+/g, '_')}`), 500);
                }
            } else if (reporteId === 'profunda') {
                const resCand = await fetchConToken(`/reclutamiento/candidatos/${seleccion}/`);
                const resEnt = await fetchConToken(`/reclutamiento/entrevistas-profundas/?candidato=${seleccion}`);

                if (resCand.ok && resEnt.ok) {
                    const candidato = await resCand.json();
                    const entrevistas = await resEnt.json();
                    const miEntrevista = entrevistas.find(e => e.candidato === parseInt(seleccion));

                    if (!miEntrevista) {
                        toast.error("Este candidato aún no tiene una entrevista profunda registrada.");
                        setDescargando(null);
                        return;
                    }

                    // Fetch de la vacante para obtener datos del encabezado (sueldos, ubicacion)
                    let vacanteData = null;
                    if (candidato.vacante) {
                        const resVac = await fetchConToken(`/reclutamiento/vacantes/${candidato.vacante}/`);
                        if (resVac.ok) vacanteData = await resVac.json();
                    }

                    setDatosPdf(prev => ({ ...prev, candidato, entrevistaProfunda: miEntrevista, vacante: vacanteData }));
                    setTimeout(() => triggerPdf('profunda', `Entrevista_Profunda_${candidato.nombre_completo.replace(/\s+/g, '_')}`), 500);
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Ocurrió un error al cargar los datos.");
            setDescargando(null);
        }
    };

    if (cargando) {
        return <div style={{ padding: '40px', color: '#64748B' }}>Cargando información de la base de datos...</div>;
    }

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", color: '#334155', maxWidth: '900px', margin: '0 auto', paddingBottom: '40px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>Reportes</h2>
            <p style={{ color: '#64748B', marginBottom: '32px' }}>Selecciona el tipo de reporte ejecutivo y luego elige el registro correspondiente.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                {reportesDisponibles.map((reporte) => {
                    const Icono = reporte.icono;
                    const isActivo = reporteActivo === reporte.id;

                    return (
                        <div
                            key={reporte.id}
                            style={{
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #E2E8F0',
                                borderRadius: '16px',
                                padding: '24px',
                                transition: 'all 0.3s ease',
                                boxShadow: isActivo ? '0 10px 25px -5px rgba(150, 194, 219, 0.4)' : '0 4px 6px rgba(0,0,0,0.05)',
                                transform: isActivo ? 'translateY(-4px)' : 'none',
                                borderColor: isActivo ? '#96C2DB' : '#E2E8F0',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                            onClick={() => !isActivo && handleActivar(reporte.id)}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', cursor: 'pointer' }}>
                                <div style={{ backgroundColor: '#E5EDF1', padding: '12px', borderRadius: '12px' }}>
                                    <Icono size={24} color={reporte.color} />
                                </div>
                                <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>{reporte.titulo}</h3>
                            </div>

                            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.5', marginBottom: '24px', flexGrow: 1 }}>
                                {reporte.descripcion}
                            </p>

                            {isActivo && (
                                <div style={{ marginBottom: '16px', animation: 'fadeIn 0.3s ease' }}>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', marginBottom: '8px', textTransform: 'uppercase' }}>
                                        {reporte.requiere === 'vacante' ? 'Seleccionar Vacante' : 'Seleccionar Candidato'}
                                    </label>
                                    <select
                                        value={seleccion}
                                        onChange={(e) => setSeleccion(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            borderRadius: '8px',
                                            border: '1px solid #CBD5E1',
                                            backgroundColor: '#F8FAFC',
                                            color: '#334155',
                                            outline: 'none',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <option value="" disabled>-- Elige una opción --</option>
                                        {reporte.requiere === 'vacante'
                                            ? vacantes.map(v => <option key={v.id} value={v.id}>{v.puesto_nombre || v.nombre_puesto} - {v.cliente}</option>)
                                            : candidatos.map(c => <option key={c.id} value={c.id}>{c.nombre_completo}</option>)
                                        }
                                    </select>
                                </div>
                            )}

                            <button
                                onClick={(e) => { e.stopPropagation(); handleDescarga(reporte.id); }}
                                disabled={isActivo && (!seleccion || descargando === reporte.id)}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    backgroundColor: (isActivo && !seleccion) ? '#CBD5E1' : '#96C2DB',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    cursor: (isActivo && !seleccion) ? 'not-allowed' : 'pointer',
                                    transition: 'background-color 0.2s'
                                }}
                            >
                                {descargando === reporte.id ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                                {descargando === reporte.id ? 'Generando PDF...' : (isActivo ? 'Descargar' : 'Seleccionar')}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Plantillas ocultas para HTML2PDF */}
            <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', visibility: 'hidden', zIndex: -1000 }}>
                {datosPdf.vacante && <PDFPerfilador ref={pdfRefs.perfilador} vacante={datosPdf.vacante} />}
                {datosPdf.candidato && datosPdf.entrevistaInicial && <PDFEntrevistaInicial ref={pdfRefs.inicial} candidato={datosPdf.candidato} entrevistaInicial={datosPdf.entrevistaInicial} vacante={datosPdf.vacante} />}
                {datosPdf.candidato && datosPdf.entrevistaProfunda && <PDFEntrevistaProfunda ref={pdfRefs.profunda} candidato={datosPdf.candidato} entrevistaProfunda={datosPdf.entrevistaProfunda} vacante={datosPdf.vacante} />}
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default VistaReportes;
