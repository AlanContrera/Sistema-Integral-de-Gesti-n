import React from 'react';

const VistaOportunidades = () => {
    // Paleta Comercial Exacta (Azul Acero) - Alto Contraste
    const COLOR_FONDO_APP = '#F0F4F8'; // Fondo súper claro
    const COLOR_TEXTO = '#1E293B'; // Pizarra oscuro para lectura cómoda
    const COLOR_TEXTO_SEC = '#64748B'; // Gris pizarra secundario

    return (
        <div style={{ backgroundColor: COLOR_FONDO_APP, minHeight: '100%', padding: '24px' }}>
            <div>
                <h1 style={{ fontSize: '32px', fontWeight: '800', color: COLOR_TEXTO, margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>Tablero Comercial</h1>
                <p style={{ color: COLOR_TEXTO_SEC, fontSize: '16px', margin: 0, fontWeight: '500' }}>Este módulo está en construcción y será independiente de Reclutamiento.</p>
            </div>
            
            <div style={{ marginTop: '40px', padding: '40px', textAlign: 'center', backgroundColor: '#FFF', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h3 style={{ color: COLOR_TEXTO }}>Módulo Comercial</h3>
                <p style={{ color: COLOR_TEXTO_SEC }}>Aquí irán los procesos exclusivos de Comercial en un futuro.</p>
            </div>
        </div>
    );
};

export default VistaOportunidades;
