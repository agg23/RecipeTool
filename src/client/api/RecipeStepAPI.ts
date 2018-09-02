import { getApi, createActionType, ActionType, postApi, patchApi } from "./api";
import { Dispatch } from "redux";
import { IAction, ResponseAction } from "./interfaces";
import { RecipeStepState, RecipeStep } from "./models/RecipeStep";
import { IState } from "../models/IState";
import { diff } from 'deep-object-diff';

const Actions = {
    RECIPESTEPS: "RECIPESTEPS",
    CREATERECIPESTEP: "CREATERECIPESTEP",
    PATCHRECIPESTEP: "PATCHRECIPESTEP",
}

const ActionTypes = {
    RECIPESTEPS_REQUEST: createActionType(Actions.RECIPESTEPS, ActionType.REQUEST),
    RECIPESTEPS_SUCCESS: createActionType(Actions.RECIPESTEPS, ActionType.SUCCESS),
    RECIPESTEPS_FAILURE: createActionType(Actions.RECIPESTEPS, ActionType.FAILURE),

    CREATERECIPESTEP_REQUEST: createActionType(Actions.CREATERECIPESTEP, ActionType.REQUEST),
    CREATERECIPESTEP_SUCCESS: createActionType(Actions.CREATERECIPESTEP, ActionType.SUCCESS),
    CREATERECIPESTEP_FAILURE: createActionType(Actions.CREATERECIPESTEP, ActionType.FAILURE),

    PATCHRECIPESTEP_REQUEST: createActionType(Actions.PATCHRECIPESTEP, ActionType.REQUEST),
    PATCHRECIPESTEP_SUCCESS: createActionType(Actions.PATCHRECIPESTEP, ActionType.SUCCESS),
    PATCHRECIPESTEP_FAILURE: createActionType(Actions.PATCHRECIPESTEP, ActionType.FAILURE),
}

export function requestStepsForRecipe(id: number) {
    return function(dispatch: Dispatch<any>) {
        return dispatch<any>(getApi(Actions.RECIPESTEPS, "steps/", String(id))).then(function(response) {
            console.log(`All steps for recipe ${id} loaded`);
        });
    }
}

export function requestCreateRecipeStep(recipeStep: RecipeStep) {
    return function(dispatch: Dispatch<any>) {
        return dispatch<any>(postApi(Actions.CREATERECIPESTEP, "steps/create", null, recipeStep)).then(function(response) {
            console.log(`Created recipeStep`);
        });
    }
}

export function requestPatchRecipeStep(recipeStep: RecipeStep) {
    return function(dispatch: Dispatch<any>, getState: () => IState) {
        const steps = getState().api.recipeSteps[recipeStep.recipeId];

        if (!steps) {
            throw Error(`Steps for Recipe ${recipeStep.recipeId} doesn't exist`);
        }

        const oldStep = steps.length > recipeStep.step ? steps[recipeStep.step] : null;

        if (!oldStep) {
            throw Error(`No step to patch for ${recipeStep.recipeId} at index ${recipeStep.step}`);
        }

        const patchDiff = diff(recipeStep, oldStep);
        return dispatch<any>(patchApi(Actions.PATCHRECIPESTEP, "steps/", String(recipeStep.recipeId), patchDiff)).then(function(response) {
            console.log("Patched recipeStep");
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