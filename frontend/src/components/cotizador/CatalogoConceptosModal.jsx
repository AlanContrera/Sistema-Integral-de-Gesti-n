import React, { useState } from 'react';
import { X, Search, Check, FileText, Sparkles } from 'lucide-react';

export default function CatalogoConceptosModal({ isOpen, onClose, conceptos, onSelectConcepto, empresaNombre, clienteNombre }) {
    const [busqueda, setBusqueda] = useState('');

    if (!isOpen) return null;

    const filtrados = conceptos.filter(c =>
        c.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
        (c.clave_sat && c.clave_sat.includes(busqueda))
    );

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '20px'
        }}>
            <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                width: '100%',
                maxWidth: '750px',
                maxHeight: '85vh',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                overflow: 'hidden'
            }}>
                {/* Header */}
                <div style={{
                    padding: '24px 28px',
                    borderBottom: '1px solid #F1F5F9',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'linear-gradient(135deg, #FAF5FF 0%, #FFFFFF 100%)'
                }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <FileText size={20} color="#9333EA" />
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#1E293B' }}>
                                Catálogo de Conceptos Autorizados
                            </h3>
                        </div>
                        <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>
                            {empresaNombre ? `${empresaNombre} → ` : ''}{clienteNombre || 'Cliente seleccionado'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: '#F1F5F9',
                            border: 'none',
                            borderRadius: '12px',
                            width: '36px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: '#64748B',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#E2E8F0'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#F1F5F9'}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Buscador interno */}
                <div style={{ padding: '16px 28px', borderBottom: '1px solid #F8FAFC', backgroundColor: '#FFFFFF' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '12px' }} />
                        <input
                            type="text"
                            placeholder="Buscar en los conceptos..."
                            value={busqueda}
                            onChange={e => setBusqueda(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 14px 10px 38px',
                                borderRadius: '12px',
                                border: '1px solid #E2E8F0',
                                fontSize: '14px',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>
                </div>

                {/* Lista de conceptos completos */}
                <div style={{
                    padding: '20px 28px',
                    overflowY: 'auto',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px'
                }}>
                    {filtrados.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94A3B8' }}>
                            No se encontraron conceptos para esta búsqueda.
                        </div>
                    ) : (
                        filtrados.map((c, idx) => (
                            <div
                                key={c.id || idx}
                                onClick={() => onSelectConcepto(c)}
                                style={{
                                    border: '1px solid #E2E8F0',
                                    borderRadius: '14px',
                                    padding: '18px 20px',
                                    backgroundColor: '#FFFFFF',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '10px'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = '#C084FC';
                                    e.currentTarget.style.backgroundColor = '#FAF5FF';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(147, 51, 234, 0.08)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = '#E2E8F0';
                                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                {/* Texto Completo sin cortes */}
                                <p style={{
                                    margin: 0,
                                    fontSize: '14px',
                                    color: '#1E293B',
                                    lineHeight: '1.6',
                                    fontWeight: '500',
                                    whiteSpace: 'pre-wrap'
                                }}>
                                    {c.descripcion}
                                </p>

                                {/* Metadatos fiscales */}
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <span style={{
                                        fontSize: '11px',
                                        fontWeight: '700',
                                        backgroundColor: '#F1F5F9',
                                        color: '#475569',
                                        padding: '3px 8px',
                                        borderRadius: '6px'
                                    }}>
                                        SAT: {c.clave_sat || '80141600'}
                                    </span>
                                    <span style={{
                                        fontSize: '11px',
                                        fontWeight: '700',
                                        backgroundColor: '#F1F5F9',
                                        color: '#475569',
                                        padding: '3px 8px',
                                        borderRadius: '6px'
                                    }}>
                                        Unidad: {c.unidad_sat || 'E48'}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div style={{
                    padding: '14px 28px',
                    borderTop: '1px solid #F1F5F9',
                    backgroundColor: '#F8FAFC',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '13px',
                    color: '#64748B'
                }}>
                    <span>{filtrados.length} conceptos disponibles</span>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '10px',
                            border: '1px solid #CBD5E1',
                            background: '#FFFFFF',
                            color: '#475569',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
