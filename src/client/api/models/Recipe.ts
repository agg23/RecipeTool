export interface Recipe {
    id: number;
    name: string;
    imageUrl?: string;
    description?: string;
    servingSize?: number;
}

export interface RecipeState {
    recipes: Recipe[];
}