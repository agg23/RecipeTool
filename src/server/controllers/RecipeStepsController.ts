import * as express from 'express';
import { Router } from 'express';
import * as ajv from 'ajv';

import Database from '../database';
import { RecipeStep } from '../models/Database';
import { error, success } from './messages';

export const recipeStepsController = ((database: Database, ajvValidator: ajv.Ajv): Router => {
    let router = express.Router();

    router.get("/:id", (request, response) => {
        let statement = database.get().prepare(`SELECT id, step, description,
            foodCategoryId, type, duration
            FROM RecipeSteps
            WHERE recipeId == $id
            ORDER BY step`);

        let result = statement.all({
            id: request.params["id"]
        }) as RecipeStep[];

        if(result) {
            response.json(result);
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
            recipeId, step, description, foodCategoryId, type, duration
        ) VALUES (
            $recipeId, $step, $description, $foodCategoryId, $type, $duration
        )`).run({
            recipeId: newStep.recipeId,
            step: newStep.step,
            description: newStep.description,
            foodCategoryId: newStep.foodCategoryId,
            type: newStep.type,
            duration: newStep.duration
        });

        response.json(success("recipeSteps/create", Number(result.lastInsertROWID)));
    });


    return router;
});