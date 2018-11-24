import gql from "graphql-tag";
import { diff } from "deep-object-diff";
import { keysOfRecipe } from "../models/Recipe";

export interface IModelKeys {
    keys: string[];
    compositeChildrenKeys?: {
        [key: string]: IModelKeys,
    };
    excludedKeys?: Set<string>;
}

export const partialMutate = <T extends {}>(originalObject: T, newObject: T, mutationFunction: string, allKeys: IModelKeys) => {
    const changes = diff(originalObject, newObject);

    const keys = Object.keys(changes);

    if (keys.length === 0) {
        return null;
    }

    let changedPropsQuery = "";

    for (const key of keys) {
        const object = changes[key];

        let wrappedObject = object;

        if (typeof wrappedObject === "string") {
            wrappedObject = `"${object}"`;
        }

        changedPropsQuery += `${key}: ${wrappedObject}\n`;
    }

    let allKeysQuery = keysQuery(allKeys);

    return gql`
        mutation ${mutationFunction}($id: ID!) {
            ${mutationFunction}(data: {
                ${changedPropsQuery}
            }, where: {
                id: $id
            }) {
                ${allKeysQuery}
            }
        }
    `;
}

const keysQuery = (keys: IModelKeys): string => {
    let query = "";

    for (const key of keys.keys) {
        if (keys.excludedKeys && keys.excludedKeys.has(key)) {
            continue;
        }

        const compositeKeys = keys.compositeChildrenKeys ? keys.compositeChildrenKeys[key] : null;
        if (compositeKeys) {
            // Is composite
            query += `${key} {\n${keysQuery(compositeKeys)}}`;
        } else {
            query += `${key}\n`;
        }
    }

    return query;
}

const isInt = (n: number) => {
    return n % 1 === 0;
}

const typeStringForObject = (object: any) => {
    const type = typeof object;
    
    switch (type) {
        case "string":
            return "String";
        case "number": {
            return isInt(object) ? "Int" : "Float";
        }
        case "boolean":
            return "Boolean";
    }
}