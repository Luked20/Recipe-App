import axios from 'axios';
import { authService } from './auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true,
  timeout: 10000 // 10 segundos
});

const spoonacularApi = axios.create({
  baseURL: 'https://api.spoonacular.com/recipes',
  params: {
    apiKey: import.meta.env.VITE_SPOONACULAR_API_KEY
  },
  timeout: 10000
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para logar todas as requisições
api.interceptors.request.use(request => {
  console.log('Iniciando requisição:', {
    url: request.url,
    method: request.method,
    data: request.data,
    baseURL: request.baseURL,
    headers: request.headers
  });
  return request;
});

// Interceptor para logar todas as respostas
api.interceptors.response.use(
  response => {
    console.log('Resposta recebida:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  async (error) => {
    console.error('Erro detalhado na requisição:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: {
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        method: error.config?.method,
        data: error.config?.data,
        headers: error.config?.headers
      }
    });
    if (error.response?.status === 401) {
      const token = authService.getToken();
      if (token) {
        // Tenta renovar a requisição com o token atual
        error.config.headers.Authorization = `Bearer ${token}`;
        return api(error.config);
      }
    }
    return Promise.reject(error);
  }
);

export { spoonacularApi };
export default api; 