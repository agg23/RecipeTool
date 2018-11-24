import { keys } from "ts-transformer-keys";

import { Recipe } from "./Recipe";
import { IModelKeys } from "../graphql/request";

export interface RecipeStep {
    id?: string;
    recipe?: Recipe;
    title?: string;
    description?: string;
    // foodCategoryId?: number;
    type?: string;
    duration?: number;
    quantity?: number;
}

export const keysOfRecipeStep: IModelKeys = {
    keys: keys<RecipeStep>(),
    excludedKeys: new Set(["recipe"]),
    // Recipe is not a child, so not included
}