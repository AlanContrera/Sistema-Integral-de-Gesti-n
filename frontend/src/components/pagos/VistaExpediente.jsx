import React, { useState } from 'react';
import { ChevronLeft, FileText, ArrowRightLeft, Download, Calculator, CheckCircle2, Building2, Landmark, Calendar, Mail, FileStack } from 'lucide-react';
import { getComprobantes } from '../services/api';
import { ParseadorDeTablas } from '../utils/parsers';
import * as XLSX from 'xlsx';

function VistaExpediente({ expediente, onVolver, onVerComprobante }) {
  if (!expediente) return null;



  // Extraemos datos financieros
  const padreComprobante = expediente.comprobantes?.[0];
  const totalSuma = expediente.comprobantes?.reduce((acc, c) => acc + Number(c.monto_extraido || c.monto_correo || 0), 0) || 0;
  const saldoOriginal = expediente.liquidacion?.monto_depositado || padreComprobante?.saldo_anterior || totalSuma;

  const asuntoMatch = expediente.asunto?.match(/TRANSFERENCIA\s+([^-]+)/i);
  const tituloOperacion = asuntoMatch ? asuntoMatch[1].trim() : expediente.asunto;

  const compConEmpresa = expediente.comprobantes?.find(c => c.empresa_destino || c.empresa_correo);
  const empresaDestino = compConEmpresa?.empresa_destino || compConEmpresa?.empresa_correo || 'No detectada';

  const compConBanco = expediente.comprobantes?.find(c => c.banco_extraido || c.banco_origen || c.banco_correo);
  const bancoExtraido = compConBanco?.banco_extraido || compConBanco?.banco_origen || compConBanco?.banco_correo || 'No detectado';

  const compConFecha = expediente.comprobantes?.find(c => c.fecha_extraida);
  const fechaExtraida = compConFecha?.fecha_extraida ? new Date(compConFecha.fecha_extraida).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }) : 'No detectada';

  const totalRetornado = expediente.respuestas?.reduce((acc, resp) => {
    const sumaResp = resp.comprobantes?.reduce((sum, c) => sum + Number(c.monto_extraido || c.monto_correo || 0), 0) || 0;
    return acc + sumaResp;
  }, 0) || 0;

  const saldoDisponible = padreComprobante?.saldo_actualizado !== null && padreComprobante?.saldo_actualizado !== undefined
    ? padreComprobante.saldo_actualizado
    : (saldoOriginal - totalRetornado);

  const l = expediente.liquidacion; // Shortcut para la liquidación

  const handleExportarExcel = () => {
    if (!l) return;

    // Filasd de excel

    const datosExcel = [
      ["HOJA DE LIQUIDACIÓN FINANCIERA", ""],
      ["Cliente/Empresa", empresaDestino],
      ["Fecha Operación", fechaExtraida],
      ["", ""]
      ["CONCEPTO", "MONTO"],
      ["Monto Depositado", Number(l.monto_depositado)],
      ["Monto Retornado", Number(l.monto_retornado)],
      ["Subtotal Facturado", Number(l.subtotal)],
      ["Comisión Empresa (Bruta)", Number(l.comision_empresa_bruta)],
      ["Comisión Bancaria", Number(l.comision_bancaria)],
      ["Comisión Promotor", Number(l.comision_promotor_1)],
      ["Comisión Promotor 2", Number(l.comision_promotor_2)],
      ["Comisión Traslado", Number(l.comision_traslado)],
      ["Comisión VALLUX", Number(l.comision_vallux_neta)],
      ["Utilidad VALLUX", Number(l.utilidad_vallux)],
      ["Comisión Pedro", Number(l.comision_pedro)]
    ]

    const hoja = XLSX.utils.aoa_to_sheet(datosExcel);

    // 1. Ajustar el ancho de las columnas para que nada se corte
    hoja['!cols'] = [
      { wch: 30 }, // Ancho Columna A (Concepto)
      { wch: 20 }  // Ancho Columna B (Montos)
    ];

    // 2. Formato de Moneda Automático
    // Le decimos a Excel: "Oye, revisa todas las celdas, y si encuentras un número, ponle signo de pesos"
    for (const nombreCelda in hoja) {
      if (nombreCelda.startsWith('!')) continue; // Saltamos las celdas raras del sistema

      const celda = hoja[nombreCelda];
      if (celda.t === 'n') { // Si el tipo (t) de la celda es número (n)
        celda.z = '"$"#,##0.00'; // Formato de moneda contable
      }
    }

    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Calculos");

    XLSX.writeFile(libro, `Liquidacion_${empresaDestino}.xlsx`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: "'Inter', sans-serif" }}>

      {/* HEADER DE LA OPERACIÓN */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <button onClick={onVolver} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: '14px', fontWeight: '600', padding: 0, marginBottom: '8px' }}>
            <ChevronLeft size={18} /> Volver al Buzón
          </button>
          <h2 style={{ margin: 0, fontSize: '28px', color: '#0F172A', fontWeight: '800', letterSpacing: '-0.5px' }}>
            {tituloOperacion}
          </h2>
          <p style={{ margin: '4px 0 0 0', color: '#64748B', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={16} color="#10B981" /> Operación Detectada
          </p>
        </div>

      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* PANEL FINANCIERO PRINCIPAL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Tarjetas de Resumen Rápido */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', marginBottom: '12px' }}>
                <Building2 size={18} /> <span style={{ fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>Cliente / Empresa</span>
              </div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#1E293B' }}>{empresaDestino}</div>
            </div>

            <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', marginBottom: '12px' }}>
                <Landmark size={18} /> <span style={{ fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>Banco Destino</span>
              </div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#1E293B' }}>{bancoExtraido}</div>
            </div>

            <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', marginBottom: '12px' }}>
                <Calendar size={18} /> <span style={{ fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>Fecha Operación</span>
              </div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#1E293B' }}>{fechaExtraida}</div>
            </div>
          </div>

          {/* HOJA DE LIQUIDACIÓN INTEGRADA (Si existe) */}
          {l ? (
            <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
              <div style={{ background: '#F8FAFC', padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, color: '#0F172A', fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Calculator size={22} color="#3B82F6" />
                  Hoja de Liquidación Financiera
                </h3>
                <button onClick={handleExportarExcel} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#EFF6FF', color: '#2563EB', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}>
                  <Download size={16} /> Exportar Excel
                </button>
              </div>

              <div style={{ padding: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ background: '#ECFCCB', padding: '16px', borderRadius: '12px', border: '1px solid #BEF264' }}>
                    <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#4D7C0F', fontWeight: '700' }}>MONTO DEPOSITADO</p>
                    <p style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#3F6212', fontFamily: 'monospace' }}>${Number(l.monto_depositado).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div style={{ background: '#FEE2E2', padding: '16px', borderRadius: '12px', border: '1px solid #FCA5A5' }}>
                    <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#B91C1C', fontWeight: '700' }}>MONTO RETORNADO</p>
                    <p style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#991B1B', fontFamily: 'monospace' }}>${Number(l.monto_retornado).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', color: '#334155' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
                      <td style={{ padding: '12px 16px', fontWeight: '600', color: '#64748B' }}>SUBTOTAL FACTURADO</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '700', fontFamily: 'monospace' }}>${Number(l.subtotal).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px 16px', color: '#475569' }}>Comisión Empresa (Bruta)</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'monospace' }}>${Number(l.comision_empresa_bruta).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px 16px', color: '#475569' }}>Comisión Bancaria</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'monospace' }}>${Number(l.comision_bancaria).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px 16px', color: '#475569' }}>Comisión Promotor</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'monospace' }}>${(Number(l.comision_promotor_1) + Number(l.comision_promotor_2)).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px 16px', color: '#475569' }}>Comisión Traslado</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'monospace' }}>${Number(l.comision_traslado).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                    </tr>

                    {/* Resultados Finales */}
                    <tr><td colSpan="2" style={{ height: '8px' }}></td></tr>
                    <tr style={{ background: '#EFF6FF', borderTop: '2px solid #BFDBFE' }}>
                      <td style={{ padding: '16px', fontWeight: '700', color: '#1E3A8A' }}>COMISIÓN VALLUX NETA</td>
                      <td style={{ padding: '16px', textAlign: 'right', fontWeight: '800', color: '#1E3A8A', fontFamily: 'monospace', fontSize: '15px' }}>${Number(l.comision_vallux_neta).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                    </tr>
                    <tr style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ padding: '16px', fontWeight: '600', color: '#0F172A' }}>UTILIDAD VALLUX</td>
                      <td style={{ padding: '16px', textAlign: 'right', fontWeight: '700', color: '#0F172A', fontFamily: 'monospace' }}>${Number(l.utilidad_vallux).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                    </tr>
                    <tr style={{ background: '#FFFFFF' }}>
                      <td style={{ padding: '16px', fontWeight: '600', color: '#0F172A' }}>COMISIÓN PEDRO</td>
                      <td style={{ padding: '16px', textAlign: 'right', fontWeight: '700', color: '#0F172A', fontFamily: 'monospace' }}>${Number(l.comision_pedro).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div style={{ background: '#F8FAFC', padding: '40px', borderRadius: '16px', border: '1px dashed #CBD5E1', textAlign: 'center', color: '#64748B' }}>
              <Calculator size={40} style={{ opacity: 0.3, marginBottom: '16px' }} />
              <p style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>No hay liquidación procesada para esta operación.</p>
            </div>
          )}

          {/* Archivos Adjuntos */}
          <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileStack size={18} color="#8B5CF6" /> Documentos Asociados
            </h3>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {expediente.comprobantes?.map((comp, idx) => (
                <button key={comp.id} onClick={() => onVerComprobante(comp)} style={{ background: '#F5F3FF', border: '1px solid #DDD6FE', color: '#7C3AED', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#EDE9FE'} onMouseLeave={e => e.currentTarget.style.background = '#F5F3FF'}>
                  <FileText size={16} /> Ver Comprobante {idx + 1}
                </button>
              ))}
              {(!expediente.comprobantes || expediente.comprobantes.length === 0) && (
                <span style={{ color: '#94A3B8', fontSize: '14px' }}>Sin comprobantes extraídos.</span>
              )}
            </div>
          </div>

        </div>

        {/* DATOS DE INSTRUCCIÓN ORIGINAL */}
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} color="#8B5CF6" /> Datos de Instrucción (Extraídos)
          </h3>
          <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: '12px', border: '1px dashed #CBD5E1' }}>
            {/* Renderizamos solo las tablas o datos estructurados y ocultamos los encabezados de correo crudo */}
            <ParseadorDeTablas texto={expediente.cuerpo_limpio || expediente.cuerpo || ''} />
          </div>
        </div>

      </div>
    </div>
  )
}

export default VistaExpediente;
