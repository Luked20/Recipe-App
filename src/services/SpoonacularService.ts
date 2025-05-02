import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com/recipes';

export class SpoonacularService {
  private static instance: SpoonacularService;

  private constructor() {}

  public static getInstance(): SpoonacularService {
    if (!SpoonacularService.instance) {
      SpoonacularService.instance = new SpoonacularService();
    }
    return SpoonacularService.instance;
  }

  async searchRecipesByIngredients(ingredients: string[], number: number = 5) {
    try {
      const response = await axios.get(`${SPOONACULAR_BASE_URL}/findByIngredients`, {
        params: {
          apiKey: SPOONACULAR_API_KEY,
          ingredients: ingredients.join(','),
          number,
          ranking: 1,
          ignorePantry: true
        }
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao buscar receitas:', error);
      throw error;
    }
  }

  async getRecipeInformation(id: number) {
    try {
      const response = await axios.get(`${SPOONACULAR_BASE_URL}/${id}/information`, {
        params: {
          apiKey: SPOONACULAR_API_KEY,
          includeNutrition: false
        }
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao buscar informações da receita:', error);
      throw error;
    }
  }

  async getRecipeInstructions(id: number) {
    try {
      const response = await axios.get(`${SPOONACULAR_BASE_URL}/${id}/analyzedInstructions`, {
        params: {
          apiKey: SPOONACULAR_API_KEY,
          stepBreakdown: true
        }
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao buscar instruções da receita:', error);
      throw error;
    }
  }
} 