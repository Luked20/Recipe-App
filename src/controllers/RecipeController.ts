import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Recipe } from '../entities/Recipe';
import { SpoonacularService } from '../services/SpoonacularService';
import { MLService } from '../services/MLService';

export class RecipeController {
  private spoonacularService: SpoonacularService;
  private mlService: MLService;

  constructor() {
    this.spoonacularService = SpoonacularService.getInstance();
    this.mlService = MLService.getInstance();
  }

  async suggestRecipes(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }
      const userId = req.user.id;
      const ingredients = req.body.ingredients as string[];

      if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
        return res.status(400).json({ error: 'Lista de ingredientes inválida' });
      }

      // Busca receitas na API Spoonacular
      const recipes = await this.spoonacularService.searchRecipesByIngredients(ingredients);

      // Otimiza as sugestões usando ML
      const optimizedRecipes = await this.mlService.optimizeRecipeSuggestions(userId, recipes);

      // Enriquece as receitas com informações adicionais
      const enrichedRecipes = await Promise.all(
        optimizedRecipes.map(async (recipe) => {
          const recipeInfo = await this.spoonacularService.getRecipeInformation(recipe.id);
          const instructions = await this.spoonacularService.getRecipeInstructions(recipe.id);

          return {
            ...recipe,
            ...recipeInfo,
            instructions
          };
        })
      );

      return res.json(enrichedRecipes);
    } catch (error) {
      console.error('Erro ao sugerir receitas:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async saveRecipe(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }
      const userId = req.user.id;
      const recipeData = req.body;

      const recipeRepository = getRepository(Recipe);
      const recipe = recipeRepository.create({
        ...recipeData,
        user: { id: userId }
      });

      await recipeRepository.save(recipe);

      return res.status(201).json(recipe);
    } catch (error) {
      console.error('Erro ao salvar receita:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getSavedRecipes(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }
      const userId = req.user.id;

      const recipeRepository = getRepository(Recipe);
      const recipes = await recipeRepository.find({
        where: { user: { id: userId } },
        relations: ['ingredients']
      });

      return res.json(recipes);
    } catch (error) {
      console.error('Erro ao buscar receitas salvas:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
} 