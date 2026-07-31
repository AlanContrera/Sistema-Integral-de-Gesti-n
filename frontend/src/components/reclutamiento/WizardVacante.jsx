import React, { useState, useEffect } from 'react';
import { fetchConToken } from '../services/api';
import { CheckCircle, ChevronRight, ChevronLeft, Save } from 'lucide-react';

const WizardVacante = ({ onClose, onGuardado }) => {
    const [paso, setPaso] = useState(1);
    const [cargando, setCargando] = useState(false);
    
    // Catálogos
    const [categorias, setCategorias] = useState([]);
    const [estados, setEstados] = useState([]);
    const [municipios, setMunicipios] = useState([]);
    
    // Estado del formulario (basado en el modelo de Django)
    const [formData, setFormData] = useState({
        cliente: '', giro_industria: '', contacto_responsable: '', puesto_contacto: '', telefono_contacto: '', correo_contacto: '', razon_social: '', sitio_web: '',
        estado_republica: '', municipio: '',
        nombre_puesto: '', categoria_puesto: '', area_departamento: '', jefe_directo: '', numero_vacantes: 1, motivo_vacante: 'nueva', fecha_ideal_ingreso: '', nivel_puesto: 'operativo', tipo_contratacion: 'planta',
        sueldo_ofertado: '', sueldo_mercado: '', periodicidad_pago: 'mensual', jornada: 'completa', prestaciones: 'ley', pagos_adicionales: '', valor_estimado_mensual: 0,
        funciones_diarias_sugeridas: '', funciones_diarias_cliente: '', responsabilidades_sugeridas: '', responsabilidades_cliente: '', kpis: '',
        escolaridad_requerida: '', carrera_especialidad: '', experiencia_minima: 0, experiencia_deseable: '', edad_deseada: '', idioma_requerido: '', herramientas: '[]', certificaciones: '', disponibilidad_viajar: 'pendiente', disponibilidad_rolar_turnos: '',
        competencias_tecnicas_sugeridas: '', competencias_tecnicas_cliente: '', competencias_blandas_sugeridas: '', competencias_blandas_cliente: '', factores_exito_sugeridos: '', factores_exito_cliente: '',
        modalidad: 'presencial', horario: '', herramientas_proporcionadas: '',
        entrevistas_requeridas: '', evaluaciones_requeridas: '', documentos_necesarios: '', tiempo_cobertura: '', quien_decide: '', numero_candidatos_esperados: 3, perfiles_no_aceptados: '', experiencia_no_valida: '', zonas_no_viables: '', pretension_salarial_max: '', urgencia_vacante: '', exclusividad: 'no', honorarios_acordados: '', garantia: '', fecha_compromiso_terna: ''
    });

    useEffect(() => {
        cargarCatalogosBase();
    }, []);

    const cargarCatalogosBase = async () => {
        try {
            const [resCat, resEst] = await Promise.all([
                fetchConToken('/reclutamiento/categorias/'),
                fetchConToken('/reclutamiento/estados/')
            ]);
            if (resCat.ok) setCategorias(await resCat.json());
            if (resEst.ok) setEstados(await resEst.json());
        } catch (error) {
            console.error("Error al cargar catálogos:", error);
        }
    };

    const cargarMunicipios = async (estadoId) => {
        try {
            const res = await fetchConToken(`/reclutamiento/municipios/?estado=${estadoId}`);
            if (res.ok) setMunicipios(await res.json());
        } catch (error) {
            console.error(error);
        }
    };

    const autocompletarPorCategoria = async (categoriaId) => {
        if (!categoriaId) return;
        try {
            setCargando(true);
            const res = await fetchConToken(`/reclutamiento/vacantes/autocompletar/?categoria_id=${categoriaId}`);
            if (res.ok) {
                const data = await res.json();
                setFormData(prev => ({
                    ...prev,
                    sueldo_mercado: data.sueldo_promedio_base,
                    sueldo_ofertado: data.sueldo_promedio_base, // Sugerido
                    funciones_diarias_sugeridas: data.funciones,
                    responsabilidades_sugeridas: data.responsabilidades,
                    competencias_tecnicas_sugeridas: data.competencias_tecnicas,
                    competencias_blandas_sugeridas: data.competencias_blandas,
                    factores_exito_sugeridos: data.kpis
                }));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setCargando(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (name === 'estado_republica') {
            cargarMunicipios(value);
        }
        if (name === 'categoria_puesto') {
            const cat = categorias.find(c => c.id.toString() === value);
            if (cat) {
                setFormData(prev => ({ ...prev, nombre_puesto: cat.nombre }));
                autocompletarPorCategoria(value);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setCargando(true);
            const payload = { ...formData };
            // Convertir vacíos a null para campos FK y fechas si no se seleccionaron
            if (!payload.categoria_puesto) delete payload.categoria_puesto;
            if (!payload.estado_republica) delete payload.estado_republica;
            if (!payload.municipio) delete payload.municipio;
            if (!payload.fecha_ideal_ingreso) delete payload.fecha_ideal_ingreso;
            if (!payload.fecha_compromiso_terna) delete payload.fecha_compromiso_terna;
            if (!payload.pretension_salarial_max) delete payload.pretension_salarial_max;
            
            const res = await fetchConToken('/reclutamiento/vacantes/', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            
            if (!res.ok) throw new Error('Error al guardar la vacante');
            
            onGuardado();
        } catch (error) {
            alert(error.message);
        } finally {
            setCargando(false);
        }
    };

    const pasos = [
        { id: 1, title: 'Datos Cliente' },
        { id: 2, title: 'Datos Puesto' },
        { id: 3, title: 'Funciones & Perfil' },
        { id: 4, title: 'Condiciones' }
    ];

    const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0', boxSizing: 'border-box', fontSize: '14px' };
    const labelStyle = { display: 'block', fontSize: '13px', color: '#64748B', fontWeight: '600', marginBottom: '6px' };
    const textStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0', boxSizing: 'border-box', fontSize: '14px', minHeight: '80px', backgroundColor: '#F8FAFC' };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
            <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '16px', width: '90%', maxWidth: '900px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                
                {/* Header del Wizard */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #F1F5F9', paddingBottom: '16px' }}>
                    <h2 style={{ margin: 0, fontSize: '24px', color: '#1E293B', fontWeight: '800' }}>Perfilador de Vacante</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#94A3B8' }}>&times;</button>
                </div>

                {/* Stepper */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '14px', left: '0', width: '100%', height: '2px', backgroundColor: '#E2E8F0', zIndex: 0 }}></div>
                    {pasos.map((p) => (
                        <div key={p.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, backgroundColor: 'white', padding: '0 10px' }}>
                            <div style={{ 
                                width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',
                                backgroundColor: paso >= p.id ? '#0EA5E9' : '#F1F5F9',
                                color: paso >= p.id ? 'white' : '#94A3B8',
                                border: `2px solid ${paso >= p.id ? '#0EA5E9' : '#E2E8F0'}`,
                                transition: 'all 0.3s ease'
                            }}>
                                {paso > p.id ? <CheckCircle size={16} /> : p.id}
                            </div>
                            <span style={{ fontSize: '12px', marginTop: '8px', color: paso >= p.id ? '#0EA5E9' : '#94A3B8', fontWeight: '600' }}>{p.title}</span>
                        </div>
                    ))}
                </div>

                {/* Contenedor del Formulario (Scrollable) */}
                <div style={{ flex: 1, overflowY: 'auto', paddingRight: '12px' }}>
                    <form id="wizard-form" onSubmit={handleSubmit}>
                        
                        {/* PASO 1: CLIENTE */}
                        {paso === 1 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div><label style={labelStyle}>Cliente / Empresa *</label><input name="cliente" required value={formData.cliente} onChange={handleChange} style={inputStyle} /></div>
                                    <div><label style={labelStyle}>Giro de Industria</label><input name="giro_industria" value={formData.giro_industria} onChange={handleChange} style={inputStyle} /></div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div><label style={labelStyle}>Contacto Responsable</label><input name="contacto_responsable" value={formData.contacto_responsable} onChange={handleChange} style={inputStyle} /></div>
                                    <div><label style={labelStyle}>Puesto del Contacto</label><input name="puesto_contacto" value={formData.puesto_contacto} onChange={handleChange} style={inputStyle} /></div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={labelStyle}>Estado</label>
                                        <select name="estado_republica" value={formData.estado_republica} onChange={handleChange} style={inputStyle}>
                                            <option value="">Selecciona...</option>
                                            {estados.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Municipio</label>
                                        <select name="municipio" value={formData.municipio} onChange={handleChange} style={inputStyle}>
                                            <option value="">Selecciona...</option>
                                            {municipios.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* PASO 2: PUESTO */}
                        {paso === 2 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ backgroundColor: '#F0F9FF', padding: '16px', borderRadius: '8px', border: '1px dashed #7DD3FC' }}>
                                    <label style={{...labelStyle, color: '#0369A1'}}>Catálogo de Puestos (Autocompleta Perfil)</label>
                                    <select name="categoria_puesto" value={formData.categoria_puesto} onChange={handleChange} style={{...inputStyle, borderColor: '#7DD3FC'}}>
                                        <option value="">Selecciona un puesto del catálogo...</option>
                                        {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                                    </select>
                                    {cargando && <span style={{fontSize: '12px', color: '#0284C7', marginTop: '4px', display:'block'}}>Cargando datos del perfil...</span>}
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div><label style={labelStyle}>Nombre del Puesto *</label><input name="nombre_puesto" required value={formData.nombre_puesto} onChange={handleChange} style={inputStyle} /></div>
                                    <div><label style={labelStyle}>Sueldo Ofertado (MXN) *</label><input name="sueldo_ofertado" type="number" required value={formData.sueldo_ofertado} onChange={handleChange} style={inputStyle} /></div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                                    <div><label style={labelStyle}>Nivel</label>
                                        <select name="nivel_puesto" value={formData.nivel_puesto} onChange={handleChange} style={inputStyle}>
                                            <option value="operativo">Operativo</option>
                                            <option value="administrativo">Administrativo</option>
                                            <option value="mando_medio">Mando Medio</option>
                                            <option value="directivo">Directivo</option>
                                        </select>
                                    </div>
                                    <div><label style={labelStyle}>Tipo Contratación</label>
                                        <select name="tipo_contratacion" value={formData.tipo_contratacion} onChange={handleChange} style={inputStyle}>
                                            <option value="planta">Planta</option>
                                            <option value="temporal">Temporal</option>
                                            <option value="proyecto">Proyecto</option>
                                        </select>
                                    </div>
                                    <div><label style={labelStyle}>Modalidad</label>
                                        <select name="modalidad" value={formData.modalidad} onChange={handleChange} style={inputStyle}>
                                            <option value="presencial">Presencial</option>
                                            <option value="hibrido">Híbrido</option>
                                            <option value="home_office">Home Office</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* PASO 3: FUNCIONES Y PERFIL */}
                        {paso === 3 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={labelStyle}>Funciones Sugeridas (Catálogo)</label>
                                        <textarea readOnly value={formData.funciones_diarias_sugeridas} style={textStyle} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Funciones (Ajuste Cliente)</label>
                                        <textarea name="funciones_diarias_cliente" value={formData.funciones_diarias_cliente} onChange={handleChange} style={{...textStyle, backgroundColor:'white'}} placeholder="Agrega funciones específicas del cliente..." />
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={labelStyle}>Competencias Técnicas Sugeridas</label>
                                        <textarea readOnly value={formData.competencias_tecnicas_sugeridas} style={textStyle} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Competencias Técnicas (Ajuste Cliente)</label>
                                        <textarea name="competencias_tecnicas_cliente" value={formData.competencias_tecnicas_cliente} onChange={handleChange} style={{...textStyle, backgroundColor:'white'}} />
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div><label style={labelStyle}>Escolaridad Requerida</label><input name="escolaridad_requerida" value={formData.escolaridad_requerida} onChange={handleChange} style={inputStyle} /></div>
                                    <div><label style={labelStyle}>Años Experiencia Mínima</label><input type="number" name="experiencia_minima" value={formData.experiencia_minima} onChange={handleChange} style={inputStyle} /></div>
                                </div>
                            </div>
                        )}

                        {/* PASO 4: CONDICIONES */}
                        {paso === 4 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div><label style={labelStyle}>Herramientas / Equipo proporcionado</label><input name="herramientas_proporcionadas" value={formData.herramientas_proporcionadas} onChange={handleChange} style={inputStyle} placeholder="Laptop, Celular, Auto..." /></div>
                                    <div><label style={labelStyle}>Jornada</label>
                                        <select name="jornada" value={formData.jornada} onChange={handleChange} style={inputStyle}>
                                            <option value="completa">Completa</option>
                                            <option value="medio_tiempo">Medio Tiempo</option>
                                        </select>
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div><label style={labelStyle}>Pretensión Salarial Máx. Candidato</label><input type="number" name="pretension_salarial_max" value={formData.pretension_salarial_max} onChange={handleChange} style={inputStyle} /></div>
                                    <div><label style={labelStyle}>Número de Candidatos a Enviar</label><input type="number" name="numero_candidatos_esperados" value={formData.numero_candidatos_esperados} onChange={handleChange} style={inputStyle} /></div>
                                </div>
                                <div>
                                    <label style={labelStyle}>Perfiles No Aceptados (Filtro Rojo)</label>
                                    <textarea name="perfiles_no_aceptados" value={formData.perfiles_no_aceptados} onChange={handleChange} style={{...textStyle, backgroundColor: 'white'}} placeholder="Ej. Candidatos que vengan de la empresa X, o sin licencia de conducir..." />
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                {/* Footer / Controles */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #F1F5F9' }}>
                    <button 
                        type="button"
                        onClick={() => setPaso(p => Math.max(1, p - 1))}
                        disabled={paso === 1}
                        style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: 'white', color: '#475569', fontWeight: '600', cursor: paso === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', opacity: paso === 1 ? 0.5 : 1 }}
                    >
                        <ChevronLeft size={18} /> Atrás
                    </button>
                    
                    {paso < 4 ? (
                        <button 
                            type="button"
                            onClick={() => setPaso(p => Math.min(4, p + 1))}
                            style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#0EA5E9', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            Siguiente <ChevronRight size={18} />
                        </button>
                    ) : (
                        <button 
                            type="submit"
                            form="wizard-form"
                            disabled={cargando}
                            style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#10B981', color: 'white', fontWeight: '600', cursor: cargando ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            {cargando ? 'Guardando...' : <><Save size={18} /> Guardar Vacante</>}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WizardVacante;
