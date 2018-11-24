import gql from "graphql-tag";

import { Recipe } from "../models/Recipe";

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

export interface GetRecipesResponse {
    recipes?: Recipe[];
}

export interface GetRecipeWithStepsResponse {
    recipe: Recipe;
}