export interface Recipe {
    id?: string;
    name: string;
    imageUrl?: string;
    description?: string;
    servingSize?: number;
}

export interface RecipeState {
    recipes: Recipe[];
}