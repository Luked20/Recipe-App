import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { authMiddleware } from '../../middlewares/auth';
import { User } from '../../entities/User';

jest.mock('jsonwebtoken');
jest.mock('typeorm');

describe('AuthMiddleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;
  let mockUserRepository: jest.Mocked<any>;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
    mockUserRepository = {
      findOne: jest.fn(),
    };
    (getRepository as jest.Mock).mockReturnValue(mockUserRepository);
  });

  it('deve retornar erro 401 se o token não for fornecido', async () => {
    await authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Token não fornecido' });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('deve retornar erro 401 se o token for inválido', async () => {
    mockRequest.headers = {
      authorization: 'Bearer token_invalido',
    };

    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Token inválido');
    });

    await authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Token inválido' });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('deve retornar erro 401 se o usuário não for encontrado', async () => {
    mockRequest.headers = {
      authorization: 'Bearer token_valido',
    };

    (jwt.verify as jest.Mock).mockReturnValue({ id: 1, email: 'test@example.com' });
    mockUserRepository.findOne.mockResolvedValue(null);

    await authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Usuário não encontrado' });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('deve chamar next() se o token for válido e o usuário existir', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
    };

    mockRequest.headers = {
      authorization: 'Bearer token_valido',
    };

    (jwt.verify as jest.Mock).mockReturnValue({ id: 1, email: 'test@example.com' });
    mockUserRepository.findOne.mockResolvedValue(mockUser);

    await authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.user).toEqual(mockUser);
  });
}); 