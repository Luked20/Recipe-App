import dotenv from 'dotenv';

// Carrega as variáveis de ambiente
dotenv.config();

// Configurações globais para os testes
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.SPOONACULAR_API_KEY = 'test-api-key';

// Configurações do banco de dados para testes
process.env.DB_TYPE = 'sqlite';
process.env.DB_DATABASE = ':memory:';

// Configurações do Jest
jest.setTimeout(30000);

// Limpa o cache dos módulos após cada teste
afterEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
}); 