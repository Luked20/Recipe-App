import request from 'supertest';
import express from 'express';
import routes from '../../routes';
import { authMiddleware } from '../../middlewares/auth';

jest.mock('../../middlewares/auth', () => ({
  authMiddleware: jest.fn((req, res, next) => next()),
}));

describe('Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api', routes);
  });

  describe('Rotas Públicas', () => {
    it('deve permitir registro de usuário', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
    });

    it('deve permitir login de usuário', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
    });
  });

  describe('Rotas Protegidas', () => {
    it('deve atualizar perfil do usuário', async () => {
      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', 'Bearer valid_token')
        .send({
          name: 'Updated Name',
          dietaryPreferences: 'vegetarian',
          budget: 100,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'Updated Name');
    });

    it('deve listar ingredientes do usuário', async () => {
      const response = await request(app)
        .get('/api/ingredients')
        .set('Authorization', 'Bearer valid_token');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('deve adicionar novo ingrediente', async () => {
      const response = await request(app)
        .post('/api/ingredients')
        .set('Authorization', 'Bearer valid_token')
        .send({
          name: 'Arroz',
          quantity: 2,
          unit: 'kg',
          expirationDate: '2024-12-31',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('name', 'Arroz');
    });

    it('deve sugerir receitas', async () => {
      const response = await request(app)
        .post('/api/recipes/suggest')
        .set('Authorization', 'Bearer valid_token')
        .send({
          ingredients: ['arroz', 'feijão'],
        });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('deve salvar uma receita', async () => {
      const response = await request(app)
        .post('/api/recipes')
        .set('Authorization', 'Bearer valid_token')
        .send({
          title: 'Arroz com Feijão',
          instructions: 'Instruções detalhadas',
          preparationTime: 30,
          servings: 4,
          estimatedCost: 20.00,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('title', 'Arroz com Feijão');
    });

    it('deve listar receitas salvas', async () => {
      const response = await request(app)
        .get('/api/recipes')
        .set('Authorization', 'Bearer valid_token');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
}); 