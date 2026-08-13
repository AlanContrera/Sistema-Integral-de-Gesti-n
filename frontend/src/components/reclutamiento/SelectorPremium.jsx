import React, { useState, useEffect, useRef } from 'react';
import { Check, ChevronDown } from 'lucide-react';

const SelectorPremium = ({ opciones, valorActual, onChange }) => {
    const [abierto, setAbierto] = useState(false);
    const ref = useRef(null);

    // Cerrar al dar clic afuera
    useEffect(() => {
        const handleClickFuera = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setAbierto(false);
            }
        };
        document.addEventListener('mousedown', handleClickFuera);
        return () => document.removeEventListener('mousedown', handleClickFuera);
    }, []);

    // Usamos '==' para que empate números y strings sin problema (ej. IDs de usuarios)
    const seleccionado = opciones.find(o => o.id == valorActual) || opciones[0];

    return (
        <div ref={ref} style={{ position: 'relative', display: 'inline-block', minWidth: '180px' }}>
            <div
                onClick={() => setAbierto(!abierto)}
                style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '8px 14px', borderRadius: '12px',
                    backgroundColor: '#F8FAFC', color: '#475569',
                    fontSize: '13px', fontWeight: '700', textTransform: 'uppercase',
                    cursor: 'pointer', userSelect: 'none',
                    transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    border: '1px solid #E2E8F0',
                    justifyContent: 'space-between'
                }}
            >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {seleccionado?.label || 'Seleccionar...'}
                </span>
                <ChevronDown size={14} style={{ transform: abierto ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }} />
            </div>

            {abierto && (
                <div style={{
                    position: 'absolute', top: '100%', left: 0, marginTop: '8px',
                    minWidth: '100%', backgroundColor: '#FFF',
                    borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
                    border: '1px solid #E2E8F0', zIndex: 50, overflow: 'hidden',
                    display: 'flex', flexDirection: 'column'
                }}>
                    {opciones.map((opc) => {
                        const esSeleccionado = opc.id == valorActual;
                        return (
                            <div
                                key={opc.id}
                                onClick={() => { onChange(opc.id); setAbierto(false); }}
                                onMouseEnter={(e) => { if (!esSeleccionado) e.currentTarget.style.backgroundColor = '#F8FAFC' }}
                                onMouseLeave={(e) => { if (!esSeleccionado) e.currentTarget.style.backgroundColor = 'transparent' }}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '12px 16px', cursor: 'pointer',
                                    backgroundColor: esSeleccionado ? '#EFF6FF' : 'transparent',
                                    color: esSeleccionado ? '#2563EB' : '#475569',
                                    fontWeight: esSeleccionado ? '600' : '500',
                                    fontSize: '14px', transition: 'background-color 0.2s',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {opc.label}
                                {esSeleccionado && <Check size={18} color="#2563EB" strokeWidth={3} style={{ marginLeft: '12px' }} />}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default SelectorPremium;
