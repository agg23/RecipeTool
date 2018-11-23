import { RecipeStep } from "./RecipeStep";

export interface Recipe {
    id?: string;
    name: string;
    imageUrl?: string;
    description?: string;
    servingSize?: number;
    steps?: RecipeStep[];
}