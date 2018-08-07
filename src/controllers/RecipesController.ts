import * as express from 'express';
import { Router } from 'express';
import * as ajv from 'ajv';

import Database from '../database';
import { Recipe } from '../models/Database';
import { error, success } from './messages';

export const recipeController = ((database: Database, ajvValidator: ajv.Ajv): Router => {
    let router = express.Router();

    router.get("/all", (request, response) => {
        let statement = database.get().prepare(`SELECT id, name, imageUrl,
            description, servingSize
            FROM Recipes`);

        let result = statement.all() as Recipe[];

        response.json(result);
    });

    router.get("/:id", (request, response) => {
        let statement = database.get().prepare(`SELECT id, name, imageUrl,
            description, servingSize
            FROM Recipes
            WHERE id == $id`);

        let result = statement.get({
            id: request.params["id"]
        }) as Recipe;

        if(result) {
            response.json(result);
        } else {
            response.json({});
        }
    });

    router.post("/create", (request, response) => {
        if(!ajvValidator.validate("schema#/definitions/Recipe", request.body)) {
            response.json(error("recipe/create", ajvValidator.errorsText()));
            return;
        }

        let newRecipe: Recipe = request.body;

        let result = database.get().prepare(`INSERT INTO Recipes (
            name, imageUrl, description, servingSize
        ) VALUES (
            $name, $imageUrl, $description, $servingSize
        )`).run({
            name: newRecipe.name,
            imageUrl: newRecipe.imageUrl,
            description: newRecipe.description,
            servingSize: newRecipe.servingSize
        });

        response.json(success("recipe/create", Number(result.lastInsertROWID)));
    });

    router.patch("/:id", (request, response) => {
        if(!ajvValidator.validate("partialSchema#/definitions/Recipe", request.body)) {
            response.json(error("recipe/patch", ajvValidator.errorsText()));
            return;
        }

        let id = request.params["id"];
        let newRecipe: Recipe = request.body;

        let result = database.patch("Recipes", id, newRecipe).run({
            name: newRecipe.name,
            imageUrl: newRecipe.imageUrl,
            description: newRecipe.description,
            servingSize: newRecipe.servingSize
        });

        if(result.changes > 0) {
            response.json(success("recipe/patch", id));
        } else {
            response.json(error("recipe/patch", id));
        }
    });

    return router;
});