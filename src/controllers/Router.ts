import * as express from 'express';
import { Router } from 'express';
import * as ajv from 'ajv';

import { itemsController } from './ItemsController'
import Database from '../database';

// @ts-ignore Valid TS, VSCode just doesn't like it
import * as schema from '../models/database.json';

export const router = (database: Database, ajvValidator: ajv.Ajv): Router => {
    let router = express.Router();

    ajvValidator.addSchema(schema, "items");

    router.use("/items", itemsController(database, ajvValidator));

    return router;
}