import dotenv from 'dotenv';

jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

describe('Jest Config', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET = 'test-secret';
    process.env.SPOONACULAR_API_KEY = 'test-api-key';
    process.env.DB_TYPE = 'sqlite';
    process.env.DB_DATABASE = ':memory:';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve configurar as variáveis de ambiente corretamente', () => {
    expect(process.env.NODE_ENV).toBe('test');
    expect(process.env.JWT_SECRET).toBe('test-secret');
    expect(process.env.SPOONACULAR_API_KEY).toBe('test-api-key');
    expect(process.env.DB_TYPE).toBe('sqlite');
    expect(process.env.DB_DATABASE).toBe(':memory:');
    expect(dotenv.config).toHaveBeenCalled();
  });

  it('deve configurar o timeout do Jest', () => {
    expect(jest.getTimeout()).toBe(30000);
  });
}); 