import React, { useState } from 'react';
import { User, Mail, Lock } from 'lucide-react'; // Aprovechando la librería que ya usas

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Estados para simular los hovers y focus (ya que usamos estilos en línea)
    const [hoverBtn, setHoverBtn] = useState(false);
    const [focusEmail, setFocusEmail] = useState(false);
    const [focusPass, setFocusPass] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            // Ajusta el puerto (8000) o la ruta (/api/token/) si en tu backend es diferente
            const response = await fetch('http://localhost:8000/api/token/', {
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

                console.log("¡Login exitoso! Token guardado.");

                // Redirigimos al Menú Principal
                window.location.href = "/";
            } else {
                alert("Credenciales incorrectas. Verifica tu usuario y contraseña.");
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            alert("No se pudo conectar con el servidor.");
        }
    };


    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            /* Fondo azul desenfocado tipo cristal como en la imagen */
            background: 'radial-gradient(circle at 50% 50%, #4a90e2 0%, #003366 100%)',
            fontFamily: "'Inter', sans-serif"
        }}>

            <style>
                {`
                    .input-login::placeholder {
                        color: rgba(255, 255, 255, 0.8) !important;
                    }
                    .input-login {
                        color: #FFFFFF !important;
                    }
                `}
            </style>

            <div style={{
                width: '380px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: 'white'
            }}>

                {/* Icono superior de Usuario */}
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    backgroundColor: '#0b345c',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: '25px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                }}>
                    <User color="white" size={40} strokeWidth={1.5} />
                </div>

                {/* Título Adaptado */}
                <h1 style={{
                    fontSize: '20px',
                    fontWeight: '300',
                    letterSpacing: '2px',
                    margin: '0 0 50px 0',
                    textTransform: 'uppercase'
                }}>
                    SISTEMA INTEGRAL
                </h1>

                <form onSubmit={handleLogin} style={{ width: '100%' }}>

                    {/* Input de Correo con ícono de sobre */}
                    <div style={{ position: 'relative', width: '100%', marginBottom: '30px', display: 'flex', alignItems: 'center' }}>
                        <div style={{ position: 'absolute', left: '5px', display: 'flex' }}>
                            <Mail size={18} color="white" strokeWidth={1.5} />
                        </div>
                        <input
                            className='input-login'
                            type="text"
                            placeholder="Usuario"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => setFocusEmail(true)}
                            onBlur={() => setFocusEmail(false)}
                            required
                            style={{
                                width: '100%',
                                padding: '10px 10px 10px 35px',
                                background: 'transparent',
                                border: 'none',
                                borderBottom: focusEmail ? '2px solid white' : '1px solid rgba(245, 238, 238, 1)',
                                color: 'white',
                                fontSize: '15px',
                                outline: 'none',
                                transition: 'border-bottom 0.3s ease',
                            }}
                        />
                    </div>

                    {/* Input de Contraseña con ícono de candado */}
                    <div style={{ position: 'relative', width: '100%', marginBottom: '30px', display: 'flex', alignItems: 'center' }}>
                        <div style={{ position: 'absolute', left: '5px', display: 'flex' }}>
                            <Lock size={18} color="white" strokeWidth={1.5} />
                        </div>
                        <input
                            className='input-login'
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setFocusPass(true)}
                            onBlur={() => setFocusPass(false)}
                            required
                            style={{
                                width: '100%',
                                padding: '10px 10px 10px 35px',
                                background: 'transparent',
                                border: 'none',
                                borderBottom: focusPass ? '2px solid white' : '1px solid rgba(245, 238, 238, 1)',
                                color: 'white',
                                fontSize: '15px',
                                outline: 'none',
                                transition: 'border-bottom 0.3s ease'
                            }}
                        />
                    </div>

                    {/* Opciones debajo de los inputs */}
                    <div style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '12px',
                        marginBottom: '40px',
                        color: 'rgba(255, 255, 255, 0.9)'
                    }}>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                            <input type="checkbox" style={{ marginRight: '8px', cursor: 'pointer' }} />
                            Recordarme
                        </label>
                        <a href="#recuperar" style={{ color: 'rgba(255, 255, 255, 1)', textDecoration: 'none', fontStyle: 'italic' }}>
                            ¿Olvidaste tu contraseña?
                        </a>
                    </div>

                    {/* Botón Principal */}
                    <button
                        type="submit"
                        onMouseEnter={() => setHoverBtn(true)}
                        onMouseLeave={() => setHoverBtn(false)}
                        style={{
                            width: '100%',
                            padding: '14px',
                            backgroundColor: hoverBtn ? '#061f38' : '#0b345c',
                            color: 'white',
                            border: 'none',
                            borderRadius: '3px',
                            fontSize: '13px',
                            fontWeight: 'bold',
                            letterSpacing: '1px',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s ease',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)'
                        }}
                    >
                        ENTRAR
                    </button>
                </form>

            </div>
        </div>
    );
};

export default Login;
