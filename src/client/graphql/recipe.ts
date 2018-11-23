import gql from "graphql-tag";

import { Recipe } from "../models/Recipe";

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

export interface GetRecipeResponse {
    recipes?: Recipe[];
}