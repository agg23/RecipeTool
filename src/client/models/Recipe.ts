import { keys } from "ts-transformer-keys";

import { RecipeStep, keysOfRecipeStep } from "./RecipeStep";
import { IModelKeys } from "../graphql/request";

export interface Recipe {
    id?: string;
    name: string;
    imageUrl?: string;
    description?: string;
    servingCount?: number;
    steps?: RecipeStep[];
}

export const keysOfRecipe: IModelKeys = {
    keys: keys<Recipe>(),
    compositeChildrenKeys: {
        steps: keysOfRecipeStep,
    }
}