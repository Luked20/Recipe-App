import { getRepository } from 'typeorm';
import { User } from '../entities/User';

export class MLService {
  private static instance: MLService;

  private constructor() {}

  public static getInstance(): MLService {
    if (!MLService.instance) {
      MLService.instance = new MLService();
    }
    return MLService.instance;
  }

  async predictUserPreferences(userId: number) {
    try {
      const userRepository = getRepository(User);

      const user = await userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Aqui implementaríamos a lógica de ML real
      // Por enquanto, vamos retornar uma previsão simples baseada nas preferências do usuário
      const preferences = {
        dietaryPreferences: user.dietaryPreferences || 'balanced',
        budget: user.budget || 50,
        favoriteCuisines: ['brazilian', 'italian', 'mediterranean'],
        dislikedIngredients: ['anchovies', 'olives', 'mushrooms']
      };

      return preferences;
    } catch (error) {
      console.error('Erro ao prever preferências do usuário:', error);
      throw error;
    }
  }

  async optimizeRecipeSuggestions(userId: number, recipes: any[]) {
    try {
      const preferences = await this.predictUserPreferences(userId);

      // Filtra receitas baseado nas preferências do usuário
      const optimizedRecipes = recipes.filter(recipe => {
        // Verifica se a receita está dentro do orçamento
        if (recipe.pricePerServing > preferences.budget) {
          return false;
        }

        // Verifica se contém ingredientes que o usuário não gosta
        const hasDislikedIngredients = recipe.missedIngredients.some((ingredient: any) => 
          preferences.dislikedIngredients.includes(ingredient.name.toLowerCase())
        );

        return !hasDislikedIngredients;
      });

      // Ordena por melhor combinação com as preferências do usuário
      optimizedRecipes.sort((a, b) => {
        const aScore = this.calculateRecipeScore(a, preferences);
        const bScore = this.calculateRecipeScore(b, preferences);
        return bScore - aScore;
      });

      return optimizedRecipes;
    } catch (error) {
      console.error('Erro ao otimizar sugestões de receitas:', error);
      throw error;
    }
  }

  private calculateRecipeScore(recipe: any, preferences: any): number {
    let score = 0;

    // Pontuação baseada no orçamento
    const budgetScore = Math.max(0, 1 - (recipe.pricePerServing / preferences.budget));
    score += budgetScore * 0.4;

    // Pontuação baseada em ingredientes disponíveis
    const availableIngredientsScore = recipe.usedIngredientCount / (recipe.usedIngredientCount + recipe.missedIngredientCount);
    score += availableIngredientsScore * 0.6;

    return score;
  }
} 