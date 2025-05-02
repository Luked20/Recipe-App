import { getRepository } from 'typeorm';
import { AuthController } from '../../controllers/AuthController';
import { User } from '../../entities/User';

jest.mock('typeorm');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('AuthController', () => {
  let authController: AuthController;
  let mockUserRepository: jest.Mocked<any>;

  beforeEach(() => {
    authController = new AuthController();
    mockUserRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };
    (getRepository as jest.Mock).mockReturnValue(mockUserRepository);
  });

  describe('register', () => {
    it('deve registrar um novo usuário com sucesso', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
      };

      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      const req = {
        body: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
        },
        token: expect.any(String),
      });
    });

    it('deve retornar erro se o email já estiver cadastrado', async () => {
      const existingUser = {
        id: 1,
        name: 'Existing User',
        email: 'test@example.com',
      };

      mockUserRepository.findOne.mockResolvedValue(existingUser);

      const req = {
        body: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Email já cadastrado' });
    });
  });

  describe('login', () => {
    it('deve fazer login com sucesso', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      (require('bcryptjs').compare as jest.Mock).mockResolvedValue(true);

      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      } as any;

      const res = {
        json: jest.fn(),
      } as any;

      await authController.login(req, res);

      expect(res.json).toHaveBeenCalledWith({
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
        },
        token: expect.any(String),
      });
    });

    it('deve retornar erro se as credenciais forem inválidas', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Credenciais inválidas' });
    });
  });
}); 