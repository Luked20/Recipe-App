import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './User';
import { RecipeIngredient } from './RecipeIngredient';

@Entity('recipes')
export class Recipe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  instructions: string;

  @Column()
  preparationTime: number;

  @Column()
  servings: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  estimatedCost: number;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  sourceUrl: string;

  @Column({ nullable: true })
  spoonacularId: number;

  @ManyToOne(() => User, user => user.recipes)
  user: User;

  @OneToMany(() => RecipeIngredient, recipeIngredient => recipeIngredient.recipe)
  ingredients: RecipeIngredient[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 