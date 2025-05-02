import { getRepository } from 'typeorm';
import { RecipeController } from '../../controllers/RecipeController';
import { Recipe } from '../../entities/Recipe';
import { SpoonacularService } from '../../services/SpoonacularService';
import { MLService } from '../../services/MLService';

jest.mock('typeorm');
jest.mock('../../services/SpoonacularService');
jest.mock('../../services/MLService');

describe('RecipeController', () => {
  let recipeController: RecipeController;
  let mockRecipeRepository: jest.Mocked<any>;
  let mockSpoonacularService: jest.Mocked<SpoonacularService>;
  let mockMLService: jest.Mocked<MLService>;

  beforeEach(() => {
    recipeController = new RecipeController();
    mockRecipeRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };
    (getRepository as jest.Mock).mockReturnValue(mockRecipeRepository);

    mockSpoonacularService = {
      searchRecipesByIngredients: jest.fn(),
      getRecipeInformation: jest.fn(),
      getRecipeInstructions: jest.fn(),
    } as any;

    mockMLService = {
      optimizeRecipeSuggestions: jest.fn(),
      predictUserPreferences: jest.fn(),
    } as any;

    (SpoonacularService.getInstance as jest.Mock).mockReturnValue(mockSpoonacularService);
    (MLService.getInstance as jest.Mock).mockReturnValue(mockMLService);
  });

  describe('suggestRecipes', () => {
    it('deve sugerir receitas baseadas nos ingredientes', async () => {
      const mockRecipes = [
        {
          id: 1,
          title: 'Arroz com Feijão',
          usedIngredientCount: 2,
          missedIngredientCount: 0,
        },
      ];

      const mockRecipeInfo = {
        id: 1,
        title: 'Arroz com Feijão',
        instructions: 'Instruções detalhadas',
      };

      const mockInstructions = [
        {
          steps: [
            { number: 1, step: 'Lave o arroz' },
            { number: 2, step: 'Cozinhe o feijão' },
          ],
        },
      ];

      mockSpoonacularService.searchRecipesByIngredients.mockResolvedValue(mockRecipes);
      mockMLService.optimizeRecipeSuggestions.mockResolvedValue(mockRecipes);
      mockSpoonacularService.getRecipeInformation.mockResolvedValue(mockRecipeInfo);
      mockSpoonacularService.getRecipeInstructions.mockResolvedValue(mockInstructions);

      const req = {
        user: { id: 1 },
        body: {
          ingredients: ['arroz', 'feijão'],
        },
      } as any;

      const res = {
        json: jest.fn(),
      } as any;

      await recipeController.suggestRecipes(req, res);

      expect(res.json).toHaveBeenCalledWith([
        {
          ...mockRecipes[0],
          ...mockRecipeInfo,
          instructions: mockInstructions,
        },
      ]);
    });

    it('deve retornar erro se a lista de ingredientes for inválida', async () => {
      const req = {
        user: { id: 1 },
        body: {
          ingredients: [],
        },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      await recipeController.suggestRecipes(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Lista de ingredientes inválida' });
    });
  });

  describe('saveRecipe', () => {
    it('deve salvar uma nova receita', async () => {
      const mockRecipe = {
        id: 1,
        title: 'Arroz com Feijão',
        instructions: 'Instruções detalhadas',
        preparationTime: 30,
        servings: 4,
        estimatedCost: 20.00,
      };

      mockRecipeRepository.create.mockReturnValue(mockRecipe);
      mockRecipeRepository.save.mockResolvedValue(mockRecipe);

      const req = {
        user: { id: 1 },
        body: mockRecipe,
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      await recipeController.saveRecipe(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockRecipe);
    });
  });

  describe('getSavedRecipes', () => {
    it('deve retornar as receitas salvas do usuário', async () => {
      const mockRecipes = [
        {
          id: 1,
          title: 'Arroz com Feijão',
          instructions: 'Instruções detalhadas',
          preparationTime: 30,
          servings: 4,
          estimatedCost: 20.00,
        },
      ];

      mockRecipeRepository.find.mockResolvedValue(mockRecipes);

      const req = {
        user: { id: 1 },
      } as any;

      const res = {
        json: jest.fn(),
      } as any;

      await recipeController.getSavedRecipes(req, res);

      expect(mockRecipeRepository.find).toHaveBeenCalledWith({
        where: { user: { id: 1 } },
        relations: ['ingredients'],
      });
      expect(res.json).toHaveBeenCalledWith(mockRecipes);
    });
  });
}); 