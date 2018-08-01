import * as express from 'express';

import { itemsController } from './ItemsController'
import Database from '../database';
import { Router } from 'express';

export const router = (database: Database): Router => {
    let router = express.Router();

    router.use("/items", itemsController(database));

    return router;
}