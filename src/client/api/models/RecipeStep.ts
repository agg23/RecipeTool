export interface RecipeStep {
    id?: number;
    recipeId: number;
    step: number;
    description?: string;
    foodCategoryId?: number;
    type?: string;
    duration?: number;
    quantity?: number;
}

export interface RecipeStepState {
    [id: number]: RecipeStep[];
}