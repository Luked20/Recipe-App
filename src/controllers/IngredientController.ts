import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Ingredient } from '../entities/Ingredient';

export class IngredientController {
  async getIngredients(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }
      const userId = req.user.id;

      const ingredientRepository = getRepository(Ingredient);
      const ingredients = await ingredientRepository.find({
        where: { user: { id: userId } },
        order: { expirationDate: 'ASC' }
      });

      return res.json(ingredients);
    } catch (error) {
      console.error('Erro ao buscar ingredientes:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async addIngredient(req: Request, res: Response) {
    try {
      console.log('Iniciando adição de ingrediente...');
      console.log('Dados recebidos:', req.body);
      
      if (!req.user) {
        console.log('Usuário não autenticado');
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }
      
      const userId = req.user.id;
      const ingredientData = req.body;
      
      console.log('ID do usuário:', userId);
      console.log('Dados do ingrediente:', ingredientData);

      const ingredientRepository = getRepository(Ingredient);
      const ingredient = ingredientRepository.create({
        ...ingredientData,
        user: { id: userId }
      });

      console.log('Ingrediente criado:', ingredient);
      
      await ingredientRepository.save(ingredient);
      console.log('Ingrediente salvo com sucesso');

      return res.status(201).json(ingredient);
    } catch (error) {
      console.error('Erro detalhado ao adicionar ingrediente:', error);
      return res.status(500).json({ 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  async updateIngredient(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }
      const userId = req.user.id;
      const { id } = req.params;
      const ingredientData = req.body;

      const ingredientRepository = getRepository(Ingredient);
      const ingredient = await ingredientRepository.findOne({
        where: { id: Number(id), user: { id: userId } }
      });

      if (!ingredient) {
        return res.status(404).json({ error: 'Ingrediente não encontrado' });
      }

      Object.assign(ingredient, ingredientData);
      await ingredientRepository.save(ingredient);

      return res.json(ingredient);
    } catch (error) {
      console.error('Erro ao atualizar ingrediente:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async deleteIngredient(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }
      const userId = req.user.id;
      const { id } = req.params;

      const ingredientRepository = getRepository(Ingredient);
      const ingredient = await ingredientRepository.findOne({
        where: { id: Number(id), user: { id: userId } }
      });

      if (!ingredient) {
        return res.status(404).json({ error: 'Ingrediente não encontrado' });
      }

      await ingredientRepository.remove(ingredient);

      return res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar ingrediente:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async checkExpiredIngredients(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }
      const userId = req.user.id;

      const ingredientRepository = getRepository(Ingredient);
      const ingredients = await ingredientRepository.find({
        where: { user: { id: userId } }
      });

      const today = new Date();
      const expiredIngredients = ingredients.filter(ingredient => {
        const expirationDate = new Date(ingredient.expirationDate);
        return expirationDate < today;
      });

      // Atualiza o status dos ingredientes expirados
      await Promise.all(
        expiredIngredients.map(async ingredient => {
          ingredient.isExpired = true;
          await ingredientRepository.save(ingredient);
        })
      );

      return res.json(expiredIngredients);
    } catch (error) {
      console.error('Erro ao verificar ingredientes expirados:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
} 