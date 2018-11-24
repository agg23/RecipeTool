import gql from "graphql-tag";

import { Recipe } from "../models/Recipe";
import { RecipeStep } from "../models/RecipeStep";

/* GET */

export const getRecipes = gql`
    {
        recipes {
            id
            name
            imageUrl
            description
            servingCount
        }
    }
`;

export const getRecipeWithSteps = gql`
    query getRecipeWithSteps($id: ID!) {
        recipe(
            where: {
                id: $id
            }
        ) {
            id
            name
            imageUrl
            description
            servingCount
            steps {
                id
                title
                description
                type
                duration
                quantity
            }
        }
    }
`;

export interface RecipesResponse {
    [name: string]: Recipe[];
}

export interface RecipeResponse {
    [name: string]: Recipe;
}

export interface RecipeStepResponse {
    [name: string]: RecipeStep;
}