import axios from 'axios';

/**
 * Axios instance with base URL and interceptors.
 * In dev, requests are proxied by Vite to localhost:3001.
 */
const api = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('membrain_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 redirects
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('membrain_token');
      // TODO: Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default api;
