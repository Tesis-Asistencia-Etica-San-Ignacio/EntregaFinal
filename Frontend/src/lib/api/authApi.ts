import axios from 'axios';

export const authApi = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    // Para enviar y recibir cookies httpOnly
    withCredentials: true,
});

authApi.interceptors.request.use(
    config => config,
    error => Promise.reject(error)
);

authApi.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;

        // Verificamos si es 401 y no estamos en /auth/refresh, y si no hemos reintentado ya (_retry).
        if (
            error.response &&
            error.response.status === 401 &&
            originalRequest.url !== '/auth/refresh' &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;
            try {
                // Intenta refrescar el token:
                await authApi.post('/auth/refresh');

                // Reintenta la petición original con el token ya refrescado
                return authApi(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }

        // Muestra en consola solo los errores que no sean 401 (para no spamear en el flujo esperado de "no logueado")
        if (error.response && error.response.status !== 401) {
            console.error('API Error:', error);
        }

        return Promise.reject(error);
    }
);
