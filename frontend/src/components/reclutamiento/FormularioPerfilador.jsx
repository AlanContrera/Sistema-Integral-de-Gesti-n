import React, { useState, useEffect } from 'react';
import { fetchConToken } from '../../services/api';
import { Save, X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const FormularioPerfilador = ({ vacanteId, onClose, onGuardado }) => {
    const [cargando, setCargando] = useState(false);
    const [pasoActual, setPasoActual] = useState(1);
    const [btnGuardarHabilitado, setBtnGuardarHabilitado] = useState(false);

    useEffect(() => {
        if (pasoActual === 9) {
            setBtnGuardarHabilitado(false);
            const timer = setTimeout(() => {
                setBtnGuardarHabilitado(true);
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [pasoActual]);

    // Catálogos
    const [categorias, setCategorias] = useState([]);
    const [estados, setEstados] = useState([]);
    const [municipios, setMunicipios] = useState([]);
    const [giros, setGiros] = useState([]);

    // Estado del formulario
    const [formData, setFormData] = useState({
        // 1. DATOS DEL CLIENTE
        cliente: '', giro_industria: '', contacto_responsable: '', puesto_contacto: '', telefono_contacto: '', correo_contacto: '', razon_social: '', sitio_web: '',
        estado_republica: '', municipio: '',
        // 2. DATOS GENERALES DEL PUESTO
        nombre_puesto: '', categoria_puesto: '', area_departamento: '', jefe_directo: '', numero_vacantes: 1, motivo_vacante: 'nueva', fecha_ideal_ingreso: '', nivel_puesto: 'operativo', tipo_contratacion: 'planta',
        sueldo_ofertado: '', periodicidad_pago: 'mensual', jornada: 'completa', prestaciones: 'ley', pagos_adicionales: '', valor_estimado_mensual: 0,
        sueldo_mercado: '',
        // 4. FUNCIONES Y RESPONSABILIDADES
        funciones_diarias_sugeridas: '', funciones_diarias_cliente: '', responsabilidades_sugeridas: '', responsabilidades_cliente: '', kpis: '',
        // 5. PERFIL REQUERIDO
        escolaridad_requerida: '', carrera_especialidad: '', experiencia_minima: 0, experiencia_deseable: '', edad_deseada: '', idioma_requerido: '', herramientas: '[]', certificaciones: '', disponibilidad_viajar: 'pendiente', disponibilidad_rolar_turnos: '',
        // 6. COMPETENCIAS
        competencias_tecnicas_sugeridas: '', competencias_tecnicas_cliente: '', competencias_blandas_sugeridas: '', competencias_blandas_cliente: '', factores_exito_sugeridos: '', factores_exito_cliente: '',
        // 7. CONDICIONES LABORALES
        modalidad: 'presencial', horario: '', herramientas_proporcionadas: '',
        // 8. PROCESO DE SELECCIÓN
        entrevistas_requeridas: '', evaluaciones_requeridas: '', documentos_necesarios: '', tiempo_cobertura: '', quien_decide: '', numero_candidatos_esperados: 3,
        // 9. CRITERIOS DE DESCARTE
        perfiles_no_aceptados: '', experiencia_no_valida: '', zonas_no_viables: '', pretension_salarial_max: '',
        // 10. ACUERDOS COMERCIALES
        urgencia_vacante: '', exclusividad: 'no', honorarios_acordados: '', garantia: '', fecha_compromiso_terna: ''
    });

    useEffect(() => {
        cargarCatalogosBase();
        if (vacanteId) {
            cargarVacanteExistente(vacanteId);
        }
    }, [vacanteId]);

    const cargarVacanteExistente = async (id) => {
        try {
            setCargando(true);
            const res = await fetchConToken(`/reclutamiento/vacantes/${id}/`);
            if (res.ok) {
                const data = await res.json();
                setFormData(data);
                if (data.estado_republica) cargarMunicipios(data.estado_republica);
            }
        } catch (error) {
            console.error("Error al cargar la vacante:", error);
        } finally {
            setCargando(false);
        }
    };


    const cargarCatalogosBase = async () => {
        try {
            const [resCat, resEst, resGiros] = await Promise.all([
                fetchConToken('/reclutamiento/categorias/'),
                fetchConToken('/reclutamiento/estados/'),
                fetchConToken('/reclutamiento/categorias/giros_unicos/') // <--- AGREGAR ESTA LÍNEA
            ]);
            if (resCat.ok) setCategorias(await resCat.json());
            if (resEst.ok) setEstados(await resEst.json());
            if (resGiros.ok) setGiros(await resGiros.json()); // <--- AGREGAR ESTA LÍNEA
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
                    sueldo_ofertado: data.sueldo_promedio_base,
                    funciones_diarias_sugeridas: data.funciones,
                    responsabilidades_sugeridas: data.responsabilidades,
                    competencias_tecnicas_sugeridas: data.competencias_tecnicas,
                    competencias_blandas_sugeridas: data.competencias_blandas,
                    factores_exito_sugeridos: data.kpis
                }));
                toast.success('Datos del catálogo cargados exitosamente (Funciones, competencias y sueldo sugerido).', { duration: 4000 });
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
            if (!payload.categoria_puesto) delete payload.categoria_puesto;
            if (!payload.estado_republica) delete payload.estado_republica;
            if (!payload.municipio) delete payload.municipio;
            if (!payload.fecha_ideal_ingreso) delete payload.fecha_ideal_ingreso;
            if (!payload.fecha_compromiso_terna) delete payload.fecha_compromiso_terna;
            if (!payload.pretension_salarial_max) delete payload.pretension_salarial_max;

            const url = vacanteId ? `/reclutamiento/vacantes/${vacanteId}/` : '/reclutamiento/vacantes/';
            const method = vacanteId ? 'PUT' : 'POST';

            const res = await fetchConToken(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error('Error al guardar en el servidor');

            toast.success('¡Perfilador Guardado Correctamente!');
            setTimeout(() => {
                onGuardado();
            }, 1500);
        } catch (error) {
            toast.error(error.message);
            setCargando(false);
        }
    };

    const validarPaso = () => {
        if (pasoActual === 1 && !formData.cliente) { toast.error('Falta Empresa / Cliente'); return false; }
        if (pasoActual === 2 && !formData.categoria_puesto) { toast.error('Falta Nombre del Puesto'); return false; }
        if (pasoActual === 6 && !formData.sueldo_ofertado) { toast.error('Falta Sueldo Ofertado'); return false; }
        return true;
    };

    const handleSiguiente = () => {
        if (validarPaso()) {
            setPasoActual(prev => prev + 1);
        }
    };

    const sectionTitleStyle = { backgroundColor: '#96C2DB', color: '#FFF', padding: '10px 16px', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '16px', marginBottom: '16px', borderRadius: '4px' };
    const labelStyle = { display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '4px' };
    const inputStyle = { width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #CBD5E1', borderRadius: '4px', backgroundColor: '#FFF', boxSizing: 'border-box' };
    const textStyle = { ...inputStyle, minHeight: '80px', resize: 'vertical' };
    const gridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' };
    const grid3Style = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' };

    return (
        <div style={{ backgroundColor: '#F8FAFC', width: '100%', borderRadius: '12px', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0', paddingBottom: '32px', position: 'relative' }}>
            <Toaster position="top-right" />
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', borderRadius: '12px 12px 0 0' }}>
                <div>
                    <h2 style={{ margin: 0, color: '#0F172A', fontSize: '20px' }}>PERFILADOR DE PUESTO / LEVANTAMIENTO DE VACANTE</h2>
                    <span style={{ fontSize: '14px', color: '#64748B', fontWeight: '600' }}>Paso {pasoActual} de 9</span>
                </div>
                {onClose && <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}><X size={24} /></button>}
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
                <form 
                    id="perfiladorForm" 
                    onSubmit={handleSubmit}
                    onKeyDown={(e) => {
                        // Evitar submit con Enter a menos que estemos en un textarea
                        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                            e.preventDefault();
                        }
                    }}
                >

                    <div style={{ display: pasoActual === 1 ? 'block' : 'none', animation: 'fadeIn 0.3s' }}>
                        <div style={sectionTitleStyle}>1. DATOS DEL CLIENTE</div>
                        <div style={gridStyle}>
                            <div><label style={labelStyle}>Empresa / Cliente *</label><input required type="text" name="cliente" value={formData.cliente} onChange={handleChange} style={inputStyle} /></div>
                            <div>
                                <label style={labelStyle}>Giro / industria</label>
                                <select name="giro_industria" value={formData.giro_industria} onChange={handleChange} style={inputStyle}>
                                    <option value="">Seleccione el giro...</option>
                                    {giros.map((giro, index) => (
                                        <option key={index} value={giro}>{giro}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div style={gridStyle}>
                            <div><label style={labelStyle}>Contacto responsable</label><input type="text" name="contacto_responsable" value={formData.contacto_responsable} onChange={handleChange} style={inputStyle} /></div>
                            <div><label style={labelStyle}>Puesto del contacto</label><input type="text" name="puesto_contacto" value={formData.puesto_contacto} onChange={handleChange} style={inputStyle} /></div>
                        </div>
                        <div style={gridStyle}>
                            <div><label style={labelStyle}>Teléfono</label><input type="text" name="telefono_contacto" value={formData.telefono_contacto} onChange={handleChange} style={inputStyle} /></div>
                            <div><label style={labelStyle}>Correo</label><input type="email" name="correo_contacto" value={formData.correo_contacto} onChange={handleChange} style={inputStyle} /></div>
                        </div>
                        <div style={gridStyle}>
                            <div><label style={labelStyle}>Razón social / unidad de negocio</label><input type="text" name="razon_social" value={formData.razon_social} onChange={handleChange} style={inputStyle} /></div>
                            <div><label style={labelStyle}>Sitio Web</label><input type="text" name="sitio_web" value={formData.sitio_web} onChange={handleChange} style={inputStyle} /></div>
                        </div>
                        <div style={gridStyle}>
                            <div>
                                <label style={labelStyle}>Estado (Ubicación vacante)</label>
                                <select name="estado_republica" value={formData.estado_republica} onChange={handleChange} style={inputStyle}>
                                    <option value="">Seleccione...</option>
                                    {estados.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Municipio o Alcaldía</label>
                                <select name="municipio" value={formData.municipio} onChange={handleChange} style={inputStyle}>
                                    <option value="">Seleccione...</option>
                                    {municipios.map(m => <option key={m.id} value={m.id}>{m.nombre} (Factor: {m.factor_ubicacion})</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: pasoActual === 2 ? 'block' : 'none', animation: 'fadeIn 0.3s' }}>
                        <div style={sectionTitleStyle}>2. DATOS GENERALES DEL PUESTO</div>
                        <div style={gridStyle}>
                            <div>
                                <label style={labelStyle}>Nombre del Puesto (Catálogo) *</label>
                                <select name="categoria_puesto" value={formData.categoria_puesto} onChange={handleChange} style={inputStyle} required>
                                    <option value="">Seleccione puesto para autocompletar...</option>
                                    {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                                </select>
                            </div>
                            <div><label style={labelStyle}>Área / departamento</label><input type="text" name="area_departamento" value={formData.area_departamento} onChange={handleChange} style={inputStyle} /></div>
                        </div>
                        <div style={grid3Style}>
                            <div><label style={labelStyle}>Jefe directo</label><input type="text" name="jefe_directo" value={formData.jefe_directo} onChange={handleChange} style={inputStyle} /></div>
                            <div><label style={labelStyle}>Número de vacantes</label><input type="number" name="numero_vacantes" value={formData.numero_vacantes} onChange={handleChange} style={inputStyle} min="1" /></div>
                            <div>
                                <label style={labelStyle}>Motivo de la vacante</label>
                                <select name="motivo_vacante" value={formData.motivo_vacante} onChange={handleChange} style={inputStyle}>
                                    <option value="nueva">Nueva creación</option>
                                    <option value="reemplazo">Reemplazo</option>
                                    <option value="temporal">Temporal</option>
                                </select>
                            </div>
                        </div>
                        <div style={grid3Style}>
                            <div><label style={labelStyle}>Fecha ideal de ingreso</label><input type="date" name="fecha_ideal_ingreso" value={formData.fecha_ideal_ingreso} onChange={handleChange} style={inputStyle} /></div>
                            <div>
                                <label style={labelStyle}>Nivel del puesto</label>
                                <select name="nivel_puesto" value={formData.nivel_puesto} onChange={handleChange} style={inputStyle}>
                                    <option value="operativo">Operativo</option>
                                    <option value="administrativo">Administrativo</option>
                                    <option value="mando_medio">Mando Medio</option>
                                    <option value="directivo">Directivo</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Tipo de contratación</label>
                                <select name="tipo_contratacion" value={formData.tipo_contratacion} onChange={handleChange} style={inputStyle}>
                                    <option value="planta">Planta</option>
                                    <option value="temporal">Temporal</option>
                                    <option value="proyecto">Proyecto</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: pasoActual === 3 ? 'block' : 'none', animation: 'fadeIn 0.3s' }}>
                        <div style={sectionTitleStyle}>3. OBJETIVO DEL PUESTO & 4. FUNCIONES</div>
                        <div style={gridStyle}>
                            <div><label style={labelStyle}>Funciones diarias propuestas (Base Datos)</label><textarea name="funciones_diarias_sugeridas" value={formData.funciones_diarias_sugeridas} onChange={handleChange} style={{ ...textStyle, backgroundColor: '#F8FAFC' }} readOnly></textarea></div>
                            <div><label style={labelStyle}>Funciones diarias por el Cliente (Ajustes)</label><textarea name="funciones_diarias_cliente" value={formData.funciones_diarias_cliente} onChange={handleChange} style={textStyle}></textarea></div>
                        </div>
                        <div style={gridStyle}>
                            <div><label style={labelStyle}>Responsabilidades críticas Propuestas</label><textarea name="responsabilidades_sugeridas" value={formData.responsabilidades_sugeridas} onChange={handleChange} style={{ ...textStyle, backgroundColor: '#F8FAFC' }} readOnly></textarea></div>
                            <div><label style={labelStyle}>Responsabilidades críticas Cliente</label><textarea name="responsabilidades_cliente" value={formData.responsabilidades_cliente} onChange={handleChange} style={textStyle}></textarea></div>
                        </div>
                        <div><label style={labelStyle}>Indicadores o KPIs del puesto</label><textarea name="kpis" value={formData.kpis} onChange={handleChange} style={textStyle}></textarea></div>
                    </div>

                    <div style={{ display: pasoActual === 4 ? 'block' : 'none', animation: 'fadeIn 0.3s' }}>
                        <div style={sectionTitleStyle}>5. PERFIL REQUERIDO</div>
                        <div style={grid3Style}>
                            <div><label style={labelStyle}>Escolaridad mínima</label><input type="text" name="escolaridad_requerida" value={formData.escolaridad_requerida} onChange={handleChange} style={inputStyle} /></div>
                            <div><label style={labelStyle}>Carrera / especialidad</label><input type="text" name="carrera_especialidad" value={formData.carrera_especialidad} onChange={handleChange} style={inputStyle} /></div>
                            <div>
                                <label style={labelStyle}>Certificaciones</label>
                                <select name="certificaciones" value={formData.certificaciones} onChange={handleChange} style={inputStyle}>
                                    <option value="">Ninguna</option>
                                    <option value="titulo">Título</option>
                                    <option value="titulo_cedula">Título y Cédula</option>
                                </select>
                            </div>
                        </div>
                        <div style={grid3Style}>
                            <div><label style={labelStyle}>Experiencia mínima (Años)</label><input type="number" name="experiencia_minima" value={formData.experiencia_minima} onChange={handleChange} style={inputStyle} /></div>
                            <div><label style={labelStyle}>Experiencia deseable</label><input type="text" name="experiencia_deseable" value={formData.experiencia_deseable} onChange={handleChange} style={inputStyle} /></div>
                            <div><label style={labelStyle}>Edad deseada</label><input type="text" name="edad_deseada" value={formData.edad_deseada} onChange={handleChange} style={inputStyle} /></div>
                        </div>
                        <div style={grid3Style}>
                            <div><label style={labelStyle}>Idioma requerido</label><input type="text" name="idioma_requerido" value={formData.idioma_requerido} onChange={handleChange} style={inputStyle} /></div>
                            <div>
                                <label style={labelStyle}>Disponibilidad para viajar</label>
                                <select name="disponibilidad_viajar" value={formData.disponibilidad_viajar} onChange={handleChange} style={inputStyle}>
                                    <option value="pendiente">Pendiente</option>
                                    <option value="no_disponible">No disponible</option>
                                    <option value="ocasional">Ocasional</option>
                                    <option value="nacional">Nacional</option>
                                </select>
                            </div>
                            <div><label style={labelStyle}>Rolar turnos</label><input type="text" name="disponibilidad_rolar_turnos" value={formData.disponibilidad_rolar_turnos} onChange={handleChange} style={inputStyle} /></div>
                        </div>
                    </div>

                    <div style={{ display: pasoActual === 5 ? 'block' : 'none', animation: 'fadeIn 0.3s' }}>
                        <div style={sectionTitleStyle}>6. COMPETENCIAS</div>
                        <div style={gridStyle}>
                            <div><label style={labelStyle}>Competencias técnicas (Base Datos)</label><textarea name="competencias_tecnicas_sugeridas" value={formData.competencias_tecnicas_sugeridas} onChange={handleChange} style={{ ...textStyle, backgroundColor: '#F8FAFC' }} readOnly></textarea></div>
                            <div><label style={labelStyle}>Competencias técnicas (Cliente)</label><textarea name="competencias_tecnicas_cliente" value={formData.competencias_tecnicas_cliente} onChange={handleChange} style={textStyle}></textarea></div>
                        </div>
                        <div style={gridStyle}>
                            <div><label style={labelStyle}>Competencias blandas (Base Datos)</label><textarea name="competencias_blandas_sugeridas" value={formData.competencias_blandas_sugeridas} onChange={handleChange} style={{ ...textStyle, backgroundColor: '#F8FAFC' }} readOnly></textarea></div>
                            <div><label style={labelStyle}>Competencias blandas (Cliente)</label><textarea name="competencias_blandas_cliente" value={formData.competencias_blandas_cliente} onChange={handleChange} style={textStyle}></textarea></div>
                        </div>
                        <div style={gridStyle}>
                            <div><label style={labelStyle}>Factores clave de éxito (Base Datos)</label><textarea name="factores_exito_sugeridos" value={formData.factores_exito_sugeridos} onChange={handleChange} style={{ ...textStyle, backgroundColor: '#F8FAFC' }} readOnly></textarea></div>
                            <div><label style={labelStyle}>Factores clave de éxito (Cliente)</label><textarea name="factores_exito_cliente" value={formData.factores_exito_cliente} onChange={handleChange} style={textStyle}></textarea></div>
                        </div>
                    </div>

                    <div style={{ display: pasoActual === 6 ? 'block' : 'none', animation: 'fadeIn 0.3s' }}>
                        <div style={sectionTitleStyle}>7. CONDICIONES LABORALES</div>
                        <div style={grid3Style}>
                            <div>
                                <label style={labelStyle}>Modalidad</label>
                                <select name="modalidad" value={formData.modalidad} onChange={handleChange} style={inputStyle}>
                                    <option value="presencial">Presencial</option>
                                    <option value="hibrido">Híbrido</option>
                                    <option value="home_office">Home Office</option>
                                </select>
                            </div>
                            <div><label style={labelStyle}>Horario</label><input type="text" name="horario" value={formData.horario} onChange={handleChange} style={inputStyle} /></div>
                            <div><label style={labelStyle}>Herramientas proporcionadas</label><input type="text" name="herramientas_proporcionadas" value={formData.herramientas_proporcionadas} onChange={handleChange} style={inputStyle} /></div>
                        </div>
                        <div style={{ backgroundColor: '#F1F5F9', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px' }}>Datos Salariales</h4>
                            <div style={grid3Style}>
                                <div><label style={labelStyle}>Sueldo Mensual Ofrecido *</label><input required type="number" step="0.01" name="sueldo_ofertado" value={formData.sueldo_ofertado} onChange={handleChange} style={inputStyle} /></div>
                                <div>
                                    <label style={labelStyle}>Periodicidad de pago</label>
                                    <select name="periodicidad_pago" value={formData.periodicidad_pago} onChange={handleChange} style={inputStyle}>
                                        <option value="mensual">Mensual</option>
                                        <option value="semanal">Semanal</option>
                                        <option value="quincenal">Quincenal</option>
                                    </select>
                                </div>
                                <div><label style={labelStyle}>Promedio Base Mercado</label><input type="text" value={formData.sueldo_mercado ? `$${formData.sueldo_mercado}` : '$0.00'} disabled style={{ ...inputStyle, backgroundColor: '#E2E8F0', fontWeight: 'bold' }} /></div>
                            </div>
                            <div style={grid3Style}>
                                <div>
                                    <label style={labelStyle}>Jornada</label>
                                    <select name="jornada" value={formData.jornada} onChange={handleChange} style={inputStyle}>
                                        <option value="completa">Completa</option>
                                        <option value="medio_tiempo">Medio Tiempo</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Prestaciones</label>
                                    <select name="prestaciones" value={formData.prestaciones} onChange={handleChange} style={inputStyle}>
                                        <option value="ley">Ley</option>
                                        <option value="superiores">Superiores</option>
                                        <option value="honorarios">Honorarios</option>
                                    </select>
                                </div>
                                <div><label style={labelStyle}>Pagos Adicionales (y Valor)</label><div style={{ display: 'flex', gap: '8px' }}><input type="text" name="pagos_adicionales" value={formData.pagos_adicionales} onChange={handleChange} style={inputStyle} placeholder="Bonos" /><input type="number" name="valor_estimado_mensual" value={formData.valor_estimado_mensual} onChange={handleChange} style={{ ...inputStyle, width: '100px' }} placeholder="$" /></div></div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: pasoActual === 7 ? 'block' : 'none', animation: 'fadeIn 0.3s' }}>
                        <div style={sectionTitleStyle}>8. PROCESO DE SELECCIÓN</div>
                        <div style={grid3Style}>
                            <div><label style={labelStyle}>Entrevistas requeridas</label><input type="text" name="entrevistas_requeridas" value={formData.entrevistas_requeridas} onChange={handleChange} style={inputStyle} /></div>
                            <div><label style={labelStyle}>Evaluaciones requeridas</label><input type="text" name="evaluaciones_requeridas" value={formData.evaluaciones_requeridas} onChange={handleChange} style={inputStyle} /></div>
                            <div><label style={labelStyle}>Documentos necesarios</label><input type="text" name="documentos_necesarios" value={formData.documentos_necesarios} onChange={handleChange} style={inputStyle} /></div>
                        </div>
                        <div style={grid3Style}>
                            <div><label style={labelStyle}>Tiempo ideal de cobertura</label><input type="text" name="tiempo_cobertura" value={formData.tiempo_cobertura} onChange={handleChange} style={inputStyle} /></div>
                            <div><label style={labelStyle}>Quién toma la decisión final</label><input type="text" name="quien_decide" value={formData.quien_decide} onChange={handleChange} style={inputStyle} /></div>
                            <div><label style={labelStyle}>Candidatos esperados</label><input type="number" name="numero_candidatos_esperados" value={formData.numero_candidatos_esperados} onChange={handleChange} style={inputStyle} min="1" /></div>
                        </div>
                    </div>

                    <div style={{ display: pasoActual === 8 ? 'block' : 'none', animation: 'fadeIn 0.3s' }}>
                        <div style={sectionTitleStyle}>9. CRITERIOS DE DESCARTE</div>
                        <div style={gridStyle}>
                            <div><label style={labelStyle}>Perfiles no aceptados</label><textarea name="perfiles_no_aceptados" value={formData.perfiles_no_aceptados} onChange={handleChange} style={textStyle}></textarea></div>
                            <div><label style={labelStyle}>Experiencia no válida</label><textarea name="experiencia_no_valida" value={formData.experiencia_no_valida} onChange={handleChange} style={textStyle}></textarea></div>
                        </div>
                        <div style={gridStyle}>
                            <div><label style={labelStyle}>Zonas no viables</label><input type="text" name="zonas_no_viables" value={formData.zonas_no_viables} onChange={handleChange} style={inputStyle} /></div>
                            <div><label style={labelStyle}>Pretensión salarial máxima</label><input type="number" step="0.01" name="pretension_salarial_max" value={formData.pretension_salarial_max} onChange={handleChange} style={inputStyle} /></div>
                        </div>
                    </div>

                    <div style={{ display: pasoActual === 9 ? 'block' : 'none', animation: 'fadeIn 0.3s' }}>
                        <div style={sectionTitleStyle}>10. ACUERDOS COMERCIALES</div>
                        <div style={grid3Style}>
                            <div><label style={labelStyle}>Urgencia vacante</label><input type="text" name="urgencia_vacante" value={formData.urgencia_vacante} onChange={handleChange} style={inputStyle} /></div>
                            <div>
                                <label style={labelStyle}>Exclusividad</label>
                                <select name="exclusividad" value={formData.exclusividad} onChange={handleChange} style={inputStyle}>
                                    <option value="no">No</option>
                                    <option value="si">Sí</option>
                                </select>
                            </div>
                            <div><label style={labelStyle}>Honorarios acordados</label><input type="text" name="honorarios_acordados" value={formData.honorarios_acordados} onChange={handleChange} style={inputStyle} /></div>
                        </div>
                        <div style={gridStyle}>
                            <div>
                                <label style={labelStyle}>Garantía</label>
                                <select name="garantia" value={formData.garantia} onChange={handleChange} style={inputStyle}>
                                    <option value="">Seleccione...</option>
                                    <option value="7_dias">7 días</option>
                                    <option value="15_dias">15 días</option>
                                    <option value="30_dias">30 días</option>
                                    <option value="90_dias">90 días</option>
                                </select>
                            </div>
                            <div><label style={labelStyle}>Fecha compromiso terna</label><input type="date" name="fecha_compromiso_terna" value={formData.fecha_compromiso_terna} onChange={handleChange} style={inputStyle} /></div>
                        </div>
                    </div>
                </form>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '24px 32px', borderTop: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', borderRadius: '0 0 12px 12px' }}>
                {pasoActual > 1 ? (
                    <button type="button" onClick={() => setPasoActual(pasoActual - 1)} style={{ backgroundColor: '#FFF', color: '#64748B', border: '1px solid #CBD5E1', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Atrás
                    </button>
                ) : (
                    <div></div>
                )}

                {pasoActual < 9 ? (
                    <button type="button" onClick={handleSiguiente} style={{ backgroundColor: '#96C2DB', color: '#FFF', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Siguiente
                    </button>
                ) : (
                    <button
                        form="perfiladorForm"
                        type="submit"
                        disabled={cargando || !btnGuardarHabilitado}
                        style={{
                            backgroundColor: (!btnGuardarHabilitado) ? '#94A3B8' : '#10B981', color: '#FFF',
                            padding: '12px 32px', borderRadius: '12px',
                            border: 'none', cursor: (!btnGuardarHabilitado) ? 'not-allowed' : 'pointer',
                            boxShadow: (!btnGuardarHabilitado) ? 'none' : '0 4px 6px -1px rgba(16, 185, 129, 0.4)',
                            display: 'flex', alignItems: 'center', gap: '8px',
                            fontSize: '15px', fontWeight: 'bold',
                            opacity: cargando ? 0.7 : 1,
                            transition: 'all 0.3s'
                        }}
                    >
                        <Save size={20} />
                        {cargando ? 'Guardando...' : 'Finalizar y Guardar'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default FormularioPerfilador;