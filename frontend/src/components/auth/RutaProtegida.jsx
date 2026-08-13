import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const RutaProtegida = ({ children, moduloRequerido }) => {
    const { usuario, cargandoAuth } = useContext(AuthContext);
    const token = localStorage.getItem('access_token');

    // 1. Si no hay token, al login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // 2. Si todavía estamos descargando su perfil del servidor, mostramos carga
    if (cargandoAuth) {
        return <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Inter' }}>Verificando credenciales...</div>;
    }

    // 3. Si ya cargó pero no hay usuario
    if (!usuario) {
        return <Navigate to="/login" replace />;
    }

    // 4. Si la ruta exige un módulo en específico (Seguridad por URL)
    if (moduloRequerido) {
        const esAdmin = usuario.rol === 'super_admin' || usuario.rol === 'admin';
        const tienePermiso = usuario[moduloRequerido] === true;

        if (!esAdmin && !tienePermiso) {
            // No tiene permiso para entrar aquí, lo regresamos al dashboard
            return <Navigate to="/" replace />;
        }
    }

    // Si pasa todas las validaciones, adelante
    return children;
};

export default RutaProtegida;
