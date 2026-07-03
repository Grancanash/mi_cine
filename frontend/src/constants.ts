/**
 * Configuración de la aplicación frontend.
 *
 * Prioridad de API_URL:
 *  1. Variable de entorno VITE_API_URL (definida en .env o en el sistema)
 *  2. Detección automática: reemplaza puerto :5173 (Vite dev) → :8000 (Django)
 *  3. En producción sin puerto, usa el mismo origin (Django debe servir /api)
 */

function buildApiUrl(): string {
    // 1) Variable de entorno explícita (útil en producción o entornos custom)
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }

    // 2) Detección automática basada en window.location
    const origin = window.location.origin;

    // En desarrollo: Vite corre en :5173, Django en :8000
    if (origin.includes(':5173')) {
        return origin.replace(':5173', ':8000') + '/api';
    }

    // En producción (mismo dominio, sin puerto, o con proxy inverso)
    return origin + '/api';
}

export const CONFIG = {
    API_URL: buildApiUrl(),
    APP_NAME: import.meta.env.VITE_APP_NAME || 'Mi Cine',
} as const;