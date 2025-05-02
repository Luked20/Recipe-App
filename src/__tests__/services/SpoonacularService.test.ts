import axios from 'axios';
import { SpoonacularService } from '../../services/SpoonacularService';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('SpoonacularService', () => {
  let spoonacularService: SpoonacularService;

  beforeEach(() => {
    process.env.SPOONACULAR_API_KEY = 'test-api-key';
    spoonacularService = SpoonacularService.getInstance();
  });

  describe('searchRecipesByIngredients', () => {
    it('deve buscar receitas por ingredientes com sucesso', async () => {
      const mockResponse = {
        data: [
          {
            id: 1,
            title: 'Arroz com Feijão',
            usedIngredientCount: 2,
            missedIngredientCount: 0,
          },
        ],
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const ingredients = ['arroz', 'feijão'];
      const result = await spoonacularService.searchRecipesByIngredients(ingredients);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.spoonacular.com/recipes/findByIngredients',
        {
          params: {
            apiKey: 'test-api-key',
            ingredients: 'arroz,feijão',
            number: 5,
            ranking: 1,
            ignorePantry: true,
          },
        }
      );

      expect(result).toEqual(mockResponse.data);
    });

    it('deve lidar com erro na busca de receitas', async () => {
      const error = new Error('Erro na API');
      mockedAxios.get.mockRejectedValue(error);

      const ingredients = ['arroz', 'feijão'];

      await expect(spoonacularService.searchRecipesByIngredients(ingredients)).rejects.toThrow(
        'Erro ao buscar receitas:'
      );
    });
  });

  describe('getRecipeInformation', () => {
    it('deve buscar informações da receita com sucesso', async () => {
      const mockResponse = {
        data: {
          id: 1,
          title: 'Arroz com Feijão',
          instructions: 'Instruções detalhadas',
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await spoonacularService.getRecipeInformation(1);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.spoonacular.com/recipes/1/information',
        {
          params: {
            apiKey: 'test-api-key',
            includeNutrition: false,
          },
        }
      );

      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getRecipeInstructions', () => {
    it('deve buscar instruções da receita com sucesso', async () => {
      const mockResponse = {
        data: [
          {
            steps: [
              { number: 1, step: 'Lave o arroz' },
              { number: 2, step: 'Cozinhe o feijão' },
            ],
          },
        ],
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await spoonacularService.getRecipeInstructions(1);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.spoonacular.com/recipes/1/analyzedInstructions',
        {
          params: {
            apiKey: 'test-api-key',
            stepBreakdown: true,
          },
        }
      );

      expect(result).toEqual(mockResponse.data);
    });
  });
}); 