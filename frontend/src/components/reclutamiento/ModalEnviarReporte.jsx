import React, { useState, useEffect } from 'react';
import { Mail, X, Send } from 'lucide-react';

const ModalEnviarReporte = ({ isOpen, onClose, onSend, candidatoNombre, vacanteNombre, correoCliente }) => {
    const [email, setEmail] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [enviando, setEnviando] = useState(false);

    // Auto-completar el correo inteligentemente cuando se abre el modal
    useEffect(() => {
        if (isOpen) {
            setEmail(correoCliente || '');
            setMensaje('');
        }
    }, [isOpen, correoCliente]);

    if (!isOpen) return null;


    const handleSend = async () => {
        if (!email) return;
        setEnviando(true);
        await onSend({ email, mensaje });
        setEnviando(false);
        setEmail('');
        setMensaje('');
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
            <div style={{
                backgroundColor: '#FFFFFF', borderRadius: '16px', width: '90%', maxWidth: '500px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', overflow: 'hidden', animation: 'modalSlideUp 0.3s ease-out'
            }}>
                {/* Encabezado */}
                <div style={{ backgroundColor: '#96C2DB', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'white' }}>
                        <Mail size={24} />
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Enviar Reporte al Cliente</h3>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#CBD5E1', cursor: 'pointer' }}>
                        <X size={20} />
                    </button>
                </div>

                {/* Cuerpo */}
                <div style={{ padding: '24px' }}>
                    <div style={{ backgroundColor: '#F1F5F9', padding: '16px', borderRadius: '8px', marginBottom: '20px', borderLeft: '4px solid #3B82F6' }}>
                        <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#64748B' }}>Asunto Automático:</p>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#1E293B' }}>
                            Reporte Ejecutivo - {candidatoNombre || 'Candidato'} ({vacanteNombre || 'Posición'})
                        </p>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
                            Correo Electrónico del Cliente *
                        </label>
                        <input
                            type="email"
                            placeholder="cliente@empresa.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
                            Nota Adicional (Opcional)
                        </label>
                        <textarea
                            placeholder="Agrega un mensaje personalizado para el cliente..."
                            value={mensaje}
                            onChange={(e) => setMensaje(e.target.value)}
                            rows={3}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '14px', boxSizing: 'border-box', resize: 'none' }}
                        />
                    </div>

                    <button
                        onClick={handleSend}
                        disabled={!email || enviando}
                        style={{
                            width: '100%', padding: '14px', borderRadius: '8px', border: 'none',
                            backgroundColor: email ? '#96C2DB' : '#94A3B8', color: 'white', fontWeight: '600',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: email ? 'pointer' : 'not-allowed',
                            transition: 'background-color 0.2s'
                        }}
                    >
                        {enviando ? 'Enviando y Generando PDF...' : <><Send size={18} /> Enviar Reporte Seguro</>}
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes modalSlideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default ModalEnviarReporte;
