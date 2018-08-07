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

    router.get("/upc/:upc", (request, response) => {
        let statement = database.get().prepare(`SELECT id, name, upc,
            imageUrl, lastSeenPrice, detailImageUrl,
            brandName, itemSize, itemSizeType, foodCategoryId
            FROM Items
            WHERE upc == $upc`);

        let result = statement.get({
            upc: request.params["upc"]
        }) as Item;

        response.json(result);
    });

    router.get("/:id", (request, response) => {
        let statement = database.get().prepare(`SELECT id, name, upc,
            imageUrl, lastSeenPrice, detailImageUrl,
            brandName, itemSize, itemSizeType, foodCategoryId
            FROM Items
            WHERE id == $id`);

        let result = statement.get({
            id: request.params["id"]
        }) as Item;

        response.json(result);
    });

    router.get("/brand/:brandName", (request, response) => {
        let statement = database.get().prepare(`SELECT id, name, upc,
            imageUrl, lastSeenPrice, detailImageUrl,
            brandName, itemSize, itemSizeType, foodCategoryId
            FROM Items
            WHERE brandName == $brandName
            COLLATE NOCASE`);

        let result = statement.all({
            brandName: request.params["brandName"]
        }) as Item[];

        response.json(result);
    });

    router.post("/create", (request, response) => {
        if(!ajvValidator.validate("schema#/definitions/Item", request.body)) {
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

    router.patch("/:id", (request, response) => {
        if(!ajvValidator.validate("partialSchema#/definitions/Item", request.body)) {
            response.json(error("item/patch", ajvValidator.errorsText()));
            return;
        }

        let id = request.params["id"];
        let newItem: Item = request.body;

        let result = database.patch("Items", id, newItem).run({
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

        if(result.changes > 0) {
            response.json(success("item/patch", id));
        } else {
            response.json(error("item/patch", id));
        }
    });

    return router;
});