import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, Loader2, ArrowRight, ShieldCheck, HelpCircle, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mostrarPass, setMostrarPass] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [focusEmail, setFocusEmail] = useState(false);
    const [focusPass, setFocusPass] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setCargando(true);

        try {
            const response = await fetch(`http://${window.location.hostname}:8000/api/token/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: email, password: password })
            });

            if (response.ok) {
                const data = await response.json();

                // Guardamos los tokens en el navegador
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);

                // Redirigimos al Menú Principal
                window.location.href = "/";
            } else {
                toast.error("Credenciales incorrectas. Verifica tu usuario y contraseña.");
                setCargando(false);
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            toast.error("No se pudo conectar con el servidor.");
            setCargando(false);
        }
    };

    const handleRestablecerPass = (e) => {
        e.preventDefault();
        toast((t) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HelpCircle size={18} color="#C084FC" />
                <span style={{ fontSize: '13px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Para restablecer tu contraseña, contacta al administrador de TI.
                </span>
            </div>
        ), { duration: 4500 });
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#06040A',
            backgroundImage: `
                radial-gradient(circle at 50% 100%, rgba(217, 70, 239, 0.14) 0%, rgba(99, 102, 241, 0.08) 45%, transparent 70%),
                radial-gradient(circle at 20% 20%, rgba(244, 114, 182, 0.07) 0%, transparent 50%),
                radial-gradient(circle at 80% 30%, rgba(129, 140, 248, 0.07) 0%, transparent 50%)
            `,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            position: 'relative',
            padding: '36px 20px',
            boxSizing: 'border-box'
        }}>

            {/* --- FUENTES GOOGLE FONTS (OUTFIT + PLUS JAKARTA SANS) Y REGLAS CSS --- */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

                @keyframes spin { 100% { transform: rotate(360deg); } }
                .animate-spin { animation: spin 1s linear infinite; }

                /* Desactiva el fondo blanco de autocompletar de Chrome/Edge */
                .suttere-input:-webkit-autofill,
                .suttere-input:-webkit-autofill:hover, 
                .suttere-input:-webkit-autofill:focus, 
                .suttere-input:-webkit-autofill:active {
                    -webkit-box-shadow: 0 0 0 1000px #0F0B18 inset !important;
                    -webkit-text-fill-color: #FFFFFF !important;
                    caret-color: #FFFFFF !important;
                    transition: background-color 5000s ease-in-out 0s;
                }

                .suttere-input {
                    color-scheme: dark;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }
                
                .suttere-input::placeholder {
                    color: #52525B !important;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }
            `}</style>

            {/* Espaciador superior */}
            <div style={{ height: '10px' }} />

            {/* --- TARJETA PRINCIPAL SUTTERE MIDNIGHT ROSE --- */}
            <div style={{
                width: '100%',
                maxWidth: '480px', // <-- Más ancha y alargada (antes 430px)
                backgroundColor: 'rgba(14, 10, 22, 0.78)',
                backdropFilter: 'blur(28px)',
                WebkitBackdropFilter: 'blur(28px)',
                borderRadius: '30px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 35px 70px -15px rgba(0, 0, 0, 0.95), inset 0 1px 1px 0 rgba(255, 255, 255, 0.18)',
                padding: '52px 44px 44px 44px', // <-- Más espacio vertical y horizontal
                boxSizing: 'border-box',
                position: 'relative'
            }}>


                {/* Pill Superior Discreto */}

                {/* Encabezado con Tipografía Suttere (Outfit Dual-Weight) */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h1 style={{
                        fontSize: '30px',
                        fontWeight: '700',
                        letterSpacing: '-0.8px',
                        margin: '0 0 8px 0',
                        fontFamily: "'Outfit', sans-serif",
                        lineHeight: 1.15,
                        color: '#FFFFFF',
                        textShadow: '0 0 30px rgba(255, 255, 255, 0.45)'
                    }}>
                        Inicia Sesión
                    </h1>



                    <p style={{
                        fontSize: '13.5px',
                        color: '#A1A1AA',
                        margin: 0,
                        fontWeight: '400',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        letterSpacing: '-0.1px'
                    }}>
                        Accede a tu ecosistema digital con seguridad.
                    </p>
                </div>

                {/* Formulario */}
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

                    {/* Campo Usuario / Correo */}
                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#E4E4E7',
                            marginBottom: '8px',
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            letterSpacing: '0.1px'
                        }}>
                            Correo Electrónico / Usuario
                        </label>
                        <div style={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: '#0F0B18',
                            borderRadius: '14px',
                            border: focusEmail ? '1px solid #C084FC' : '1px solid rgba(255, 255, 255, 0.08)',
                            boxShadow: focusEmail ? '0 0 0 3px rgba(192, 132, 252, 0.2), 0 0 15px rgba(192, 132, 252, 0.15)' : 'none',
                            transition: 'all 0.2s ease',
                            overflow: 'hidden'
                        }}>
                            <div style={{ paddingLeft: '14px', display: 'flex', alignItems: 'center', color: focusEmail ? '#F472B6' : '#71717A' }}>
                                <User size={18} />
                            </div>
                            <input
                                className="suttere-input"
                                type="text"
                                placeholder="usuario@ejemplo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={() => setFocusEmail(true)}
                                onBlur={() => setFocusEmail(false)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '13px 14px',
                                    background: 'transparent',
                                    border: 'none',
                                    outline: 'none',
                                    color: '#FFFFFF',
                                    fontSize: '14px'
                                }}
                            />
                        </div>
                    </div>

                    {/* Campo Contraseña */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <label style={{
                                fontSize: '12px',
                                fontWeight: '600',
                                color: '#E4E4E7',
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                letterSpacing: '0.1px'
                            }}>
                                Contraseña
                            </label>
                            <button
                                type="button"
                                onClick={handleRestablecerPass}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#C084FC',
                                    fontSize: '11.5px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    padding: 0,
                                    textDecoration: 'none',
                                    fontFamily: "'Plus Jakarta Sans', sans-serif"
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.color = '#F472B6'; e.currentTarget.style.textDecoration = 'underline'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.color = '#C084FC'; e.currentTarget.style.textDecoration = 'none'; }}
                            >
                                ¿Olvidaste tu contraseña?
                            </button>
                        </div>
                        <div style={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: '#0F0B18',
                            borderRadius: '14px',
                            border: focusPass ? '1px solid #C084FC' : '1px solid rgba(255, 255, 255, 0.08)',
                            boxShadow: focusPass ? '0 0 0 3px rgba(192, 132, 252, 0.2), 0 0 15px rgba(192, 132, 252, 0.15)' : 'none',
                            transition: 'all 0.2s ease',
                            overflow: 'hidden'
                        }}>
                            <div style={{ paddingLeft: '14px', display: 'flex', alignItems: 'center', color: focusPass ? '#F472B6' : '#71717A' }}>
                                <Lock size={18} />
                            </div>
                            <input
                                className="suttere-input"
                                type={mostrarPass ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={() => setFocusPass(true)}
                                onBlur={() => setFocusPass(false)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '13px 14px',
                                    background: 'transparent',
                                    border: 'none',
                                    outline: 'none',
                                    color: '#FFFFFF',
                                    fontSize: '14px'
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setMostrarPass(!mostrarPass)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    paddingRight: '14px',
                                    color: '#71717A',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                {mostrarPass ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Botón Sólido Blanco Suttere */}
                    <button
                        type="submit"
                        disabled={cargando}
                        style={{
                            width: '100%',
                            marginTop: '10px',
                            padding: '14px',
                            borderRadius: '24px',
                            backgroundColor: '#FFFFFF',
                            border: 'none',
                            color: '#090514',
                            fontSize: '14.5px',
                            fontWeight: '700',
                            fontFamily: "'Outfit', sans-serif",
                            letterSpacing: '0.2px',
                            cursor: cargando ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            boxShadow: '0 0 25px rgba(255, 255, 255, 0.25)',
                            transition: 'all 0.2s ease',
                            opacity: cargando ? 0.7 : 1
                        }}
                        onMouseEnter={e => {
                            if (!cargando) {
                                e.currentTarget.style.transform = 'translateY(-1px)';
                                e.currentTarget.style.boxShadow = '0 0 35px rgba(255, 255, 255, 0.45)';
                            }
                        }}
                        onMouseLeave={e => {
                            if (!cargando) {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 0 25px rgba(255, 255, 255, 0.25)';
                            }
                        }}
                    >
                        {cargando ? (
                            <>
                                <Loader2 size={18} className="animate-spin" color="#090514" />
                                <span>Autenticando...</span>
                            </>
                        ) : (
                            <>
                                <span>Ingresar al Sistema</span>
                                <ArrowRight size={17} strokeWidth={2.5} />
                            </>
                        )}
                    </button>
                </form>

                {/* Pie de Seguridad de la Tarjeta */}
                <div style={{
                    marginTop: '26px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    color: '#71717A',
                    fontSize: '12px',
                    fontFamily: "'Plus Jakarta Sans', sans-serif"
                }}>
                    <ShieldCheck size={14} color="#C084FC" />
                    <span>Conexión segura cifrada </span>
                </div>

            </div>

            {/* --- FOOTER INFERIOR --- */}
            <div style={{
                width: '100%',
                maxWidth: '1200px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                paddingTop: '20px',
                color: '#71717A',
                fontSize: '12px',
                fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}>
                <div>
                    © 2026. All rights reserved.
                </div>

                <div style={{ display: 'flex', gap: '20px' }}>
                    <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#F472B6'} onMouseLeave={e => e.currentTarget.style.color = '#71717A'}>Privacy Policy</span>
                    <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#F472B6'} onMouseLeave={e => e.currentTarget.style.color = '#71717A'}>Terms of Service</span>
                    <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#F472B6'} onMouseLeave={e => e.currentTarget.style.color = '#71717A'}>Security</span>
                    <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#F472B6'} onMouseLeave={e => e.currentTarget.style.color = '#71717A'}>Help Center</span>
                </div>
            </div>

        </div>
    );
};

export default Login;
