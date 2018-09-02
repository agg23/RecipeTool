import { getApi, createActionType, ActionType } from "./api";
import { Dispatch } from "redux";
import { IAction, ResponseAction } from "./interfaces";
import { RecipeStepState } from "./models/RecipeStep";

const Actions = {
    RECIPESTEPS: "RECIPESTEPS",
}

const ActionTypes = {
    RECIPESTEPS_REQUEST: createActionType(Actions.RECIPESTEPS, ActionType.REQUEST),
    RECIPESTEPS_SUCCESS: createActionType(Actions.RECIPESTEPS, ActionType.SUCCESS),
    RECIPESTEPS_FAILURE: createActionType(Actions.RECIPESTEPS, ActionType.FAILURE),
}

export function requestStepsForRecipe(id: number) {
    return function(dispatch: Dispatch<any>) {
        return dispatch<any>(getApi(Actions.RECIPESTEPS, "recipeSteps/", String(id))).then(function(response) {
            console.log(`All steps for recipe ${id} loaded`);
        });
    }
}

const initialState: RecipeStepState = {};

export function reducers(state: RecipeStepState = initialState, action: IAction): RecipeStepState {
    switch(action.type) {
        case ActionTypes.RECIPESTEPS_REQUEST: {
            console.log("Requested recipe steps");
            return {
                ...state,
            }
        }
        case ActionTypes.RECIPESTEPS_SUCCESS: {
            console.log("Retrived recipe steps");

            const responseAction = action as ResponseAction;
            const response = responseAction.response.data as RecipeStepState;

            return {
                ...state,
                ...response,
            }
        }
        default:
            return {
                ...state,
            }
    }
}