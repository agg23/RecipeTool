import * as express from 'express';
import { Router } from 'express';
import * as ajv from 'ajv';

import Database from '../database';
import { Item } from '../models/Database';
import { error } from './Error';

export const itemsController = ((database: Database, ajvValidator: ajv.Ajv): Router => {
    let router = express.Router();

    router.get("/all", (request, response) => {
        let statement = database.get().prepare(`SELECT id, name, upc,
            imageUrl, lastSeenPrice, detailImageUrl,
            brandName, itemSize, itemSizeType, foodCategoryId
            FROM Items`);

        let result = statement.all() as Item[];

        response.json(result);
    });

    router.post("/create", (request, response) => {
        if(!ajvValidator.validate("#/definitions/Item", request.body)) {
            response.json(error("Could not create item", ajvValidator.errorsText()));
            return;
        }

        console.log(request.body);
    });

    return router;
});