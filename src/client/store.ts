import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import { IState } from "./models/IState";
import { reducers as apiReducers } from "./api/reducers";

const reducers = {
    api: apiReducers,
};

export const store = createStore(combineReducers(reducers), applyMiddleware(thunk));