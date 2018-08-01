import * as express from 'express';
import Database from '../database';
import { Router } from 'express';
import { Item } from '../models/Database';
import { request } from 'http';
import { error } from './Error';

export const itemsController = ((database: Database): Router => {
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
        try {
            let json = JSON.parse(request.body);

            
        } catch (e) {
            response.json(error("Could not create item", e));
        }
    });

    return router;
});