import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate, useParams } from 'react-router-dom';
import { LayoutDashboard, FileText, ArrowRightLeft, Menu, X, Home, Search } from 'lucide-react';
import { getComprobantes, getFacturas, getCorreos, getCatalogos } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { toast } from 'react-hot-toast';

// Importamos nuestros componentes extraídos
import ModalVistaPrevia from '../components/ModalVistaPrevia';
import VistaFacturas from '../components/VistaFacturas';
import VistaBuzon from '../components/VistaBuzon';
import VistaExpediente from '../components/VistaExpediente';

function VistaIngresos({ correosPadre, setSeleccionado, busquedaGlobal }) {
  const { tipoFiltro } = useParams();
  const navigate = useNavigate();
  const filtroActual = tipoFiltro || 'todos';

  return (
    <>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '2px solid #E2E8F0', paddingBottom: '12px' }}>
        {['todos', 'retorno', 'asimilado', 'confirmacion', 'blindado', 'bancarizacion'].map(tab => (
          <button
            key={tab}
            onClick={() => navigate(`/pagos/ingresos/${tab}`)}
            style={{
              background: filtroActual === tab ? '#EFF6FF' : 'transparent',
              color: filtroActual === tab ? '#2563EB' : '#64748B',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {tab === 'todos' ? 'Todos' : tab}
          </button>
        ))}
      </div>
      <VistaBuzon
        correosPadre={correosPadre}
        tipoFiltro={filtroActual}
        busquedaGlobal={busquedaGlobal} // <-- Le conectamos el cable a este que sí es el bueno
        onSelectExpediente={(exp) => {
          if (exp) navigate(`/pagos/ingresos/expediente/${exp.id}`);
        }}
      />
    </>
  );
}

function VistaExpedienteWrapper({ correosPadre, setSeleccionado }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const expediente = correosPadre.find(c => c.id.toString() === id);

  if (!expediente) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>Cargando datos de la operación...</div>;
  }

  return (
    <VistaExpediente
      expediente={expediente}
      onVolver={() => navigate(-1)}
      onVerComprobante={setSeleccionado}
    />
  );
}

function AppSkeleton() {
  return (
    <div style={{ padding: '0px', display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', animation: 'fadeIn 0.3s ease' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div className="skeleton-box" style={{ height: '140px', borderRadius: '16px' }}></div>
        <div className="skeleton-box" style={{ height: '140px', borderRadius: '16px' }}></div>
        <div className="skeleton-box" style={{ height: '350px', borderRadius: '16px' }}></div>
      </div>
      <div className="skeleton-box" style={{ height: '400px', borderRadius: '16px' }}></div>
    </div>
  );
}

function ModuloPagos() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const seccionActiva = pathParts[2] || 'dashboard';
  const subSeccion = pathParts[3] || 'todos';

  const [comprobantes, setComprobantes] = useState([]);
  const [facturas, setFacturas] = useState([]);
  const [correosPadre, setCorreosPadre] = useState([]);
  const [catalogos, setCatalogos] = useState({ empresas: [], bancos: [] });
  const [cargando, setCargando] = useState(true);
  const [seleccionado, setSeleccionado] = useState(null);
  const [sidebarAbierta, setSidebarAbierta] = useState(true);
  const isMobile = window.innerWidth <= 768;

  const datosDashboard = [
    { nombre: 'Facturas', cantidad: facturas.length },
    { nombre: 'Transferencias', cantidad: comprobantes.length }
  ];

  const retornos = correosPadre.filter(correo => correo.tipo_ingreso === 'retorno').length;
  const asimilados = correosPadre.filter(correo => correo.tipo_ingreso === 'asimilado').length;
  const blindados = correosPadre.filter(correo => correo.tipo_ingreso === 'blindado').length;
  const confirmacion = correosPadre.filter(correo => correo.tipo_ingreso === 'confirmacion').length;

  const datosPastel = [
    { nombre: 'Retornos', cantidad: retornos, color: '#3B82F6' },
    { nombre: 'Asimilados', cantidad: asimilados, color: '#10B981' },
    { nombre: 'Blindados', cantidad: blindados, color: '#F59E0B' },
    { nombre: 'Confirmación', cantidad: confirmacion, color: '#ff3535ff' }
  ].filter(dato => dato.cantidad > 0);

  // Creamos un espía para cada lista
  const primeraCarga = useRef(true);
  const pagosAnteriores = useRef(0);
  const facturasAnteriores = useRef(0);

  useEffect(() => {
    // 1. Si es la primera vez que carga, solo tomamos foto de cuántos hay
    if (primeraCarga.current) {
      if (comprobantes.length > 0 || facturas.length > 0) {
        primeraCarga.current = false;
        pagosAnteriores.current = comprobantes.length;
        facturasAnteriores.current = facturas.length;
      }
      return;
    }

    // 2. ¿Llegó un Pago Nuevo? (Notificación Verde)
    if (comprobantes.length > pagosAnteriores.current) {
      const nuevo = comprobantes[0];
      const cliente = nuevo?.empresa_destino || nuevo?.empresa_correo || 'Cliente Nuevo';

      toast.custom((t) => (
        <div onClick={() => { toast.dismiss(t.id); if (nuevo?.correo_padre) navigate(`/pagos/ingresos/expediente/${nuevo.correo_padre}`); }}
          style={{ background: '#FFFFFF', borderLeft: '5px solid #10B981', padding: '16px 20px', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
          <strong style={{ color: '#0F172A', fontSize: '15px' }}>🔔 ¡Nuevo Ingreso en {cliente}!</strong>
          <span style={{ color: '#475569', fontSize: '14px' }}>Monto: ${Number(nuevo?.monto_extraido || nuevo?.monto_correo || 0).toLocaleString('es-MX')}</span>
        </div>
      ), { duration: 8000 });

      pagosAnteriores.current = comprobantes.length;
    }

    // 3. ¿Llegó una Factura Nueva? (Notificación Azul)
    if (facturas.length > facturasAnteriores.current) {
      const nueva = facturas[0];
      toast.custom((t) => (
        <div onClick={() => toast.dismiss(t.id)}
          style={{ background: '#FFFFFF', borderLeft: '5px solid #3B82F6', padding: '16px 20px', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
          <strong style={{ color: '#0F172A', fontSize: '15px' }}>📄 ¡Nueva Factura Registrada!</strong>
          <span style={{ color: '#475569', fontSize: '14px' }}>Emisor: {nueva?.emisor || 'Desconocido'} | Folio: {nueva?.folio}</span>
        </div>
      ), { duration: 8000 });

      facturasAnteriores.current = facturas.length;
    }

  }, [comprobantes, facturas]); // <--- Le decimos a React que vigile AMBAS variables


  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      const [comps, facts, correos, cat] = await Promise.all([
        getComprobantes(),
        getFacturas(),
        getCorreos(),
        getCatalogos()
      ]);
      if (isMounted) {
        setComprobantes(comps);
        setFacturas(facts);
        setCorreosPadre(correos);
        setCatalogos(cat);
        setCargando(false);
      }
    };

    fetchData(); // Carga inicial
    const interval = setInterval(fetchData, 15000); // Polling cada 15 segundos para auto-refrescar

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const cambiarSeccion = (seccion) => {
    navigate(`/pagos/${seccion}`);
    setSeleccionado(null);
    if (isMobile) setSidebarAbierta(false);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-main)', fontFamily: "'Inter', sans-serif", overflow: 'hidden' }}>

      {/* Modal View */}
      <ModalVistaPrevia
        seleccionado={seleccionado}
        onCerrar={() => setSeleccionado(null)}
        catalogos={catalogos}
      />

      {/* Botón flotante para mobile */}
      {isMobile && (
        <button
          onClick={() => setSidebarAbierta(!sidebarAbierta)}
          style={{ position: 'fixed', top: '20px', left: '20px', zIndex: 100, background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '8px', padding: '10px', boxShadow: 'var(--shadow-md)' }}
        >
          {sidebarAbierta ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      {/* Sidebar */}
      <aside style={{
        width: sidebarAbierta ? '280px' : '80px',
        background: '#FFFFFF',
        borderRight: '1px solid var(--border-light)',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        position: isMobile ? 'fixed' : 'relative',
        height: '100vh',
        zIndex: 50,
        transform: isMobile && !sidebarAbierta ? 'translateX(-100%)' : 'translateX(0)',
        boxShadow: isMobile ? 'var(--shadow-lg)' : 'none'
      }}>
        <div style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: sidebarAbierta ? 'flex-start' : 'center', borderBottom: '1px solid var(--border-light)' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
            PM
          </div>
          {sidebarAbierta && <span style={{ marginLeft: '12px', fontSize: '18px', fontWeight: '800', color: 'var(--color-primary)', letterSpacing: '-0.5px' }}>Partners</span>}
        </div>

        <nav style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <button onClick={() => cambiarSeccion('dashboard')} style={{ background: seccionActiva === 'dashboard' ? '#EFF6FF' : 'transparent', color: seccionActiva === 'dashboard' ? 'var(--color-primary)' : 'var(--text-muted)', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontWeight: '600', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: sidebarAbierta ? 'flex-start' : 'center', gap: sidebarAbierta ? '16px' : '0', fontSize: '14px' }}>
            <LayoutDashboard size={22} style={{ minWidth: '22px' }} />
            {sidebarAbierta && <span style={{ whiteSpace: 'nowrap' }}>Dashboard</span>}
          </button>
          <button onClick={() => cambiarSeccion('facturas')} style={{ background: seccionActiva === 'facturas' ? '#EFF6FF' : 'transparent', color: seccionActiva === 'facturas' ? 'var(--color-primary)' : 'var(--text-muted)', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontWeight: '600', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: sidebarAbierta ? 'flex-start' : 'center', gap: sidebarAbierta ? '16px' : '0', fontSize: '14px' }}>
            <FileText size={22} style={{ minWidth: '22px' }} />
            {sidebarAbierta && <span style={{ whiteSpace: 'nowrap' }}>Facturas</span>}
          </button>

          <button onClick={() => { cambiarSeccion('ingresos'); setIngresoActivo('todos'); }} style={{ background: seccionActiva === 'ingresos' ? '#EFF6FF' : 'transparent', color: seccionActiva === 'ingresos' ? 'var(--color-primary)' : 'var(--text-muted)', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontWeight: '600', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: sidebarAbierta ? 'flex-start' : 'center', gap: sidebarAbierta ? '16px' : '0', fontSize: '14px' }}>
            <ArrowRightLeft size={22} style={{ minWidth: '22px' }} />
            {sidebarAbierta && <span style={{ whiteSpace: 'nowrap' }}>Ingresos</span>}
          </button>

          <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #E2E8F0' }}>
            <button onClick={() => navigate('/')} style={{ background: 'transparent', color: '#64748B', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontWeight: '600', transition: 'all 0.2s ease', width: '100%', display: 'flex', alignItems: 'center', justifyContent: sidebarAbierta ? 'flex-start' : 'center', gap: sidebarAbierta ? '16px' : '0', fontSize: '14px', overflow: 'hidden' }}>
              <Home size={22} style={{ minWidth: '22px' }} />
              {sidebarAbierta && <span style={{ whiteSpace: 'nowrap' }}>Volver al Inicio</span>}
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Header Superior */}
        <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '30px', fontWeight: '700', color: 'var(--color-primary)', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
              {seccionActiva === 'dashboard' && 'Resumen Operativo'}
              {seccionActiva === 'facturas' && 'Control de Facturas'}
              {seccionActiva === 'ingresos' && subSeccion === 'expediente' && 'Detalle de Operación'}
              {seccionActiva === 'ingresos' && subSeccion !== 'expediente' && (
                subSeccion === 'retorno' ? 'Retorno de Transferencia' :
                  subSeccion === 'asimilado' ? 'Asimilados' :
                    subSeccion === 'confirmacion' ? 'Confirmación de Pago' :
                      subSeccion === 'blindado' ? 'Blindado' :
                        subSeccion === 'bancarizacion' ? 'Bancarización' : 'Todos los Ingresos'
              )}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#FFFFFF', padding: '10px 20px', borderRadius: '50px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-light)' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px' }}>AD</div>
            <div>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: 'var(--color-primary)' }}>Administrador</p>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>admin@pm-partners.com</p>
            </div>
          </div>
        </header>

        {cargando ? <AppSkeleton /> :
          <Routes>
            <Route path="/" element={<Navigate to="dashboard" replace />} />

            {/* CONTENIDO: DASHBOARD */}
            <Route path="dashboard" element={


              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                <div style={{ background: '#FFFFFF', padding: '32px', borderRadius: '16px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ background: '#EFF6FF', padding: '16px', borderRadius: '12px', color: 'var(--color-primary)' }}>
                      <FileText size={32} />
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '600', margin: 0, letterSpacing: '0.5px' }}>TOTAL FACTURAS</p>
                  </div>
                  <p style={{ fontSize: '56px', fontWeight: '800', color: 'var(--color-primary)', margin: '16px 0 0 0', lineHeight: 1 }}>{facturas.length}</p>
                </div>
                <div style={{ background: '#FFFFFF', padding: '32px', borderRadius: '16px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ background: '#ECFCCB', padding: '16px', borderRadius: '12px', color: 'var(--color-success)' }}>
                      <ArrowRightLeft size={32} />
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '600', margin: 0, letterSpacing: '0.5px' }}>TRANSFERENCIAS RECIBIDAS</p>
                  </div>
                  <p style={{ fontSize: '56px', fontWeight: '800', color: 'var(--color-success)', margin: '16px 0 0 0', lineHeight: 1 }}>{comprobantes.length}</p>
                </div>
                <div style={{ width: '100%', height: 350, background: '#FFFFFF', padding: '32px', borderRadius: '16px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={datosDashboard}>
                      <XAxis dataKey="nombre" /> {/* Lo que va en la barra de abajo */}
                      <YAxis /> {/* Los números de la izquierda */}
                      <Tooltip /> {/* El cuadrito que sale cuando pasas el mouse */}
                      <Bar dataKey="cantidad" fill="#2563EB" radius={[4, 4, 0, 0]} /> {/* El color de la barra */}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ width: '100%', height: 350, background: '#FFFFFF', padding: '32px', borderRadius: '16px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)' }}>
                  <h3 style={{ marginTop: 0, marginBottom: '16px', color: 'var(--color-primary)', fontSize: '16px', fontWeight: '700' }}>
                    Distribución de Ingresos
                  </h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={datosPastel}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="cantidad"
                        nameKey='nombre'
                      >
                        {datosPastel.map((rebanada, index) => (
                          <Cell key={index} fill={rebanada.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            } />

            {/* CONTENIDO: FACTURAS */}
            <Route path="facturas" element={<VistaFacturas facturasPadre={facturas} />} />

            {/* CONTENIDO: INGRESOS */}
            <Route path="ingresos" element={<VistaIngresos correosPadre={correosPadre} setSeleccionado={setSeleccionado} />} />
            <Route path="ingresos/:tipoFiltro" element={<VistaIngresos correosPadre={correosPadre} setSeleccionado={setSeleccionado} />} />
            <Route path="ingresos/expediente/:id" element={<VistaExpedienteWrapper correosPadre={correosPadre} setSeleccionado={setSeleccionado} />} />


          </Routes>
        }
      </main>
    </div >
  );
}

export default ModuloPagos;
