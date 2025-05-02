import { getRepository } from 'typeorm';
import { IngredientController } from '../../controllers/IngredientController';
import { Ingredient } from '../../entities/Ingredient';

jest.mock('typeorm');

describe('IngredientController', () => {
  let ingredientController: IngredientController;
  let mockIngredientRepository: jest.Mocked<any>;

  beforeEach(() => {
    ingredientController = new IngredientController();
    mockIngredientRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };
    (getRepository as jest.Mock).mockReturnValue(mockIngredientRepository);
  });

  describe('getIngredients', () => {
    it('deve retornar lista de ingredientes do usuário', async () => {
      const mockIngredients = [
        {
          id: 1,
          name: 'Arroz',
          quantity: 2,
          unit: 'kg',
          expirationDate: '2024-12-31',
          isExpired: false,
        },
        {
          id: 2,
          name: 'Feijão',
          quantity: 1,
          unit: 'kg',
          expirationDate: '2024-12-31',
          isExpired: false,
        },
      ];

      mockIngredientRepository.find.mockResolvedValue(mockIngredients);

      const req = {
        user: { id: 1 },
      } as any;

      const res = {
        json: jest.fn(),
      } as any;

      await ingredientController.getIngredients(req, res);

      expect(mockIngredientRepository.find).toHaveBeenCalledWith({
        where: { user: { id: 1 } },
        order: { expirationDate: 'ASC' },
      });
      expect(res.json).toHaveBeenCalledWith(mockIngredients);
    });
  });

  describe('addIngredient', () => {
    it('deve adicionar um novo ingrediente', async () => {
      const mockIngredient = {
        id: 1,
        name: 'Arroz',
        quantity: 2,
        unit: 'kg',
        expirationDate: '2024-12-31',
        isExpired: false,
      };

      mockIngredientRepository.create.mockReturnValue(mockIngredient);
      mockIngredientRepository.save.mockResolvedValue(mockIngredient);

      const req = {
        user: { id: 1 },
        body: {
          name: 'Arroz',
          quantity: 2,
          unit: 'kg',
          expirationDate: '2024-12-31',
        },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      await ingredientController.addIngredient(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockIngredient);
    });
  });

  describe('updateIngredient', () => {
    it('deve atualizar um ingrediente existente', async () => {
      const mockIngredient = {
        id: 1,
        name: 'Arroz',
        quantity: 2,
        unit: 'kg',
        expirationDate: '2024-12-31',
        isExpired: false,
      };

      mockIngredientRepository.findOne.mockResolvedValue(mockIngredient);
      mockIngredientRepository.save.mockResolvedValue(mockIngredient);

      const req = {
        user: { id: 1 },
        params: { id: '1' },
        body: {
          quantity: 3,
        },
      } as any;

      const res = {
        json: jest.fn(),
      } as any;

      await ingredientController.updateIngredient(req, res);

      expect(mockIngredientRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, user: { id: 1 } },
      });
      expect(res.json).toHaveBeenCalledWith(mockIngredient);
    });

    it('deve retornar erro se o ingrediente não for encontrado', async () => {
      mockIngredientRepository.findOne.mockResolvedValue(null);

      const req = {
        user: { id: 1 },
        params: { id: '1' },
        body: {
          quantity: 3,
        },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      await ingredientController.updateIngredient(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Ingrediente não encontrado' });
    });
  });

  describe('checkExpiredIngredients', () => {
    it('deve verificar e marcar ingredientes expirados', async () => {
      const mockIngredients = [
        {
          id: 1,
          name: 'Arroz',
          quantity: 2,
          unit: 'kg',
          expirationDate: '2023-12-31',
          isExpired: false,
        },
        {
          id: 2,
          name: 'Feijão',
          quantity: 1,
          unit: 'kg',
          expirationDate: '2024-12-31',
          isExpired: false,
        },
      ];

      mockIngredientRepository.find.mockResolvedValue(mockIngredients);
      mockIngredientRepository.save.mockImplementation((ingredient) => Promise.resolve(ingredient));

      const req = {
        user: { id: 1 },
      } as any;

      const res = {
        json: jest.fn(),
      } as any;

      await ingredientController.checkExpiredIngredients(req, res);

      expect(res.json).toHaveBeenCalledWith([mockIngredients[0]]);
      expect(mockIngredients[0].isExpired).toBe(true);
      expect(mockIngredients[1].isExpired).toBe(false);
    });
  });
}); 