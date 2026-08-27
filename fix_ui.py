import sys
import codecs

filepath = 'frontend/src/components/cotizador/FormularioPreFactura.jsx'

with codecs.open(filepath, 'r', 'utf-8') as f:
    content = f.read()

parts = content.split('    return (\n        <div style={styles.mainWrapper}>')
before = parts[0] + '    return (\n        <div style={styles.mainWrapper}>\n'
after_part = parts[1]

# Divide por la seccion 3
parts2 = after_part.split('            {/* --- SECCIÓN 3: PARTIDAS DINÁMICAS (Diseño Moderno) --- */}')
if len(parts2) == 1:
    parts2 = after_part.split('            {/* --- SECCIÃ“N 3: PARTIDAS DINÃ MICAS (DiseÃ±o Moderno) --- */}')

after = '\n            {/* --- SECCIÓN 3: PARTIDAS DINÁMICAS (Diseño Moderno) --- */}' + parts2[1]

middle = '''
            {/* --- SECCIÓN 1: CABECERA (EMISOR Y RECEPTOR) --- */}
            <div style={styles.headerCard}>
                
                {/* 1. Buscar Cliente Receptor */}
                <div ref={buscadorRef} style={styles.searchBox}>
                    <label style={styles.label}>Cliente Receptor</label>

                    {!clienteId ? (
                        <div style={{ ...styles.searchInputContainer, borderColor: mostrarResultados ? '#4F46E5' : '#E2E8F0' }}>
                            <Search size={18} color={mostrarResultados ? '#4F46E5' : '#94A3B8'} />
                            <input
                                type="text"
                                placeholder="Buscar por Nombre o RFC..."
                                style={styles.searchInput}
                                value={busquedaCliente}
                                onChange={(e) => { setBusquedaCliente(e.target.value); setMostrarResultados(true); }}
                                onFocus={() => setMostrarResultados(true)}
                            />
                        </div>
                    ) : (
                        <div style={styles.clientCard}>
                            <div>
                                <h4 style={styles.clientCardTitle}>{clienteSeleccionado?.empresa}</h4>
                                <p style={styles.clientCardSub}><FileText size={14} /> RFC: {clienteSeleccionado?.rfc || 'No registrado'}</p>
                            </div>
                            <button onClick={() => { setClienteId(''); setBusquedaCliente(''); setEmpresaId(''); }} style={{ background: 'none', border: 'none', color: '#4F46E5', fontSize: '13px', fontWeight: '600', cursor: 'pointer', padding: '4px' }}>
                                Cambiar
                            </button>
                        </div>
                    )}

                    {mostrarResultados && !clienteId && (
                        <div style={styles.searchResults}>
                            {clientesFiltrados.length > 0 ? (
                                clientesFiltrados.map(c => (
                                    <div key={c.id} style={styles.resultItem} onClick={() => { setClienteId(c.id); setMostrarResultados(false); }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAFC'} onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFFFFF'}>
                                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#1E1B4B' }}>{c.empresa}</span>
                                        <span style={{ fontSize: '12px', color: '#64748B' }}>RFC: {c.rfc || 'S/N'}</span>
                                    </div>
                                ))
                            ) : (
                                <div style={{ padding: '16px', textAlign: 'center', color: '#64748B', fontSize: '14px' }}>No se encontraron clientes</div>
                            )}
                        </div>
                    )}
                </div>

                {/* 2. Empresa que Factura */}
                <div>
                    <label style={styles.label}>Empresa que Factura</label>
                    <div style={{ position: 'relative' }}>
                        <Building2 size={18} color={!clienteId ? "#CBD5E1" : "#94A3B8"} style={{ position: 'absolute', left: '16px', top: '16px' }} />
                        <select 
                            style={{ ...styles.input, paddingLeft: '44px', backgroundColor: !clienteId ? '#F8FAFC' : '#FFFFFF', cursor: !clienteId ? 'not-allowed' : 'pointer' }} 
                            value={empresaId} 
                            onChange={(e) => setEmpresaId(e.target.value)}
                            disabled={!clienteId}
                        >
                            <option value="">{clienteId ? '-- Selecciona Empresa --' : '-- Selecciona un Cliente primero --'}</option>
                            {empresasDisponibles.map(e => <option key={e.id} value={e.id}>{e.nombre_empresa}</option>)}
                        </select>
                    </div>
                </div>

            </div>

            {/* --- SECCIÓN 2: CONFIGURACIÓN FISCAL OCULTA --- */}
            <div
                style={styles.configHeader}
                onClick={() => setMostrarConfigFiscal(!mostrarConfigFiscal)}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFFFFF'}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Calculator size={20} color="#4F46E5" />
                    <span style={{ fontSize: '15px', fontWeight: '600', color: '#1E293B' }}>Configuración Fiscal (Opcional)</span>
                    <span style={{ fontSize: '13px', color: '#64748B', backgroundColor: '#F1F5F9', padding: '2px 8px', borderRadius: '12px' }}>Pre-llenado</span>
                </div>
                {mostrarConfigFiscal ? <ChevronUp size={20} color="#64748B" /> : <ChevronDown size={20} color="#64748B" />}
            </div>

            {mostrarConfigFiscal && (
                <div style={styles.configBody}>
                    <div>
                        <label style={styles.label}>Fecha de Pago</label>
                        <input type="date" name="fecha_pago" value={parametros.fecha_pago} onChange={handleChangeParam} style={styles.input} />
                    </div>
                    <div>
                        <label style={styles.label}>Moneda</label>
                        <select name="moneda" value={parametros.moneda} onChange={handleChangeParam} style={styles.input}>
                            <option value="MXN - Peso Mexicano">MXN - Peso Mexicano</option>
                            <option value="USD - Dolar americano">USD - Dólar americano</option>
                        </select>
                    </div>
                    <div>
                        <label style={styles.label}>Tipo de Cambio</label>
                        <input type="number" step="0.01" name="tipo_cambio" value={parametros.tipo_cambio} onChange={handleChangeParam} disabled={parametros.moneda.startsWith('MXN')} style={{ ...styles.input, backgroundColor: parametros.moneda.startsWith('MXN') ? '#E2E8F0' : '#F8FAFC' }} />
                    </div>
                    <div>
                        <label style={styles.label}>Forma de Pago</label>
                        <select name="forma_pago" value={parametros.forma_pago} onChange={handleChangeParam} style={styles.input}>
                            <option value="03 - TRANSFERENCIA ELECTRÓNICA DE FONDOS">03 - TRANSFERENCIA ELECTRÓNICA DE FONDOS</option>
                            <option value="01 - EFECTIVO">01 - EFECTIVO</option>
                            <option value="02 - CHEQUE NOMINATIVO">02 - CHEQUE NOMINATIVO</option>
                        </select>
                    </div>
                    <div>
                        <label style={styles.label}>Método de Pago</label>
                        <select name="metodo_pago" value={parametros.metodo_pago} onChange={handleChangeParam} style={styles.input}>
                            <option value="PUE - Pago en una sola exhibición">PUE - Pago en una sola exhibición</option>
                            <option value="PPD - Pago en parcialidades o diferido">PPD - Pago en parcialidades o diferido</option>
                        </select>
                    </div>
                    <div>
                        <label style={styles.label}>Uso de CFDI</label>
                        <select name="uso_cfdi" value={parametros.uso_cfdi} onChange={handleChangeParam} style={styles.input}>
                            <option value="G03 - GASTOS EN GENERAL">G03 - GASTOS EN GENERAL</option>
                            <option value="G01 - ADQUISICIÓN DE MERCANCIAS">G01 - ADQUISICIÓN DE MERCANCIAS</option>
                        </select>
                    </div>
                </div>
            )}
'''

new_content = before + middle + after
with codecs.open(filepath, 'w', 'utf-8') as f:
    f.write(new_content)
print('Fixed successfully')
