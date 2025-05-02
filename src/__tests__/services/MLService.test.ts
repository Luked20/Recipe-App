import { getRepository } from 'typeorm';
import { MLService } from '../../services/MLService';
import { User } from '../../entities/User';
import { Recipe } from '../../entities/Recipe';

jest.mock('typeorm');

describe('MLService', () => {
  let mlService: MLService;
  let mockUserRepository: jest.Mocked<any>;
  let mockRecipeRepository: jest.Mocked<any>;

  beforeEach(() => {
    mlService = MLService.getInstance();
    mockUserRepository = {
      findOne: jest.fn(),
    };
    mockRecipeRepository = {
      find: jest.fn(),
    };
    (getRepository as jest.Mock).mockImplementation((entity) => {
      if (entity === User) return mockUserRepository;
      if (entity === Recipe) return mockRecipeRepository;
      return null;
    });
  });

  describe('predictUserPreferences', () => {
    it('deve prever preferências do usuário com sucesso', async () => {
      const mockUser = {
        id: 1,
        dietaryPreferences: 'vegetarian',
        budget: 100,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await mlService.predictUserPreferences(1);

      expect(result).toEqual({
        dietaryPreferences: 'vegetarian',
        budget: 100,
        favoriteCuisines: ['brazilian', 'italian', 'mediterranean'],
        dislikedIngredients: ['anchovies', 'olives', 'mushrooms'],
      });
    });

    it('deve retornar valores padrão se o usuário não tiver preferências definidas', async () => {
      const mockUser = {
        id: 1,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await mlService.predictUserPreferences(1);

      expect(result).toEqual({
        dietaryPreferences: 'balanced',
        budget: 50,
        favoriteCuisines: ['brazilian', 'italian', 'mediterranean'],
        dislikedIngredients: ['anchovies', 'olives', 'mushrooms'],
      });
    });

    it('deve lançar erro se o usuário não for encontrado', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(mlService.predictUserPreferences(1)).rejects.toThrow(
        'Usuário não encontrado'
      );
    });
  });

  describe('optimizeRecipeSuggestions', () => {
    it('deve otimizar sugestões de receitas com base nas preferências do usuário', async () => {
      const mockRecipes = [
        {
          id: 1,
          title: 'Receita 1',
          pricePerServing: 30,
          missedIngredients: [{ name: 'ingrediente1' }],
          usedIngredientCount: 3,
          missedIngredientCount: 1,
        },
        {
          id: 2,
          title: 'Receita 2',
          pricePerServing: 60,
          missedIngredients: [{ name: 'olives' }],
          usedIngredientCount: 2,
          missedIngredientCount: 2,
        },
      ];

      const mockUser = {
        id: 1,
        dietaryPreferences: 'vegetarian',
        budget: 50,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await mlService.optimizeRecipeSuggestions(1, mockRecipes);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });
  });
}); 