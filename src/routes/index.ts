import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { RecipeController } from '../controllers/RecipeController';
import { IngredientController } from '../controllers/IngredientController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

const authController = new AuthController();
const recipeController = new RecipeController();
const ingredientController = new IngredientController();

// Rota raiz
router.get('/', (_req, res) => {
  res.json({ message: 'API do Meal Planner está funcionando!' });
});

// Rotas públicas
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// Middleware de autenticação
router.use(authMiddleware);

// Rotas protegidas
router.put('/auth/profile', authController.updateProfile);

// Rotas de ingredientes
router.get('/ingredients', ingredientController.getIngredients);
router.post('/ingredients', ingredientController.addIngredient);
router.put('/ingredients/:id', ingredientController.updateIngredient);
router.delete('/ingredients/:id', ingredientController.deleteIngredient);
router.get('/ingredients/check-expired', ingredientController.checkExpiredIngredients);

// Rotas de receitas
router.post('/recipes/suggest', recipeController.suggestRecipes);
router.post('/recipes', recipeController.saveRecipe);
router.get('/recipes', recipeController.getSavedRecipes);

export default router; 