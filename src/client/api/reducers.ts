import { combineReducers } from "redux";
import { reducers as recipeReducers } from "./RecipeAPI";

export const reducers = combineReducers({
    recipe: recipeReducers,
});