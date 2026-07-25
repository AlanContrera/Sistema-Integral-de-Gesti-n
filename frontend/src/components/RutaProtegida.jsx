import React from 'react';
import { Navigate } from 'react-router-dom';

const RutaProtegida = ({ children }) => {
    const token = localStorage.getItem('access_token');

    if (!token) {
        // No hay token, lo mandamos al login
        return <Navigate to="/login" replace />;
    }

    // Sí hay token, lo dejamos pasar
    return children;
};

export default RutaProtegida;
