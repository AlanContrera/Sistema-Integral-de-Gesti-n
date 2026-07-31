import React, { useState, Fragment } from 'react';
import { Landmark, ChevronLeft, Download, Search } from 'lucide-react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

function VistaFacturas({ facturasPadre, onSelectFactura, onVerCorreo }) {
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [facturaExpandida, setFacturaExpandida] = useState(null);
  const [tabActiva, setTabActiva] = useState('PPD');

  const [busquedaCarpeta, setBusquedaCarpeta] = useState('');
  const [busquedaFactura, setBusquedaFactura] = useState('');

  // 1. Filtramos antes de hacer las carpetas
  const facturasFiltradas = facturasPadre.filter(f =>
    (f.emisor_nombre || '').toLowerCase().includes(busquedaCarpeta.toLowerCase()) ||
    (f.receptor_nombre || '').toLowerCase().includes(busquedaCarpeta.toLowerCase())
  );

  // 2. Agrupar facturas por cliente usando las filtradas
  const agrupados = facturasFiltradas.reduce((acc, factura) => {
    const nombre = factura.cliente_nombre || 'SIN NOMBRE';
    if (!acc[nombre]) acc[nombre] = [];
    acc[nombre].push(factura);
    return acc;
  }, {});


  const generarReporteExcel = async (nombreCliente, facturas) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte de Facturas');

    worksheet.columns = [
      { header: 'Fecha', key: 'fecha', width: 15 },
      { header: 'Emisor', key: 'emisor', width: 45 },
      { header: 'Receptor', key: 'receptor', width: 45 },
      { header: 'Folio', key: 'folio', width: 15 },
      { header: 'Monto Total', key: 'total', width: 20 },
      { header: 'Pagado', key: 'pagado', width: 20 },
      { header: 'Saldo Pendiente', key: 'saldo', width: 20 },
      { header: 'Método', key: 'metodo_pago', width: 15 }
    ];

    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };
      cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    facturas.forEach(f => {
      const fechaFormat = f.fecha ? f.fecha.split('T')[0].split('-').reverse().join('/') : '—';
      const sumaAbonos = (f.abonos || []).reduce((sum, a) => sum + parseFloat(a.monto_extraido || 0), 0);
      const saldo = parseFloat(f.total || 0) - sumaAbonos;

      worksheet.addRow({
        fecha: fechaFormat,
        emisor: f.emisor_nombre || '—',
        receptor: f.receptor_nombre || '—',
        folio: f.folio || '—',
        total: f.total ? parseFloat(f.total) : 0,
        pagado: sumaAbonos,
        saldo: saldo,
        metodo_pago: f.metodo_pago || '—'
      });
    });

    worksheet.getColumn('total').numFmt = '"$"#,##0.00';
    worksheet.getColumn('pagado').numFmt = '"$"#,##0.00';
    worksheet.getColumn('saldo').numFmt = '"$"#,##0.00';

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `Reporte_Facturas_${nombreCliente.replace(/\s+/g, '_')}.xlsx`);
  };

  if (clienteSeleccionado) {
    const facturasDelCliente = agrupados[clienteSeleccionado] || [];

    // Filtrar con buscador interno
    const term = busquedaFactura.toLowerCase();
    const facturasInternasFiltradas = facturasDelCliente.filter(f => 
      (f.folio || '').toLowerCase().includes(term) || 
      (f.total || '').toString().includes(term)
    );

    // Separar PPD y PUE
    const facturasPPD = facturasInternasFiltradas.filter(f => f.metodo_pago && f.metodo_pago.toUpperCase().includes('PPD'));
    const facturasPUE = facturasInternasFiltradas.filter(f => !f.metodo_pago || !f.metodo_pago.toUpperCase().includes('PPD'));

    // --- RENDERIZADOR DE DATA GRID (TABLAS DE ALTA DENSIDAD) ---
    const renderTablaFacturas = (facturas, esPPD) => {
      return (
        <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Folio</th>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Fecha</th>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Emisor</th>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>Total</th>
                {esPPD && <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>Saldo</th>}
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', textAlign: 'center' }}>Estado</th>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {facturas.map(f => {
                const sumaAbonos = (f.abonos || []).reduce((sum, a) => sum + parseFloat(a.monto_extraido || 0), 0);
                const saldoPendiente = parseFloat(f.total || 0) - sumaAbonos;
                const expandido = facturaExpandida === f.id;

                // --- PÍLDORAS DE ESTADO FINANCIERO ---
                let estadoTexto = ''; let estadoColor = ''; let estadoBg = '';

                if (!esPPD) {
                  estadoTexto = 'PAGADA (PUE)'; estadoColor = '#047857'; estadoBg = '#D1FAE5';
                } else if (saldoPendiente <= 0) {
                  estadoTexto = 'LIQUIDADA'; estadoColor = '#047857'; estadoBg = '#D1FAE5';
                } else if (sumaAbonos > 0) {
                  estadoTexto = 'PARCIAL'; estadoColor = '#B45309'; estadoBg = '#FEF3C7';
                } else {
                  estadoTexto = 'PENDIENTE'; estadoColor = '#B91C1C'; estadoBg = '#FEE2E2';
                }

                return (
                  <Fragment key={f.id}>
                    {/* FILA PRINCIPAL */}
                    <tr
                      onClick={() => esPPD ? setFacturaExpandida(expandido ? null : f.id) : null}
                      style={{ borderBottom: '1px solid #E2E8F0', cursor: esPPD ? 'pointer' : 'default', background: expandido ? '#F1F5F9' : '#FFFFFF', transition: 'background 0.2s' }}>
                      <td style={{ padding: '16px', fontSize: '14px', fontWeight: '700', color: '#0F172A', fontFamily: 'monospace' }}>{f.folio || 'S/F'}</td>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#475569' }}>{f.fecha ? f.fecha.split('T')[0] : '—'}</td>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#475569', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={f.emisor_nombre}>{f.emisor_nombre || 'Desconocido'}</td>

                      {/* NÚMEROS MONOESPACIADOS ALINEADOS A LA DERECHA */}
                      <td style={{ padding: '16px', fontSize: '14px', fontWeight: '600', color: '#1E293B', textAlign: 'right', fontFamily: 'monospace' }}>
                        ${parseFloat(f.total || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </td>

                      {esPPD && (
                        <td style={{ padding: '16px', fontSize: '14px', fontWeight: '700', color: saldoPendiente <= 0 ? '#10B981' : '#EF4444', textAlign: 'right', fontFamily: 'monospace' }}>
                          ${saldoPendiente.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </td>
                      )}

                      {/* BADGES */}
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <span style={{ background: estadoBg, color: estadoColor, padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '800', letterSpacing: '0.5px' }}>{estadoTexto}</span>
                      </td>

                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <button onClick={(e) => { e.stopPropagation(); onSelectFactura({ ...f, tipo: 'factura' }); }} style={{ background: '#3B82F6', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 2px 4px rgba(59,130,246,0.3)' }}>
                          Ver XML
                        </button>
                      </td>
                    </tr>

                    {/* FILA DESPLEGABLE: HISTORIAL DE ABONOS Y TRAZABILIDAD */}
                    {esPPD && expandido && (
                      <tr style={{ background: '#F8FAFC' }}>
                        <td colSpan="7" style={{ padding: '0', borderBottom: '1px solid #E2E8F0' }}>
                          <div style={{ padding: '20px 24px', borderLeft: '4px solid #3B82F6' }}>
                            <h4 style={{ margin: '0 0 12px 0', color: '#3B82F6', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '700' }}>Libro Mayor: Historial de Abonos</h4>

                            {f.abonos && f.abonos.length > 0 ? (
                              <table style={{ width: '100%', borderCollapse: 'collapse', background: '#FFFFFF', borderRadius: '8px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
                                <tbody>
                                  {f.abonos.map((a, i) => (
                                    <tr key={i} style={{ borderBottom: '1px dashed #CBD5E1' }}>
                                      <td style={{ padding: '12px 16px', fontSize: '13px', color: '#64748B', width: '150px' }}>{a.fecha_extraida || 'Sin Fecha'}</td>
                                      <td style={{ padding: '12px 16px', fontSize: '13px', color: '#1E293B', fontWeight: '500' }}>Transferencia / Abono</td>

                                      {/* BOTÓN DE TRAZABILIDAD AL CORREO */}
                                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                        <button onClick={() => onVerCorreo && onVerCorreo(a.correo)} style={{ background: 'transparent', border: 'none', color: '#3B82F6', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                                          <u>Auditar Correo</u>
                                        </button>
                                      </td>

                                      <td style={{ padding: '12px 16px', fontSize: '14px', color: '#10B981', fontWeight: '700', textAlign: 'right', fontFamily: 'monospace' }}>
                                        + ${parseFloat(a.monto_extraido || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            ) : (
                              <div style={{ fontSize: '13px', color: '#94A3B8', fontStyle: 'italic' }}>Sin abonos registrados. La factura permanece intacta.</div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '10px' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <button onClick={() => setClienteSeleccionado(null)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: '14px', fontWeight: '600', padding: 0 }}>
            <ChevronLeft size={20} /> Volver a Carpetas
          </button>

          <button onClick={() => generarReporteExcel(clienteSeleccionado, facturasDelCliente)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#10B981', border: 'none', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: '700', padding: '10px 20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(16, 185, 129, 0.3)' }}>
            <Download size={18} /> Generar Reporte Excel
          </button>
        </div>

        <h2 style={{ fontSize: '24px', color: '#1E293B', margin: '0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Landmark size={28} color="#3B82F6" />
          {clienteSeleccionado}
        </h2>

        {/* 🔍 BUSCADOR INTERNO DE FACTURAS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginTop: '16px' }}>
          <div style={{ flex: '1 1 0%', minWidth: '250px', display: 'flex', alignItems: 'center', gap: '12px', background: '#FFFFFF', padding: '12px 20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <Search size={20} color="#94A3B8" />
            <input 
              placeholder="Buscar factura por folio o monto..." 
              type="text" 
              value={busquedaFactura}
              onChange={(e) => setBusquedaFactura(e.target.value)}
              style={{ border: 'none', outline: 'none', width: '100%', fontSize: '15px', color: '#334155' }} 
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', background: '#FFFFFF', padding: '10px 16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <input type="date" style={{ border: 'none', outline: 'none', fontSize: '14px', color: '#475569', background: 'transparent' }} />
          </div>
          <div style={{ background: '#FFFFFF', padding: '10px 16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <select style={{ border: 'none', outline: 'none', fontSize: '14px', color: '#475569', background: 'transparent', cursor: 'pointer' }}>
              <option value="todos">Todos los Estados</option>
              <option value="pendiente">Pendientes</option>
              <option value="revisado">Liquidadas</option>
            </select>
          </div>
        </div>

        {/* PESTAÑAS (TABS) MODERNAS */}
        <div style={{ display: 'flex', gap: '8px', background: '#F1F5F9', padding: '6px', borderRadius: '12px', marginTop: '16px', marginBottom: '16px' }}>
          <button
            onClick={() => setTabActiva('PPD')}
            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: tabActiva === 'PPD' ? '#FFFFFF' : 'transparent', color: tabActiva === 'PPD' ? '#3B82F6' : '#64748B', fontSize: '15px', fontWeight: '700', boxShadow: tabActiva === 'PPD' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
            Cuentas por Cobrar (PPD)
            <span style={{ background: tabActiva === 'PPD' ? '#DBEAFE' : '#E2E8F0', color: tabActiva === 'PPD' ? '#1D4ED8' : '#94A3B8', padding: '2px 8px', borderRadius: '20px', fontSize: '12px' }}>{facturasPPD.length}</span>
          </button>
          <button
            onClick={() => setTabActiva('PUE')}
            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: tabActiva === 'PUE' ? '#FFFFFF' : 'transparent', color: tabActiva === 'PUE' ? '#10B981' : '#64748B', fontSize: '15px', fontWeight: '700', boxShadow: tabActiva === 'PUE' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
            De Contado (PUE)
            <span style={{ background: tabActiva === 'PUE' ? '#D1FAE5' : '#E2E8F0', color: tabActiva === 'PUE' ? '#047857' : '#94A3B8', padding: '2px 8px', borderRadius: '20px', fontSize: '12px' }}>{facturasPUE.length}</span>
          </button>
        </div>

        {/* CONTENIDO DE LAS PESTAÑAS (DATA GRIDS) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {tabActiva === 'PPD' && (
            facturasPPD.length > 0
              ? renderTablaFacturas(facturasPPD, true)
              : <div style={{ textAlign: 'center', padding: '40px', background: '#F8FAFC', borderRadius: '12px', color: '#94A3B8', border: '1px dashed #CBD5E1' }}>No hay facturas de Cuentas por Cobrar registradas.</div>
          )}

          {tabActiva === 'PUE' && (
            facturasPUE.length > 0
              ? renderTablaFacturas(facturasPUE, false)
              : <div style={{ textAlign: 'center', padding: '40px', background: '#F8FAFC', borderRadius: '12px', color: '#94A3B8', border: '1px dashed #CBD5E1' }}>No hay facturas de Contado registradas.</div>
          )}
        </div>

      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '10px' }}>
      {/* 🔍 BUSCADOR DE CARPETAS */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#FFFFFF', padding: '12px 20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <Search size={20} color="#94A3B8" />
        <input 
          placeholder="Buscar cliente o emisor..." 
          type="text" 
          value={busquedaCarpeta}
          onChange={(e) => setBusquedaCarpeta(e.target.value)}
          style={{ border: 'none', outline: 'none', width: '100%', fontSize: '15px', color: '#334155' }} 
        />
      </div>
      {Object.entries(agrupados).map(([nombreCliente, facturasCliente]) => (
        <div key={nombreCliente} onClick={() => setClienteSeleccionado(nombreCliente)} style={{ background: '#FFFFFF', borderRadius: '12px', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', border: '1px solid #E2E8F0', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateX(5px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6' }}>
              <Landmark size={24} />
            </div>
            <div>
              <span style={{ fontSize: '18px', fontWeight: '700', color: '#1E293B', display: 'block' }}>{nombreCliente}</span>
              <span style={{ fontSize: '14px', color: '#64748B' }}>{facturasCliente.length} Facturas Registradas</span>
            </div>
          </div>
          <div style={{ color: '#94A3B8' }}><ChevronLeft style={{ transform: 'rotate(180deg)' }} /></div>
        </div>
      ))}
    </div>
  );
}

export default VistaFacturas;
