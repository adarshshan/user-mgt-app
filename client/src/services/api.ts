import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // This is important for sending cookies (session ID)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach CSRF token
api.interceptors.request.use(
  async (config) => {
    // For GET requests or requests that don't modify data, we might not need CSRF
    if (config.method !== 'get' && config.method !== 'head') {
      let csrfToken = localStorage.getItem('csrfToken');

      if (!csrfToken) {
        try {
          // Fetch CSRF token from backend
          const { data } = await axios.get(`${API_BASE_URL}/csrf-token`, { withCredentials: true });
          csrfToken = data.csrfToken;
          localStorage.setItem('csrfToken', csrfToken);
        } catch (error) {
          console.error('Failed to get CSRF token:', error);
          // Handle error: e.g., redirect to login or show an error message
          return Promise.reject(new Error('Failed to get CSRF token.'));
        }
      }
      
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);



export default api;
