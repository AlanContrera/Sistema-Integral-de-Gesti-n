import React, { useState } from 'react';
import { X } from 'lucide-react';
import { updateComprobante } from '../services/api';

function ModalVistaPrevia({ seleccionado, onCerrar, catalogos }) {

  if (!seleccionado) return null

  const [modoEdicion, setModoEdicion] = useState(false)
  const [datosEditados, setDatosEditados] = useState({})

  const archivoUrl = seleccionado.tipo === 'factura'
    ? (seleccionado.archivo_pdf || null)
    : (seleccionado.archivo || null)

  const esImagen = archivoUrl && /\.(jpg|jpeg|png|gif|webp)$/i.test(archivoUrl)
  const esPdf = archivoUrl && /\.pdf$/i.test(archivoUrl)
  const nombreArchivo = seleccionado.archivo?.split('/').pop() || seleccionado.folio || '—'

  const camposComprobante = [
    { dbKey: 'empresa_destino', label: 'Empresa', valor: seleccionado.empresa_destino || seleccionado.empresa_correo },
    { dbKey: 'banco_destino', label: 'Banco Destino', valor: seleccionado.banco_destino || seleccionado.cuenta_destino },
    { dbKey: 'monto_extraido', label: 'Monto', valor: seleccionado.monto_extraido ? `$ ${Number(seleccionado.monto_extraido).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : null },
    { dbKey: 'fecha_extraida', label: 'Fecha', valor: seleccionado.fecha_extraida ? seleccionado.fecha_extraida.split('-').reverse().join('-') : null },
    { dbKey: 'cuenta_origen', label: 'Cuenta Origen', valor: seleccionado.banco_origen || seleccionado.cuenta_origen }
  ]


  const camposFactura = [
    { label: 'Folio', valor: seleccionado.folio },
    { label: 'Fecha', valor: seleccionado.fecha ? seleccionado.fecha.split('T')[0].split('-').reverse().join('/') : null },
    { label: 'Emisor', valor: seleccionado.emisor_nombre },
    { label: 'RFC Emisor', valor: seleccionado.emisor_rfc },
    { label: 'Receptor', valor: seleccionado.receptor_nombre },
    { label: 'RFC Receptor', valor: seleccionado.receptor_rfc },
    { label: 'Total', valor: seleccionado.total ? `$${seleccionado.total}` : null },
    { label: 'Método de Pago', valor: seleccionado.metodo_pago },
    { label: 'Moneda', valor: seleccionado.moneda },
  ]

  const campos = seleccionado.tipo === 'factura' ? camposFactura : camposComprobante

  return (
    <div
      onClick={onCerrar}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(11, 74, 122, 0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, backdropFilter: 'blur(4px)'
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="glass-panel"
        style={{ width: '85vw', height: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 30px', borderBottom: '1px solid var(--border-light)', flexShrink: 0, backgroundColor: '#FFFFFF' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-primary)', margin: 0 }}>{nombreArchivo}</h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
              {seleccionado.tipo === 'factura' ? 'Documento: Factura CFDI' : 'Documento: Comprobante de Transferencia'}
            </p>
          </div>
          <button onClick={onCerrar} style={{ background: '#F3F4F6', border: 'none', color: 'var(--text-muted)', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', backgroundColor: '#FAFBFC' }}>
          <div style={{ flex: 1, padding: '30px', borderRight: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'auto' }}>
            {esImagen && <img src={archivoUrl} alt="Comprobante" style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '8px', objectFit: 'contain', boxShadow: 'var(--shadow-md)' }} />}
            {esPdf && (
              <>
                <div style={{ width: '100%', textAlign: 'right', marginBottom: '12px' }}>
                  <a href={archivoUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--color-secondary)', fontSize: '14px', textDecoration: 'none', fontWeight: '600' }}>
                    Abrir en pestaña nueva ↗
                  </a>
                </div>
                <object data={archivoUrl} type="application/pdf" style={{ width: '100%', flex: 1, border: '1px solid var(--border-light)', borderRadius: '8px', minHeight: '60vh', boxShadow: 'var(--shadow-sm)' }}>
                  <p>Tu navegador no soporta visualizar PDFs incrustados. <a href={archivoUrl} target="_blank" rel="noreferrer">Haz clic aquí para descargar el PDF</a>.</p>
                </object>
              </>
            )}
            {!archivoUrl && <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}><p style={{ fontSize: '48px', margin: '0 0 16px 0' }}><FileText size={48} /></p><p style={{ fontSize: '16px', fontWeight: '500' }}>Archivo XML — Sin vista previa visual</p></div>}
          </div>

          <div style={{ width: '360px', flexShrink: 0, padding: '30px', overflowY: 'auto', backgroundColor: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <p style={{ fontSize: '12px', color: 'var(--color-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Información Extraída</p>

              {/* Botón para activar la edición (solo en comprobantes y si no estamos ya editando) */}
              {seleccionado.tipo !== 'factura' && !modoEdicion && (
                <button onClick={() => setModoEdicion(true)} style={{ background: '#E2E8F0', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', color: 'var(--color-primary)' }}>Editar Datos</button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {campos.map(({ label, valor, dbKey }) => (
                <div key={label} style={{ borderBottom: '1px solid #F3F4F6', paddingBottom: '12px' }}>
                  <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '500', letterSpacing: '0.5px' }}>{label}</p>

                  {/* MAGIA AQUÍ: Si estamos en modoEdicion y el campo tiene llave, mostramos input */}
                  {modoEdicion && dbKey ? (
                    dbKey === 'empresa_destino' && catalogos ? (
                      <select
                        value={datosEditados[dbKey] !== undefined ? datosEditados[dbKey] : (valor || '')}
                        onChange={(e) => setDatosEditados({ ...datosEditados, [dbKey]: e.target.value })}
                        style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '4px', outline: 'none', fontSize: '15px', backgroundColor: 'white' }}
                      >
                        <option value="">Seleccionar empresa...</option>
                        {catalogos.empresas?.map(empresa => (
                          <option key={empresa} value={empresa}>{empresa}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={datosEditados[dbKey] !== undefined ? datosEditados[dbKey] : (valor || '')}
                        onChange={(e) => setDatosEditados({ ...datosEditados, [dbKey]: e.target.value })}
                        style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '4px', outline: 'none', fontSize: '15px' }}
                      />
                    )
                  ) : (
                    <p style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: valor ? 'var(--color-primary)' : '#9CA3AF', fontStyle: valor ? 'normal' : 'italic' }}>
                      {valor || 'No detectado'}
                    </p>
                  )}
                </div>
              ))}

              {/* Si estamos editando, mostramos Guardar Cambios */}
              {modoEdicion && (
                <button
                  onClick={async () => {
                    try {
                      await updateComprobante(seleccionado.id, datosEditados);
                      alert('Datos actualizados');
                      setModoEdicion(false);
                    } catch (error) {
                      alert('Error al actualizar');
                    }
                  }}
                  style={{ background: 'var(--color-primary)', color: 'white', padding: '12px', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', boxShadow: 'var(--shadow-sm)' }}
                >
                  Guardar Cambios
                </button>
              )}

              {/* Si NO estamos editando, mostramos el botón de Revisado Independiente */}
              {seleccionado.tipo !== 'factura' && !modoEdicion && (
                <div style={{ marginTop: '10px' }}>
                  {seleccionado.revisado ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#DEF7EC', color: '#03543F', padding: '12px', borderRadius: '6px', fontWeight: 'bold' }}>
                      ✓ Este comprobante ya fue revisado
                    </div>
                  ) : (
                    <button
                      onClick={async () => {
                        try {
                          await updateComprobante(seleccionado.id, { revisado: true })
                          alert('Comprobante validado correctamente')
                          onCerrar()
                        } catch (error) {
                          alert('Error al validar')
                        }
                      }}
                      style={{ width: '100%', background: 'var(--color-success)', color: 'white', padding: '12px', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}
                    >
                      Marcar como Revisado
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalVistaPrevia;
