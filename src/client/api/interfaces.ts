import { AxiosResponse, AxiosError } from "axios";

export interface IAction {
    type: string;
}

export interface ResponseAction extends IAction {
    response: AxiosResponse<any>;
}

export interface ErrorAction extends IAction {
    error: AxiosError;
}