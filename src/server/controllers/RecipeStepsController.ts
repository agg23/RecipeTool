import * as express from 'express';
import { Router } from 'express';
import * as ajv from 'ajv';

import Database from '../Database';
import { RecipeStep } from '../models/Database';
import { error, success } from './messages';

export const recipeStepsController = ((database: Database, ajvValidator: ajv.Ajv): Router => {
    let router = express.Router();

    router.get("/:id", (request, response) => {
        let statement = database.get().prepare(`SELECT id, step, description,
            foodCategoryId, type, duration, quantity
            FROM RecipeSteps
            WHERE recipeId == $id
            ORDER BY step`);

        const id = request.params["id"];

        const result = statement.all({
            id: request.params["id"]
        }) as RecipeStep[];

        if(result) {
            const responseObject = {};
            responseObject[id] = result;
            response.json(responseObject);
        } else {
            response.json({});
        }
    });

    router.post("/create", (request, response) => {
        if(!ajvValidator.validate("schema#/definitions/RecipeStep", request.body)) {
            response.json(error("recipeSteps/create", ajvValidator.errorsText()));
            return;
        }

        let newStep: RecipeStep = request.body;

        // TODO: Check if step exists
        let result = database.get().prepare(`INSERT INTO RecipeSteps (
            recipeId, step, description, foodCategoryId, type, duration, quantity
        ) VALUES (
            $recipeId, $step, $description, $foodCategoryId, $type, $duration, $quantity
        )`).run({
            recipeId: newStep.recipeId,
            step: newStep.step,
            description: newStep.description,
            foodCategoryId: newStep.foodCategoryId,
            type: newStep.type,
            duration: newStep.duration,
            quantity: newStep.quantity,
        });

        response.json(success("recipeSteps/create", Number(result.lastInsertROWID)));
    });

    router.patch("/:id", (request, response) => {
        if(!ajvValidator.validate("partialSchema#/definitions/RecipeStep", request.body)) {
            response.json(error("recipe/patch", ajvValidator.errorsText()));
            return;
        }

        let id = request.params["id"];
        let newRecipeStep: RecipeStep = request.body;

        // TODO: Fix
        let result = database.patch("RecipeSteps", id, newRecipeStep).run({
            id: id,
            description: newRecipeStep.description,
            foodCategoryId: newRecipeStep.foodCategoryId,
            type: newRecipeStep.type,
            duration: newRecipeStep.duration,
            quantity: newRecipeStep.quantity,
        });

        if(result.changes > 0) {
            response.json(success("recipeStep/patch", id));
        } else {
            response.json(error("recipeStep/patch", id));
        }
    });

    return router;
});