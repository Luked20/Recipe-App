import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
import { authService } from '../services/auth';

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
  error => {
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
    return Promise.reject(error);
  }
);

interface User {
  id: number;
  name: string;
  email: string;
  dietaryPreferences: string;
  budget: number;
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = authService.getToken();
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get('/users/me');
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error: any) {
      if (error.response?.status === 401) {
        authService.removeToken();
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
        setIsAuthenticated(false);
      } else {
        console.error('Erro ao buscar usuário:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('Iniciando processo de login...');
      console.log('Dados do login:', { email, password: '***' });
      console.log('URL base:', api.defaults.baseURL);
      
      const response = await api.post('/auth/login', { email, password });
      console.log('Resposta do servidor:', response.data);
      
      if (!response.data.token || !response.data.user) {
        throw new Error('Resposta do servidor inválida');
      }

      const { token, user } = response.data;
      authService.setToken(token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      setIsAuthenticated(true);
    } catch (error: any) {
      console.error('Erro detalhado no login:', {
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
      
      if (error.response) {
        const errorMessage = error.response.data.details || error.response.data.error || 'Erro ao fazer login';
        throw new Error(errorMessage);
      }
      throw new Error('Erro ao conectar com o servidor. Verifique se o servidor está rodando em http://localhost:3000');
    }
  };

  const logout = () => {
    authService.removeToken();
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { token, user } = response.data;
      authService.setToken(token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      setIsAuthenticated(true);
    } catch (error: any) {
      console.error('Erro ao registrar:', error);
      throw error;
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      console.log('Iniciando atualização do perfil...');
      console.log('Dados recebidos:', data);
      
      // Converter budget para número se for string
      if (data.budget && typeof data.budget === 'string') {
        data.budget = Number(data.budget);
        console.log('Budget convertido para número:', data.budget);
      }

      const token = authService.getToken();
      console.log('Token de autenticação:', token ? 'Presente' : 'Ausente');
      
      const response = await api.put('/auth/profile', data);
      console.log('Resposta da API:', response.data);
      
      setUser(response.data);
    } catch (error: any) {
      console.error('Erro detalhado ao atualizar perfil:', {
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
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 