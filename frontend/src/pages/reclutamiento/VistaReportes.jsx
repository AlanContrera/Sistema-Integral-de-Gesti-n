// frontend/src/pages/reclutamiento/VistaReportes.jsx
import React, { useState, useEffect } from 'react';
import { FileText, Download, UserCheck, FileSearch } from 'lucide-react';
import { fetchConToken } from '../../services/api'; // Importamos tu función de fetch con token

const VistaReportes = () => {
    const [reporteActivo, setReporteActivo] = useState(null);
    const [seleccion, setSeleccion] = useState("");

    // Estados para guardar los datos reales de la BD
    const [vacantes, setVacantes] = useState([]);
    const [candidatos, setCandidatos] = useState([]);
    const [cargando, setCargando] = useState(true);

    // Efecto para cargar los datos al entrar a la vista
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                // Hacemos las peticiones a tus endpoints del router de Django
                const [resVacantes, resCandidatos] = await Promise.all([
                    fetchConToken('/reclutamiento/vacantes/'),
                    fetchConToken('/reclutamiento/candidatos/')
                ]);

                if (resVacantes.ok && resCandidatos.ok) {
                    const dataVacantes = await resVacantes.json();
                    const dataCandidatos = await resCandidatos.json();
                    setVacantes(dataVacantes);
                    setCandidatos(dataCandidatos);
                } else {
                    console.error("Error al obtener los datos del servidor");
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
            descripcion: 'Dossier ejecutivo con evaluación de 37 rubros y dictamen.',
            icono: UserCheck,
            color: '#475569',
            requiere: 'candidato'
        }
    ];

    const handleActivar = (id) => {
        setReporteActivo(id);
        setSeleccion(""); // Reiniciamos la selección
    };

    const handleDescarga = (reporteId) => {
        if (!seleccion) {
            alert("Por favor, selecciona un registro antes de descargar.");
            return;
        }

        // Aquí puedes adaptar la URL exacta de tu backend según el reporte.
        // Ejemplo para el reporte del cliente (que ya vi que existe en tu views.py):
        // window.open(`http://${window.location.hostname}:8000/api/reclutamiento/reportes/${seleccion}/descargar_pdf/`, '_blank');

        alert(`Iniciando descarga del reporte: ${reporteId} para el ID: ${seleccion} desde la BD`);
    };

    if (cargando) {
        return <div style={{ padding: '40px', color: '#64748B' }}>Cargando información de la base de datos...</div>;
    }

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", color: '#334155', maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>Reportes ATS</h2>
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
                                            // Asumiendo que el modelo Vacante tiene nombre_puesto y cliente
                                            ? vacantes.map(v => <option key={v.id} value={v.id}>{v.nombre_puesto} - {v.cliente}</option>)
                                            // Asumiendo que el modelo Candidato tiene nombre_completo
                                            : candidatos.map(c => <option key={c.id} value={c.id}>{c.nombre_completo}</option>)
                                        }
                                    </select>
                                </div>
                            )}

                            <button
                                onClick={(e) => { e.stopPropagation(); handleDescarga(reporte.id); }}
                                disabled={isActivo && !seleccion}
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
                                <Download size={18} />
                                {isActivo ? 'Descargar' : 'Seleccionar'}
                            </button>
                        </div>
                    );
                })}
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default VistaReportes;
