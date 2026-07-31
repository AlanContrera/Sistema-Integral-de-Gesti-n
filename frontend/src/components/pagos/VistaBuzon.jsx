import React, { useState } from 'react';
import { Check, CheckCircle2 } from 'lucide-react';
import { Building2, Search, ChevronRight, FileText, ChevronLeft } from 'lucide-react';

function VistaBuzon({ correosPadre, tipoFiltro, onSelectExpediente, busquedaGlobal }) {
  const [busqueda, setBusqueda] = useState('');
  const [clienteSeleccionado, setClienteSeleccionado] = useState(() => sessionStorage.getItem('clienteSeleccionado') || null);

  React.useEffect(() => {
    if (clienteSeleccionado) sessionStorage.setItem('clienteSeleccionado', clienteSeleccionado);
    else sessionStorage.removeItem('clienteSeleccionado');
  }, [clienteSeleccionado]);
  const [revisados, setRevisados] = useState(new Set());

  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');

  const toggleRevisado = (e, id) => {
    e.stopPropagation();
    const newSet = new Set(revisados);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setRevisados(newSet);
  };

  // Filtro 1: por 'tipoFiltro' (retorno, asimilado, etc.) usando el asunto
  let filtradosGlobales = correosPadre.filter(c => c.comprobantes && c.comprobantes.length > 0);
  if (tipoFiltro !== 'todos') {
    filtradosGlobales = filtradosGlobales.filter(c => {
      const asunto = (c.asunto || '').toLowerCase();
      if (tipoFiltro === 'retorno') {
        return asunto.includes('retorno') && !asunto.includes('asimilado') && !asunto.includes('blindado') && !asunto.includes('bancarizacion');
      }
      return asunto.includes(tipoFiltro);
    });
  }

  const termino = (busquedaGlobal || busqueda).toLowerCase();
  if (termino !== '') {
    filtradosGlobales = filtradosGlobales.filter(c =>
      (c.asunto || '').toLowerCase().includes(termino) ||
      c.comprobantes?.some(comp =>
        (comp.empresa_destino || '').toLowerCase().includes(termino) ||
        (comp.banco_extraido || '').toLowerCase().includes(termino) ||
        (comp.monto_extraido || '').toString().includes(termino)
      )
    );
  }

  // Agrupamos por cliente
  const agrupados = filtradosGlobales.reduce((acc, c) => {
    const compConEmpresa = c.comprobantes?.find(comp => comp.empresa_destino || comp.empresa_correo);
    const nombreCliente = (c.cliente_nombre && c.cliente_nombre !== 'Desconocido')
      ? c.cliente_nombre
      : (compConEmpresa?.empresa_destino || compConEmpresa?.empresa_correo || 'Desconocido');
    if (!acc[nombreCliente]) acc[nombreCliente] = [];
    acc[nombreCliente].push(c);
    return acc;
  }, {});

  // Si estamos en la vista de lista de cuentas (clienteSeleccionado === null)
  if (!clienteSeleccionado) {
    const clientesFiltrados = Object.entries(agrupados);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#FFFFFF', padding: '12px 20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <Search size={20} color="#94A3B8" />
          <input
            type="text"
            placeholder="Buscar cuenta o entidad..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ border: 'none', outline: 'none', width: '100%', fontSize: '15px', color: '#334155' }}
          />
        </div>

        {clientesFiltrados.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8', background: '#FFF', borderRadius: '12px', border: '1px dashed #CBD5E1' }}>
            No se encontraron cuentas con operaciones en esta categoría.
          </div>
        ) : (
          clientesFiltrados.map(([nombreCliente, correosCliente]) => (
            <div
              key={nombreCliente}
              onClick={() => { setClienteSeleccionado(nombreCliente); setBusqueda(''); }}
              style={{
                background: '#FFFFFF',
                borderRadius: '12px',
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                border: '1px solid #E2E8F0',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
                e.currentTarget.style.borderColor = '#94A3B8';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                e.currentTarget.style.borderColor = '#E2E8F0';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ background: '#EFF6FF', padding: '12px', borderRadius: '12px' }}>
                  <Building2 size={24} color="#2563EB" />
                </div>
                <div>
                  <span style={{ fontSize: '18px', fontWeight: '700', color: '#1E293B', display: 'block' }}>{nombreCliente}</span>
                  <p style={{ margin: 0, color: '#64748B', fontSize: '13px' }}>{correosCliente.length} Operaciones registradas</p>
                </div>
              </div>
              <div style={{ color: '#94A3B8' }}>
                <ChevronRight size={24} />
              </div>
            </div>
          ))
        )}
      </div>
    );
  }

  // Vista Data Grid para un cliente específico
  // Vista Data Grid para un cliente específico
  const ingresosDelCliente = agrupados[clienteSeleccionado] || [];

  const ingresosFiltrados = ingresosDelCliente.filter(c => {
    // 1. Filtro por Búsqueda de Texto
    const termino = (busquedaGlobal || busqueda).toLowerCase();
    const pasaTexto = termino === '' ||
      (c.asunto || '').toLowerCase().includes(termino) ||
      c.comprobantes?.some(comp =>
        (comp.empresa_destino || '').toLowerCase().includes(termino) ||
        (comp.banco_extraido || '').toLowerCase().includes(termino) ||
        (comp.monto_extraido || '').toString().includes(termino)
      );


    // 2. Filtro por Estado (Revisado / Pendiente)
    let pasaEstado = true;
    if (filtroEstado === 'revisado') pasaEstado = revisados.has(c.id);
    else if (filtroEstado === 'pendiente') pasaEstado = !revisados.has(c.id);

    // 3. Filtro por Fecha Exacta
    let pasaFecha = true;
    if (filtroFecha) {
      const d = new Date(c.fecha_recibido || c.fecha);
      if (!isNaN(d.getTime())) {
        // Convierte la fecha del correo a formato "YYYY-MM-DD" para comparar con el input
        const fechaISO = d.toISOString().split('T')[0];
        if (fechaISO !== filtroFecha) pasaFecha = false;
      } else {
        pasaFecha = false;
      }
    }

    return pasaTexto && pasaEstado && pasaFecha;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '10px' }}>

      <div>
        <button onClick={() => { setClienteSeleccionado(null); setBusqueda(''); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: '14px', fontWeight: '600', padding: 0, marginBottom: '20px' }}>
          <ChevronLeft size={18} /> Volver al Directorio
        </button>
      </div>

      <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '0 0 24px 0', fontSize: '24px', color: '#0F172A' }}>
        <Building2 size={28} color="#3B82F6" />
        {clienteSeleccionado}
      </h2>

      {/* BARRA DE FILTROS (Texto, Fecha y Estado) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>

        {/* 1. Buscador de Texto (Local) */}
        <div style={{ flex: 1, minWidth: '250px', display: 'flex', alignItems: 'center', gap: '12px', background: '#FFFFFF', padding: '12px 20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <Search size={20} color="#94A3B8" />
          <input
            type="text"
            placeholder="Buscar operación por asunto o monto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ border: 'none', outline: 'none', width: '100%', fontSize: '15px', color: '#334155' }}
          />
        </div>

        {/* 2. Filtro de Fecha */}
        <div style={{ display: 'flex', alignItems: 'center', background: '#FFFFFF', padding: '10px 16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <input
            type="date"
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
            style={{ border: 'none', outline: 'none', fontSize: '14px', color: '#475569', background: 'transparent' }}
          />
          {/* Botón rápido para limpiar la fecha si hay una seleccionada */}
          {filtroFecha && (
            <button onClick={() => setFiltroFecha('')} style={{ background: '#FEE2E2', border: 'none', cursor: 'pointer', color: '#EF4444', marginLeft: '8px', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>X</button>
          )}
        </div>

        {/* 3. Filtro de Estado */}
        <div style={{ background: '#FFFFFF', padding: '10px 16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            style={{ border: 'none', outline: 'none', fontSize: '14px', color: '#475569', background: 'transparent', cursor: 'pointer' }}
          >
            <option value="todos">Todos los Estados</option>
            <option value="pendiente">Pendientes</option>
            <option value="revisado">Revisados</option>
          </select>
        </div>

      </div>


      {ingresosFiltrados.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8', background: '#FFF', borderRadius: '12px', border: '1px dashed #CBD5E1' }}>
          No se encontraron operaciones con esos criterios.
        </div>
      ) : (
        <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Descripción de la Operación</th>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Fecha</th>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', textAlign: 'center' }}>Estado</th>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ingresosFiltrados.map(c => {
                const esRevisado = revisados.has(c.id);
                let fecha = 'Sin fecha';
                if (c.fecha_recibido || c.fecha) {
                  const d = new Date(c.fecha_recibido || c.fecha);
                  if (!isNaN(d.getTime())) {
                    fecha = d.toLocaleDateString('es-MX');
                  }
                }

                return (
                  <tr key={c.id} style={{ borderBottom: '1px solid #E2E8F0', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#0F172A', fontWeight: '600' }}>
                      {c.asunto}
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#64748B' }}>
                      {fecha}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <button
                        onClick={(e) => toggleRevisado(e, c.id)}
                        style={{ background: esRevisado ? '#ECFCCB' : '#F1F5F9', color: esRevisado ? '#4D7C0F' : '#64748B', border: esRevisado ? '1px solid #BEF264' : '1px solid #E2E8F0', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}
                      >
                        {esRevisado ? <CheckCircle2 size={14} /> : <Check size={14} />}
                        {esRevisado ? 'Revisado' : 'Marcar revisión'}
                      </button>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <button
                        onClick={() => onSelectExpediente(c)}
                        style={{ background: '#EFF6FF', color: '#2563EB', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#2563EB'; e.currentTarget.style.color = '#FFFFFF'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#EFF6FF'; e.currentTarget.style.color = '#2563EB'; }}
                      >
                        <FileText size={16} /> Abrir
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default VistaBuzon;
