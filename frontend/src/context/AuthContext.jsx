import React, { createContext, useState, useEffect } from 'react';
import { fetchConToken } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);
    const [cargandoAuth, setCargandoAuth] = useState(true);

    useEffect(() => {
        verificarSesion();
    }, []);

    const verificarSesion = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            setCargandoAuth(false);
            return;
        }

        try {
            const response = await fetchConToken('/usuarios/me/');
            if (response.ok) {
                const data = await response.json();
                setUsuario(data);
            } else {
                // Token inválido o expirado
                logout();
            }
        } catch (error) {
            console.error("Error validando sesión:", error);
            logout();
        } finally {
            setCargandoAuth(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUsuario(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ usuario, setUsuario, cargandoAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
