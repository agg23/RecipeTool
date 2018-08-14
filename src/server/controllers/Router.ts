import * as express from 'express';
import { Router } from 'express';
import * as ajv from 'ajv';

import { itemsController } from './ItemsController'
import Database from '../database';

// @ts-ignore Valid TS, VSCode just doesn't like it
import * as schema from '../models/database.json';
import { recipeController } from './RecipesController';
import { recipeStepsController } from './RecipeStepsController';

export const router = (database: Database, ajvValidator: ajv.Ajv): Router => {
    let router = express.Router();

    ajvValidator.addSchema(schema, "schema");
    ajvValidator.addSchema(partialSchema(JSON.parse(JSON.stringify(schema))), "partialSchema");

    router.use("/items", itemsController(database, ajvValidator));
    router.use("/recipes", recipeController(database, ajvValidator));
    router.use("/steps", recipeStepsController(database, ajvValidator));

    return router;
}

function partialSchema(dbschema: any) {
    let partialSchema = Object.assign({}, dbschema);
    for(let schemaName in partialSchema.definitions) {
        let schemaEntry = partialSchema.definitions[schemaName];
        if("required" in schemaEntry) {
            delete schemaEntry.required;
        }
    }

    return partialSchema;
}