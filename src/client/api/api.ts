import { Dispatch } from "redux";
import Axios, { AxiosResponse, AxiosError } from "axios";

import { IAction, ResponseAction, ErrorAction } from "./interfaces";

const endpoint = "http://localhost:8000/";

export enum ActionType {
    REQUEST = "REQUEST",
    SUCCESS = "SUCCESS",
    FAILURE = "FAILURE",
}

export function createActionType(name: string, type: ActionType): string {
    return `API/${name}_${type}`;
}

function createAction(name: string, type: ActionType): IAction {
    return {
        type: createActionType(name, type),
    }
}

function createResponseAction(name: string, response: AxiosResponse, type: ActionType): ResponseAction {
    const action = createAction(name, type) as ResponseAction;
    action.response = response;
    return action;
}

function createFailureAction(name: string, error: AxiosError, type: ActionType): ErrorAction {
    const action = createAction(name, type) as ErrorAction;
    action.error = error;
    return action;
}

export function getApi(name: string, path: string, datum?: string) {
    return function (dispatch: Dispatch<any>) {
        dispatch(createAction(name, ActionType.REQUEST));

        console.log("Requesting url " + endpoint + path);

        return Axios.get(endpoint + path).then(function(response) {
            dispatch(createResponseAction(name, response, ActionType.SUCCESS));
        }).catch(function(error) {
            console.log(error);
            dispatch(createFailureAction(name, error, ActionType.FAILURE));
            throw error;
        });
    }
}