import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Recipe } from './Recipe';
import { Ingredient } from './Ingredient';

@Entity('recipe_ingredients')
export class RecipeIngredient {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Recipe, recipe => recipe.ingredients)
  recipe: Recipe;

  @ManyToOne(() => Ingredient)
  ingredient: Ingredient;

  @Column()
  quantity: number;

  @Column()
  unit: string;
} 