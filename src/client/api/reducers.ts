import { combineReducers } from "redux";
import { reducers as recipeReducers } from "./RecipeAPI";
import { reducers as recipeStepReducers } from "./RecipeStepAPI";

export const reducers = combineReducers({
    recipe: recipeReducers,
    recipeSteps: recipeStepReducers,
});