import { RecipeState } from "./Recipe";
import { RecipeStepState } from "./RecipeStep";

export interface IAPIState {
    recipe: RecipeState;
    recipeSteps: RecipeStepState;
}