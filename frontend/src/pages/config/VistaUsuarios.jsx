import React, { useState, useEffect } from 'react';
import { Check, X, Shield, Plus, Edit2, UserX, UserCheck } from 'lucide-react';

const VistaUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [usuarioEditando, setUsuarioEditando] = useState(null);

    const [formData, setFormData] = useState({
        username: '', email: '', password: '', first_name: '', last_name: '', rol: 'usuario_estandar',
        acceso_pagos: false, acceso_cotizador: false, acceso_reclutamiento: false, acceso_comercial: false
    });

    useEffect(() => { obtenerUsuarios(); }, []);

    const obtenerUsuarios = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`http://${window.location.hostname}:8000/api/usuarios/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) setUsuarios(await response.json());
        } catch (error) { console.error("Error:", error); }
        finally { setLoading(false); }
    };

    const abrirModalCreacion = () => {
        setFormData({
            username: '', email: '', password: '', first_name: '', last_name: '', rol: 'usuario_estandar',
            acceso_pagos: false, acceso_cotizador: false, acceso_reclutamiento: false, acceso_comercial: false
        });
        setUsuarioEditando(null);
        setShowModal(true);
    };

    const abrirModalEdicion = (user) => {
        setFormData({
            username: user.username, email: user.email, password: '', first_name: user.first_name, last_name: user.last_name, rol: user.rol,
            acceso_pagos: user.acceso_pagos, acceso_cotizador: user.acceso_cotizador,
            acceso_reclutamiento: user.acceso_reclutamiento, acceso_comercial: user.acceso_comercial
        });
        setUsuarioEditando(user.id);
        setShowModal(true);
    };

    const handleToggleActivo = async (id, isActiveActual) => {
        if (!window.confirm(`¿Confirmas que deseas ${isActiveActual ? 'suspender' : 'reactivar'} a este usuario?`)) return;
        try {
            const token = localStorage.getItem('access_token');
            const res = await fetch(`http://${window.location.hostname}:8000/api/usuarios/${id}/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ is_active: !isActiveActual })
            });
            if (res.ok) obtenerUsuarios();
        } catch (error) { console.error("Error:", error); }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('access_token');
            const method = usuarioEditando ? 'PATCH' : 'POST';
            const url = `http://${window.location.hostname}:8000/api/usuarios/${usuarioEditando ? usuarioEditando + '/' : ''}`;
            const payload = { ...formData };
            if (usuarioEditando && !payload.password) delete payload.password;

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload)
            });

            if (response.ok) { setShowModal(false); obtenerUsuarios(); }
            else { alert("Ocurrió un error al guardar. Verifica que el Username no esté repetido."); }
        } catch (error) { console.error("Error:", error); }
    };

    // Diseño corporativo minimalista para los roles (Adiós arcoíris)
    const renderRol = (rol) => {
        const rolesMap = {
            'super_admin': 'Super Admin',
            'admin': 'Administrador',
            'supervisor': 'Supervisor',
            'usuario_estandar': 'Estándar'
        };
        const label = rolesMap[rol] || rol;

        if (rol === 'super_admin' || rol === 'admin') {
            return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#111827', fontWeight: '600', fontSize: '13px' }}><Shield size={14} color="#4F46E5" /> {label}</span>;
        }
        return <span style={{ color: '#4B5563', fontWeight: '500', fontSize: '13px' }}>{label}</span>;
    };

    const renderAccesos = (user) => {
        if (user.rol === 'admin' || user.rol === 'super_admin') {
            return <span style={{ fontSize: '13px', color: '#4F46E5', fontWeight: '500' }}>Acceso Total (Admin)</span>;
        }

        const modulos = [];
        if (user.acceso_pagos) modulos.push('Pagos');
        if (user.acceso_cotizador) modulos.push('Cotizador');
        if (user.acceso_reclutamiento) modulos.push('Reclutamiento');
        if (user.acceso_comercial) modulos.push('Comercial');

        if (modulos.length === 0) return <span style={{ fontSize: '13px', color: '#9CA3AF' }}>Sin asignación</span>;

        return (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {modulos.map(m => (
                    <span key={m} style={{ backgroundColor: '#F3F4F6', border: '1px solid #E5E7EB', color: '#374151', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500' }}>{m}</span>
                ))}
            </div>
        );
    };

    return (
        <div style={{ padding: '40px 60px', fontFamily: "'Inter', sans-serif", background: '#FAFAFA', minHeight: '100vh' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px', maxWidth: '1200px', margin: '0 auto 30px auto' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: '#111827', letterSpacing: '-0.5px' }}>
                        Directorio de Usuarios
                    </h1>
                    <p style={{ margin: '6px 0 0 0', color: '#6B7280', fontSize: '15px' }}>Administra los accesos y privilegios corporativos.</p>
                </div>

                <button onClick={abrirModalCreacion} style={{ backgroundColor: '#111827', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', transition: 'background 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    <Plus size={16} /> Nuevo Usuario
                </button>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', overflow: 'hidden', border: '1px solid #E5E7EB', maxWidth: '1200px', margin: '0 auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                            <th style={thStyle}>USUARIO</th>
                            <th style={thStyle}>ROL</th>
                            <th style={thStyle}>MÓDULOS PERMITIDOS</th>
                            <th style={thStyle}>ESTADO</th>
                            <th style={{ ...thStyle, textAlign: 'right' }}>ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>Cargando directorio...</td></tr> :
                            usuarios.map((user) => (
                                <tr key={user.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ fontWeight: '600', color: '#111827', fontSize: '14px' }}>{user.first_name} {user.last_name}</div>
                                        <div style={{ color: '#6B7280', fontSize: '13px', marginTop: '2px' }}>{user.email}</div>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>{renderRol(user.rol)}</td>
                                    <td style={{ padding: '16px 24px' }}>{renderAccesos(user)}</td>
                                    <td style={{ padding: '16px 24px' }}>
                                        {user.is_active ?
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#047857', backgroundColor: '#D1FAE5', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}><Check size={12} /> Activo</span> :
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#B91C1C', backgroundColor: '#FEE2E2', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}><X size={12} /> Suspendido</span>
                                        }
                                    </td>
                                    <td style={{ padding: '16px 24px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                        <button onClick={() => abrirModalEdicion(user)} style={actionBtn('#F3F4F6', '#374151', '#E5E7EB')}>
                                            Editar
                                        </button>
                                        <button onClick={() => handleToggleActivo(user.id, user.is_active)} style={actionBtn('white', user.is_active ? '#B91C1C' : '#047857', user.is_active ? '#FECACA' : '#A7F3D0')}>
                                            {user.is_active ? 'Suspender' : 'Reactivar'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(17, 24, 39, 0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', width: '500px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', overflow: 'hidden' }}>

                        <div style={{ padding: '24px 32px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#111827' }}>{usuarioEditando ? 'Editar perfil de usuario' : 'Registrar nuevo usuario'}</h3>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div style={{ flex: 1 }}><label style={formLabel}>Nombre</label><input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required style={inputStyle} /></div>
                                <div style={{ flex: 1 }}><label style={formLabel}>Apellido</label><input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required style={inputStyle} /></div>
                            </div>

                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div style={{ flex: 1 }}><label style={formLabel}>Username</label><input type="text" name="username" value={formData.username} onChange={handleChange} required style={inputStyle} /></div>
                                <div style={{ flex: 1 }}><label style={formLabel}>Correo Electrónico</label><input type="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle} /></div>
                            </div>

                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={formLabel}>{usuarioEditando ? 'Nueva Contraseña (Opcional)' : 'Contraseña'}</label>
                                    <input type="password" name="password" value={formData.password} onChange={handleChange} required={!usuarioEditando} style={inputStyle} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={formLabel}>Rol (Jerarquía)</label>
                                    <select name="rol" value={formData.rol} onChange={handleChange} style={inputStyle}>
                                        <option value="super_admin">Super Admin</option>
                                        <option value="admin">Administrador TI</option>
                                        <option value="supervisor">Supervisor</option>
                                        <option value="usuario_estandar">Usuario Estándar</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ marginTop: '10px' }}>
                                <label style={{ ...formLabel, borderBottom: '1px solid #E5E7EB', paddingBottom: '8px', marginBottom: '12px' }}>MÓDULOS PERMITIDOS</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <label style={checkboxLabel}><input type="checkbox" name="acceso_pagos" checked={formData.acceso_pagos} onChange={handleChange} style={checkboxInput} /> Gestor de Pagos</label>
                                    <label style={checkboxLabel}><input type="checkbox" name="acceso_cotizador" checked={formData.acceso_cotizador} onChange={handleChange} style={checkboxInput} /> Cotizador AI</label>
                                    <label style={checkboxLabel}><input type="checkbox" name="acceso_reclutamiento" checked={formData.acceso_reclutamiento} onChange={handleChange} style={checkboxInput} /> Reclutamiento</label>
                                    <label style={checkboxLabel}><input type="checkbox" name="acceso_comercial" checked={formData.acceso_comercial} onChange={handleChange} style={checkboxInput} /> Comercial</label>
                                </div>
                            </div>

                            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 16px', backgroundColor: 'white', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#374151', fontWeight: '500', cursor: 'pointer', fontSize: '14px' }}>Cancelar</button>
                                <button type="submit" style={{ padding: '10px 16px', backgroundColor: '#4F46E5', border: 'none', borderRadius: '6px', color: 'white', fontWeight: '500', cursor: 'pointer', fontSize: '14px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                    {usuarioEditando ? 'Guardar Cambios' : 'Crear Usuario'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Estilos corporativos minimalistas 
const thStyle = { padding: '12px 24px', color: '#6B7280', fontSize: '12px', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase' };
const formLabel = { display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' };
const inputStyle = { padding: '10px 12px', backgroundColor: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '14px', width: '100%', boxSizing: 'border-box', outline: 'none', color: '#111827', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' };
const actionBtn = (bg, color, border) => ({ backgroundColor: bg, color: color, border: `1px solid ${border}`, padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '13px', transition: 'all 0.2s' });
const checkboxLabel = { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#374151', cursor: 'pointer' };
const checkboxInput = { width: '16px', height: '16px', cursor: 'pointer', accentColor: '#4F46E5' };

export default VistaUsuarios;
