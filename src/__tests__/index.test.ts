import request from 'supertest';
import { createConnection } from 'typeorm';
import app from '../index';

jest.mock('typeorm', () => ({
  createConnection: jest.fn().mockResolvedValue({
    close: jest.fn(),
  }),
}));

describe('Aplicação', () => {
  it('deve iniciar o servidor com sucesso', async () => {
    const response = await request(app).get('/api');

    expect(response.status).toBe(404);
    expect(createConnection).toHaveBeenCalled();
  });

  it('deve lidar com erro ao iniciar o servidor', async () => {
    (createConnection as jest.Mock).mockRejectedValueOnce(new Error('Erro de conexão'));

    const response = await request(app).get('/api');

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'Erro interno do servidor');
  });
}); 