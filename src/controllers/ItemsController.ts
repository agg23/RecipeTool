import * as express from 'express';
import { Router } from 'express';
import * as ajv from 'ajv';

import Database from '../database';
import { Item } from '../models/Database';
import { error, success } from './messages';

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
            response.json(error("item/create", ajvValidator.errorsText()));
            return;
        }

        let newItem: Item = request.body;

        let result = database.get().prepare(`INSERT INTO Items (
            name, upc, imageUrl, lastSeenPrice, detailImageUrl,
            brandName, itemSize, itemSizeType, foodCategoryId
        ) VALUES (
            $name, $upc, $imageUrl, $lastSeenPrice, $detailImageUrl,
            $brandName, $itemSize, $itemSizeType, $foodCategoryId
        )`).run({
            name: newItem.name,
            upc: newItem.upc,
            imageUrl: newItem.imageUrl,
            lastSeenPrice: newItem.lastSeenPrice,
            detailImageUrl: newItem.detailImageUrl,
            brandName: newItem.brandName,
            itemSize: newItem.itemSize,
            itemSizeType: newItem.itemSizeType,
            foodCategoryId: newItem.foodCategoryId
        });

        response.json(success("item/create", Number(result.lastInsertROWID)));
    });

    return router;
});