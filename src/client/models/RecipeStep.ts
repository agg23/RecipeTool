import { Recipe } from "./Recipe";

export interface RecipeStep {
    id?: string;
    recipe?: Recipe;
    index: number;
    description?: string;
    foodCategoryId?: number;
    type?: string;
    duration?: number;
    quantity?: number;
}
