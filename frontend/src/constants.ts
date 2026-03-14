const origin = window.location.origin;
const root = origin.replace(':5173', ':8000');

export const CONFIG = {
    API_URL: `${root}/api`,
    APP_NAME: 'Mi Cine'
} as const;