import React from 'react';

function limpiarTextoCorreo(texto) {
  if (!texto) return '';
  let limpio = texto;

  // 1. Eliminar etiquetas de enlaces <mailto:...> y <correo@...>
  limpio = limpio.replace(/<mailto:[^>]+>/gi, '');
  limpio = limpio.replace(/<[^>]+@[^>]+>/gi, '');

  // 2. Limpiar basuras de encabezados línea por línea (mucho más seguro)
  limpio = limpio.replace(/\r/g, ''); // Truco para limpiar saltos de línea de Windows

  const basurasReenvio = [
    /Historial\s*#\d+/gi,
    /Mensaje\s+Anterior/gi,
    /Mensaje\s+Original/gi,
    /De:\s*[^\n]+/gi,
    /Enviado\s+el:?\s*[^\n]+/gi,
    /Para:\s*[^\n]+/gi,
    /CC:\s*[^\n]+/gi,
    /(?:Asunto:|Subject:)\s*[^\n]+/gi
  ];

  basurasReenvio.forEach(regex => {
    limpio = limpio.replace(regex, '');
  });



  // 5. PLANCHADO DE ESPACIOS (Esto arregla los huecos gigantes)
  limpio = limpio.replace(/^[ \t\xA0]+$/gm, ''); // Quita espacios invisibles y caracteres raros de Outlook
  limpio = limpio.replace(/\n{3,}/g, '\n\n'); // Plancha los huecos gigantes


  return limpio.trim();
}
// --------------------------------------------------------------

// --- COMPONENTE PARA RE-DIBUJAR TABLAS ROTAS ---
function ParseadorDeTablas({ texto }) {
  if (!texto) return <span style={{ color: '#94A3B8', fontStyle: 'italic' }}>Sin texto adicional.</span>;

  const textoLimpio = limpiarTextoCorreo(texto);

  // 1. Detección Inteligente para "Asimilados" (Mantenemos esta porque el usuario dijo que "asimilado todo bien")
  const regexAsimilado = /(NOMBRE DEL BENEFICIARIO[\s\S]*?MONTO\s*\n+)([^\n]+)\s*\n+([^\n]+)\s*\n+([^\n]+)\s*\n+([^\n]+)\s*\n+([^\n]+)/i;
  const matchAsim = textoLimpio.match(regexAsimilado);

  if (matchAsim) {
    const [bloqueCompleto, encabezados, val1, val2, val3, val4, val5] = matchAsim;
    const antes = textoLimpio.substring(0, matchAsim.index).trim();
    const despues = textoLimpio.substring(matchAsim.index + bloqueCompleto.length).trim();

    const bancoDetectado = val2.toLowerCase().includes('trans') ? val3 : val2;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {antes && <div>{antes}</div>}
        <div style={{ background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ background: '#F8FAFC', padding: '8px 16px', borderBottom: '1px solid #E2E8F0', fontWeight: '700', fontSize: '12px', color: '#64748B', letterSpacing: '0.5px' }}>
            DATOS BANCARIOS DEL CORREO
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left', margin: 0 }}>
            <tbody>
              <tr>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid #F1F5F9', color: '#64748B', width: '140px' }}>Beneficiario</td>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid #F1F5F9', fontWeight: '600', color: '#0F172A' }}>{val1.trim()}</td>
              </tr>
              <tr>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid #F1F5F9', color: '#64748B' }}>Banco</td>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid #F1F5F9', color: '#334155' }}>{bancoDetectado.trim()}</td>
              </tr>
              <tr>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid #F1F5F9', color: '#64748B' }}>CLABE</td>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid #F1F5F9', color: '#334155', fontFamily: 'monospace' }}>{val4.trim()}</td>
              </tr>
              <tr>
                <td style={{ padding: '12px 16px', color: '#64748B' }}>Monto</td>
                <td style={{ padding: '12px 16px', fontWeight: '700', color: '#10B981', fontSize: '14px' }}>{val5.trim()}</td>
              </tr>
            </tbody>
          </table>
        </div>
        {despues && <ParseadorDeTablas texto={despues} />}
      </div>
    );
  }

  // Para todos los demás casos, usar texto puro según la solicitud del usuario
  return (
    <div style={{
      color: '#334155',
      lineHeight: '1.6',
      whiteSpace: 'pre-wrap',
      fontSize: '13px',
      background: '#F8FAFC',
      padding: '16px',
      borderRadius: '8px',
      borderLeft: '4px solid #CBD5E1',
      boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)'
    }}>
      {textoLimpio}
    </div>
  );
}

export { limpiarTextoCorreo, ParseadorDeTablas };
