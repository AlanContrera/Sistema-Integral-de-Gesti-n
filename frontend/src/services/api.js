const BASE_URL = `http://${window.location.hostname}:8000/api`

export async function getComprobantes() {
    const respuesta = await fetch(`${BASE_URL}/comprobantes/`)
    if (!respuesta.ok) throw new Error('Error al obtener comprobantes')
    return respuesta.json()
}

export async function getCorreos() {
    const respuesta = await fetch(`${BASE_URL}/correos/`)
    if (!respuesta.ok) throw new Error('Error al obtener correos')
    return respuesta.json()
}

export async function getFacturas() {
    const respuesta = await fetch(`${BASE_URL}/facturas/`)
    if (!respuesta.ok) throw new Error('Error al obtener facturas')
    return respuesta.json()
}

export async function updateComprobante(id, datos) {
    const respuesta = await fetch(`${BASE_URL}/comprobantes/${id}/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos)
    })
    if (!respuesta.ok) throw new Error('Error al actualizar el comprobante')
    return respuesta.json()
}

export async function getCatalogos() {
    const respuesta = await fetch(`${BASE_URL}/catalogos/`)
    if (!respuesta.ok) throw new Error('Error al obtener catálogos')
    return respuesta.json()
}

export async function fetchConToken(endpoint, options = {}) {
    const token = localStorage.getItem('access_token');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Usamos tu BASE_URL para que no tengas que escribir la ruta completa
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
    }

    return response;
}
