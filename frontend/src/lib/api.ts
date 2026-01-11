// src/lib/api.ts
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
   baseURL: API_BASE_URL,
   // headers: {
   //    'Content-Type': 'application/json',
   // },
   timeout: 10000, // 10 seconds timeout
});

// Request interceptor
api.interceptors.request.use(
   (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
         config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
   },
   (error) => {
      return Promise.reject(error);
   }
);

// Response interceptor
api.interceptors.response.use(
   (response: AxiosResponse) => response,
   (error: AxiosError) => {
      if (error.code === 'ECONNABORTED') {
         console.error('Request timeout');
      }

      if (!error.response) {
         console.error('Network error - please check your connection');
      }

      const status = error.response?.status;

      if (status === 401) {
         // Unauthorized - clear token and redirect to login
         localStorage.removeItem('token');
         localStorage.removeItem('user');
         window.location.href = '/login';
      }

      if (status === 403) {
         const message = (error.response?.data as any)?.message || 'Access forbidden';
         if (message.includes('locked') || message.includes('deactivated')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login?message=' + encodeURIComponent(message);
         }
      }

      return Promise.reject(error);
   }
);

export default api;