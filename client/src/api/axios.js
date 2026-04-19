import axios from 'axios';

// ✅ Uses env variable so local dev uses proxy and prod uses real URL
// In dev: VITE_API_BASE_URL is empty → falls back to '/api' (handled by Vite proxy)
// In prod: VITE_API_BASE_URL = https://your-render-app.onrender.com/api
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('campus_user');
  if (stored) {
    try {
      const user = JSON.parse(stored);
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    } catch {
      localStorage.removeItem('campus_user');
    }
  }
  return config;
});

export default api;
