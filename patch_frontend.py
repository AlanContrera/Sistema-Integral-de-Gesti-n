import re
import sys

file_path = 'frontend/src/pages/cotizador/ModuloCotizador.jsx'
try:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
except FileNotFoundError:
    print("File not found.")
    sys.exit(1)

# Add Eye to imports
if ' Eye,' not in content and 'Eye ' not in content and '{ Eye' not in content:
    content = content.replace('Menu, AlertCircle }', 'Menu, AlertCircle, Eye }')

# Add handlePreview function right after handleUploadAndSend
handle_preview = '''
  const handlePreview = async () => {
    if (!file || !analysisResult) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fecha', fechaOperacion);
    if (analysisResult.empresa_emisora.id) {
      formData.append('empresa_id', analysisResult.empresa_emisora.id);
    }
    if (analysisResult.cliente.id) {
      formData.append('cliente_id', analysisResult.cliente.id);
    }

    try {
      const res = await fetch(http://:8000/api/cotizador/generar/, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al generar la vista previa');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };
'''
if 'const handlePreview =' not in content:
    content = content.replace('const handleUploadAndSend =', handle_preview + '\n  const handleUploadAndSend =')

# Update Remitente display
remitente_old = '''{analysisResult.empresa_emisora.match ? (
                    <p style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1E1B4B' }}>{analysisResult.empresa_emisora.nombre}</p>'''
remitente_new = '''{analysisResult.empresa_emisora.match ? (
                    <div>
                      <p style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1E1B4B' }}>{analysisResult.empresa_emisora.nombre}</p>
                      {analysisResult.empresa_emisora.correo && (
                        <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#64748B', fontWeight: '500' }}>{analysisResult.empresa_emisora.correo}</p>
                      )}
                    </div>'''
content = content.replace(remitente_old, remitente_new)

# Update Cliente display
cliente_old = '''{analysisResult.cliente.match ? (
                    <p style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1E1B4B' }}>{analysisResult.cliente.nombre}</p>'''
cliente_new = '''{analysisResult.cliente.match ? (
                    <div>
                      <p style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1E1B4B' }}>{analysisResult.cliente.nombre}</p>
                      {analysisResult.cliente.correo && (
                        <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#64748B', fontWeight: '500' }}>{analysisResult.cliente.correo}</p>
                      )}
                    </div>'''
content = content.replace(cliente_old, cliente_new)

# Update Buttons
buttons_old = '''<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <button
                  onClick={handleUpload}'''
buttons_new = '''<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={handlePreview}
                    disabled={loading || sendingEmail}
                    title="Vista Previa"
                    style={{ padding: '20px', borderRadius: '16px', background: '#F1F5F9', color: '#4F46E5', border: 2px solid #E2E8F0, cursor: (loading || sendingEmail) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0 }}
                    onMouseEnter={(e) => { if (!loading && !sendingEmail) { e.currentTarget.style.background = '#EEF2FF'; e.currentTarget.style.borderColor = '#C7D2FE'; } }}
                    onMouseLeave={(e) => { if (!loading && !sendingEmail) { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.borderColor = '#E2E8F0'; } }}
                  >
                    {loading ? <Loader2 size={20} className="animate-spin" /> : <Eye size={20} />}
                  </button>

                  <button
                    onClick={handleUpload}
                    style={{ flex: 1, padding: '20px', borderRadius: '16px', fontSize: '16px', fontWeight: '700', background: '#F1F5F9', color: '#475569', border: 2px solid #E2E8F0, cursor: (loading || sendingEmail) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'all 0.2s' }}
                    disabled={loading || sendingEmail}
                    onMouseEnter={(e) => { if (!loading && !sendingEmail) { e.currentTarget.style.background = '#E2E8F0'; } }}
                    onMouseLeave={(e) => { if (!loading && !sendingEmail) { e.currentTarget.style.background = '#F1F5F9'; } }}
                  >
                    {loading ? <Loader2 size={20} className="animate-spin" /> : <FileText size={20} />}
                    {loading ? 'Procesando...' : 'Descargar'}
                  </button>
                </div>'''
# Need to replace the onClick={handleUpload} button style so it doesn't duplicate the button definition
# Wait, let's just replace the exact structure.
# But string matching is brittle.
# I will use a regex to replace the old buttons container.
buttons_regex = r"<div style=\{\{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' \}\}>\s*<button\s*onClick=\{handleUpload\}.*?>.*?</button>\s*<button\s*onClick=\{handleUploadAndSend\}.*?>.*?</button>\s*</div>"
buttons_new_regex = r'''<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={handlePreview}
                    disabled={loading || sendingEmail}
                    title="Vista Previa"
                    style={{ padding: '20px', borderRadius: '16px', background: '#F1F5F9', color: '#4F46E5', border: 2px solid #E2E8F0, cursor: (loading || sendingEmail) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0 }}
                    onMouseEnter={(e) => { if (!loading && !sendingEmail) { e.currentTarget.style.background = '#EEF2FF'; e.currentTarget.style.borderColor = '#C7D2FE'; } }}
                    onMouseLeave={(e) => { if (!loading && !sendingEmail) { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.borderColor = '#E2E8F0'; } }}
                  >
                    {loading ? <Loader2 size={20} className="animate-spin" /> : <Eye size={20} />}
                  </button>

                  <button
                    onClick={handleUpload}
                    disabled={loading || sendingEmail}
                    style={{ flex: 1, padding: '20px', borderRadius: '16px', fontSize: '15px', fontWeight: '700', background: '#F1F5F9', color: '#475569', border: 2px solid #E2E8F0, cursor: (loading || sendingEmail) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => { if (!loading && !sendingEmail) { e.currentTarget.style.background = '#E2E8F0'; } }}
                    onMouseLeave={(e) => { if (!loading && !sendingEmail) { e.currentTarget.style.background = '#F1F5F9'; } }}
                  >
                    {loading ? <Loader2 size={20} className="animate-spin" /> : <FileText size={20} />}
                    {loading ? 'Procesando...' : 'Descargar'}
                  </button>
                </div>

                <button
                  onClick={handleUploadAndSend}
                  disabled={loading || sendingEmail}
                  style={{ padding: '20px', borderRadius: '16px', fontSize: '16px', fontWeight: '700', background: '#4F46E5', color: '#FFFFFF', border: 'none', cursor: (loading || sendingEmail) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'all 0.2s', boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.4)' }}
                  onMouseEnter={(e) => { if (!loading && !sendingEmail) { e.currentTarget.style.background = '#312E81'; } }}
                  onMouseLeave={(e) => { if (!loading && !sendingEmail) { e.currentTarget.style.background = '#4F46E5'; } }}
                >
                  {sendingEmail ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                  {sendingEmail ? 'Enviando...' : 'Generar y Enviar'}
                </button>
              </div>'''

content = re.sub(buttons_regex, buttons_new_regex, content, flags=re.DOTALL)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('ModuloCotizador.jsx modificado correctamente.')
