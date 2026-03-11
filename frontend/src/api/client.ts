import axios from "axios";
import { getCookie } from "../utils/cookies";
import type { TitlesResponse } from "../types/TitlesResponse";
import type { CatalogResponse } from "../types/CatalogResponse";
import type { Status } from "../types/Status";
import { CONFIG } from "../constants";

const api = axios.create({
    baseURL: CONFIG.API_URL,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const csrftoken = getCookie("csrftoken");
    if (csrftoken) {
        config.headers = config.headers || {};
        config.headers["X-CSRFToken"] = csrftoken;
    }
    return config;
});

export default api;


// Funciones de fetch “puras”
export async function fetchTitlesApi(params: {
    page: number;
    order: string;
    search: string;
    filterCategories: string;
    filterStatus: string;
    filterType: string;
    }) {
    const { page, order, search, filterCategories, filterStatus, filterType } = params;
    const { data } = await api.get<TitlesResponse>(
        `/titles?page=${page}&type=${filterType}&ordering=${order}&search=${search}${filterCategories}${filterStatus}`
    );
    return data;
}

export async function fetchCategoriesApi() {
    const { data } = await api.get<CatalogResponse>(
        "/categories"
    );
    return data;
}

export async function fetchStatusApi() {
    const { data } = await api.get<Status[]>(
        "/tracking-status"
    );
    return data;
}

export async function fetchActorsApi(params: {
    page: number;
    order: string;
    search: string;
    }) {
        const { page, order, search } = params;
        const { data } = await api.get<CatalogResponse>(
            `/actors?page=${page}&ordering=${order}&search=${search}`
    );
    return data;
}

// Manejador de errores de Axios
export function handleAxiosError(
    err: unknown,
    setError: (msg: string) => void,
    defaultMessage = "Se ha producido un error"
) {
    if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? defaultMessage);
    } else {
        setError(err instanceof Error ? err.message : defaultMessage);
    }
}