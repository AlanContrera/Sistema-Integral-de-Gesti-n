import React, { useState } from 'react';
import { Sparkles, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function IAEstrategiaModal({ isOpen, onClose, empresaId, clienteId, onSelectEstrategia }) {
    const [monto, setMonto] = useState('');
    const [numPartidas, setNumPartidas] = useState('');
    const [loading, setLoading] = useState(false);
    const [estrategias, setEstrategias] = useState([]);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleGenerar = async () => {
        if (!empresaId) {
            setError("Debes seleccionar una Empresa Emisora en el formulario antes de usar la IA.");
            return;
        }
        if (!monto || parseFloat(monto) <= 0) {
            setError("Debes ingresar un monto objetivo válido.");
            return;
        }

        setLoading(true);
        setError('');
        setEstrategias([]);

        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`http://${window.location.hostname}:8000/api/cotizador/generar-estrategia-ia/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    empresa_emisora_id: empresaId,
                    cliente_id: clienteId,
                    monto_objetivo: parseFloat(monto),
                    num_partidas_deseadas: numPartidas ? parseInt(numPartidas) : null
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Error al conectar con la Inteligencia Artificial (Ollama).");
            }

            setEstrategias(data.estrategias || []);
        } catch (err) {
            setError(err.message || "Error de conexión con el backend.");
        } finally {
            setLoading(false);
        }
    };

    const handleSeleccionar = (estrategia) => {
        const nuevasPartidas = estrategia.partidas.map(p => ({
            clave_sat: p.clave_sat || '80141600',
            cantidad: p.cantidad || 1,
            unidad: p.unidad || 'E48',
            descripcion: p.descripcion,
            valor_unitario: p.precio_unitario,
            tasa_iva: 0.16,
            importe: p.importe,
            objeto_impuesto: '02'
        }));

        onSelectEstrategia(nuevasPartidas);
        onClose();
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, transition: 'all 0.3s' }}>
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', width: '900px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto', padding: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)', animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px', fontSize: '24px', color: '#1E293B', fontWeight: '800' }}>
                        <div style={{ background: 'linear-gradient(135deg, #9333EA 0%, #4F46E5 100%)', padding: '10px', borderRadius: '14px', color: 'white', display: 'flex', boxShadow: '0 4px 12px rgba(147, 51, 234, 0.3)' }}>
                            <Sparkles size={24} />
                        </div>
                        Generar Estrategias con IA
                    </h2>
                    <button onClick={onClose} style={{ background: '#F1F5F9', border: 'none', width: '40px', height: '40px', borderRadius: '50%', color: '#64748B', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#E2E8F0'; e.currentTarget.style.transform = 'rotate(90deg)'; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#F1F5F9'; e.currentTarget.style.transform = 'rotate(0deg)'; }}>✕</button>
                </div>

                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', backgroundColor: '#F8FAFC', padding: '24px', borderRadius: '20px', border: '1px solid #E2E8F0', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Monto Objetivo (Total con IVA) *</label>
                        <input type="number" value={monto} onChange={e => setMonto(e.target.value)} placeholder="Ej. 150000" style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '2px solid #E2E8F0', fontSize: '15px', outline: 'none', transition: 'border-color 0.2s', backgroundColor: '#FFFFFF', color: '#1E293B', fontWeight: '600' }} onFocus={e => e.target.style.borderColor = '#9333EA'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Número de Partidas</label>
                        <input type="number" value={numPartidas} onChange={e => setNumPartidas(e.target.value)} placeholder="Automático si se deja vacío" style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '2px solid #E2E8F0', fontSize: '15px', outline: 'none', transition: 'border-color 0.2s', backgroundColor: '#FFFFFF', color: '#1E293B', fontWeight: '600' }} onFocus={e => e.target.style.borderColor = '#9333EA'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                    </div>
                    <div>
                        <button onClick={handleGenerar} disabled={loading} style={{ background: loading ? '#CBD5E1' : 'linear-gradient(135deg, #9333EA 0%, #4F46E5 100%)', color: 'white', border: 'none', padding: '0 32px', height: '52px', borderRadius: '12px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', boxShadow: loading ? 'none' : '0 4px 12px rgba(79, 70, 229, 0.3)' }} onMouseDown={e => !loading && (e.currentTarget.style.transform = 'scale(0.95)')} onMouseUp={e => !loading && (e.currentTarget.style.transform = 'scale(1)')}>
                            {loading ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
                            {loading ? 'Pensando...' : 'Generar'}
                        </button>
                    </div>
                </div>

                {loading && (
                    <div style={{ backgroundColor: '#EEF2FF', border: '1px solid #C7D2FE', padding: '24px', borderRadius: '16px', marginBottom: '24px', textAlign: 'center', animation: 'fadeIn 0.4s ease-out' }}>
                        <Loader2 size={32} className="animate-spin" style={{ color: '#4F46E5', margin: '0 auto 16px auto', display: 'block' }} />
                        <p style={{ margin: 0, fontWeight: '800', color: '#312E81', fontSize: '16px' }}>La Inteligencia Artificial local está analizando la estrategia para este cliente</p>
                        <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#4F46E5', fontWeight: '500' }}>Esto puede tardar entre 15 y 40 segundos. Tu paciencia garantiza la privacidad de tus datos.</p>
                    </div>
                )}

                {error && (
                    <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '16px 20px', borderRadius: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '600', animation: 'fadeIn 0.3s ease-out' }}>
                        <AlertCircle size={22} color="#DC2626" /> {error}
                    </div>
                )}

                {estrategias.length > 0 && !loading && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px', animation: 'fadeIn 0.5s ease-out' }}>
                        {estrategias.map((est, idx) => (
                            <div key={idx} style={{ border: '1px solid #E2E8F0', borderRadius: '20px', padding: '24px', backgroundColor: '#FFFFFF', transition: 'all 0.3s', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }} onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)'; e.currentTarget.style.borderColor = '#C7D2FE'; }} onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)'; e.currentTarget.style.borderColor = '#E2E8F0'; }}>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                    <span style={{ backgroundColor: '#EEF2FF', color: '#4F46E5', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{est.tipo || 'Estrategia'}</span>
                                </div>

                                <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', color: '#0F172A', fontWeight: '800' }}>{est.titulo}</h3>
                                <p style={{ color: '#475569', fontSize: '14px', margin: '0 0 20px 0', lineHeight: '1.5' }}>{est.justificacion}</p>

                                <div style={{ flex: 1, marginBottom: '24px', border: '1px solid #E2E8F0', borderRadius: '16px', overflow: 'hidden' }}>
                                    <div style={{ backgroundColor: '#F8FAFC', padding: '10px 16px', fontSize: '13px', fontWeight: '800', color: '#334155', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Conceptos Propuestos</span>
                                        <span style={{ color: '#94A3B8' }}>{est.partidas.length} items</span>
                                    </div>
                                    <ul style={{ margin: 0, padding: 0, listStyle: 'none', maxHeight: '180px', overflowY: 'auto' }}>
                                        {est.partidas.map((p, pIdx) => (
                                            <li key={pIdx} style={{ padding: '12px 16px', borderBottom: '1px solid #F1F5F9', fontSize: '13px', display: 'flex', gap: '12px' }}>
                                                <div style={{ fontWeight: '800', color: '#9333EA', whiteSpace: 'nowrap', backgroundColor: '#FAF5FF', padding: '2px 8px', borderRadius: '8px', height: 'fit-content' }}>{p.cantidad}x</div>
                                                <div style={{ flex: 1, color: '#334155', lineHeight: '1.4' }}>{p.descripcion}</div>
                                                <div style={{ fontWeight: '700', color: '#0F172A' }}>${(p.cantidad * p.precio_unitario).toLocaleString()}</div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '16px', marginBottom: '24px', border: '1px solid #E2E8F0' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '13px', color: '#64748B', fontWeight: '600' }}>Subtotal:</span>
                                        <span style={{ fontWeight: '800', color: '#4F46E5', fontSize: '18px' }}>${est.partidas.reduce((s, p) => s + (p.cantidad * p.precio_unitario), 0).toLocaleString()}</span>
                                    </div>
                                </div>

                                <button onClick={() => handleSeleccionar(est)} style={{ width: '100%', background: '#F8FAFC', border: '2px solid #E2E8F0', color: '#0F172A', padding: '14px', borderRadius: '14px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#9333EA'; e.currentTarget.style.color = '#9333EA'; e.currentTarget.style.backgroundColor = '#FAF5FF'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.color = '#0F172A'; e.currentTarget.style.backgroundColor = '#F8FAFC'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                                    <CheckCircle2 size={20} /> Seleccionar y Llenar
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                @keyframes slideUp { 
                    0% { opacity: 0; transform: translateY(30px) scale(0.98); } 
                    100% { opacity: 1; transform: translateY(0) scale(1); } 
                }
                @keyframes fadeIn {
                    0% { opacity: 0; }
                    100% { opacity: 1; }
                }
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                
                ul::-webkit-scrollbar { width: 6px; }
                ul::-webkit-scrollbar-track { background: transparent; }
                ul::-webkit-scrollbar-thumb { background-color: #CBD5E1; border-radius: 20px; }
            `}</style>
        </div>
    );
}
