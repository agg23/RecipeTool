import { getApi, createActionType, ActionType, postApi } from "./api";
import { Dispatch } from "redux";
import { RecipeState, Recipe } from "./models/Recipe";
import { IAction, ResponseAction } from "./interfaces";

const Actions = {
    ALLRECIPES: "ALLRECIPES",
    CREATERECIPE: "CREATERECIPE",
}

const ActionTypes = {
    ALLRECIPES_REQUEST: createActionType(Actions.ALLRECIPES, ActionType.REQUEST),
    ALLRECIPES_SUCCESS: createActionType(Actions.ALLRECIPES, ActionType.SUCCESS),
    ALLRECIPES_FAILURE: createActionType(Actions.ALLRECIPES, ActionType.FAILURE),

    CREATERECIPE_REQUEST: createActionType(Actions.CREATERECIPE, ActionType.REQUEST),
    CREATERECIPE_SUCCESS: createActionType(Actions.CREATERECIPE, ActionType.SUCCESS),
    CREATERECIPE_FAILURE: createActionType(Actions.CREATERECIPE, ActionType.FAILURE),
}

export function requestAllRecipes() {
    return function(dispatch: Dispatch<any>) {
        return dispatch<any>(getApi(Actions.ALLRECIPES, "recipes/all", null)).then(function(response) {
            console.log("All recipes loaded");
        });
    }
}

export function requestCreateRecipe(recipe: Recipe) {
    return function(dispatch: Dispatch<any>) {
        return dispatch<any>(postApi(Actions.CREATERECIPE, "recipes/create", null, recipe)).then(function(response) {
            console.log("Created recipe");
        });
    }
}

const initialState: RecipeState = {
    recipes: [],
};

export function reducers(state: RecipeState = initialState, action: IAction): RecipeState {
    switch(action.type) {
        case ActionTypes.ALLRECIPES_REQUEST: {
            console.log("Requested All Recipes");
            return {
                ...state,
            }
        }
        case ActionTypes.ALLRECIPES_SUCCESS: {
            console.log("Retrived all recipes");

            const responseAction = action as ResponseAction;
            const response = responseAction.response.data as Recipe[];

            // TODO: Properly merge data
            return {
                ...state,
                recipes: response,
            }
        }
        default:
            return {
                ...state,
            }
    }
}