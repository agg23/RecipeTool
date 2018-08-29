export interface RecipeStep {
    id: number;
    recipeId: number;
    step: number;
    description?: string;
    foodCategoryId?: number;
    type?: string;
    duration?: number;
}