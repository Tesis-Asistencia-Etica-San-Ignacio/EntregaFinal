import axios from 'axios';

export const userApi = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

export const noCredsInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: false,
});

userApi.interceptors.response.use(
  r => r,
  e => {
    console.error('API Error:', e);
    return Promise.reject(e);
  },
);
