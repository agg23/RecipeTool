import gql from "graphql-tag";
import { diff } from "deep-object-diff";
import { difference, intersection } from "../utility/set";

export interface IModelKeys {
    keys: string[];
    compositeChildrenKeys?: {
        [key: string]: IModelKeys,
    };
    excludedKeys?: Set<string>;
}

export const partialDictionaryMutateQuery = <T extends {}>(originalDictionary: { [id: string]: T}, newDictionary: { [id: string]: T},
                                                           createFunction: string, updateFunction: string, deleteFunction: string,
                                                           allKeys: IModelKeys, connectId?: string, connectKey?: string) => {
    const queries = [];

    const originalIds = new Set(Object.keys(originalDictionary));
    const newIds = new Set(Object.keys(newDictionary));

    const createdIds = difference(newIds, originalIds);
    const deletedIds = difference(originalIds, newIds);
    const updatedIds = intersection(originalIds, newIds);

    for (const id of createdIds) {
        const item = newDictionary[id];

        queries.push(createQuery(item, createFunction, allKeys, connectId, connectKey));
    }
    
    for (const id of deletedIds) {
        queries.push(deleteQuery(id, deleteFunction));
    }

    for (const id of updatedIds) {
        const originalItem = originalDictionary[id];
        const newItem = newDictionary[id];

        queries.push(partialMutateQuery(id, originalItem, newItem, updateFunction, allKeys));
    }

    return queries;
}

export const createQuery = <T extends {}>(item: T, createFunction: string, allKeys: IModelKeys, connectId?: string, connectKey?: string) => {
    let objectProps = changedPropsQuery(allKeys.keys, item, allKeys.excludedKeys);
    const allKeysQuery = keysQuery(allKeys);

    if (connectId && connectKey) {
        objectProps += `${connectKey} {\nconnect:{\nid: ${connectId}\n}\n}\n}`;
    }

    return gql`
        mutation {
            ${createFunction}(data: {
                ${objectProps}
            }) {
                ${allKeysQuery}
            }
        }
    `;
}

export const deleteQuery = (id: string, deleteFunction: string) => {
    return gql`
        mutation {
            ${deleteFunction}(where: {
                id: "${id}"
            }) {
                id
            }
        }
    `;
}

export const partialMutateQuery = <T extends {}>(id: string, originalObject: T, newObject: T, mutationFunction: string, allKeys: IModelKeys) => {
    const changes = diff(originalObject, newObject);

    const keys = Object.keys(changes);

    if (keys.length === 0) {
        return null;
    }

    const changedProps = changedPropsQuery(keys, changes, allKeys.excludedKeys);
    const allKeysQuery = keysQuery(allKeys);

    return gql`
        mutation {
            ${mutationFunction}(data: {
                ${changedProps}
            }, where: {
                id: "${id}"
            }) {
                ${allKeysQuery}
            }
        }
    `;
}

const changedPropsQuery = <T extends {}>(keys: string[], values: T, excludedKeys?: Set<string>) => {
    let changedProps = "";

    for (const key of keys) {
        if (excludedKeys && excludedKeys.has(key)) {
            continue;
        }

        const object = values[key];

        if (object === undefined) {
            // Was not actually provided
            continue;
        }

        let wrappedObject = object;

        if (typeof wrappedObject === "string") {
            wrappedObject = `"${object}"`;
        }

        changedProps += `${key}: ${wrappedObject}\n`;
    }

    return changedProps;
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