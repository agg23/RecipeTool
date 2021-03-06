import * as React from "react";
import { ChildProps, graphql } from "react-apollo";
import { Button, Form, Input } from "antd";

import { RecipeResponse, getRecipeWithSteps, RecipeStepResponse } from "../../graphql/recipe";
import RecipeStepList from "../../components/step/RecipeStepList";
import { Recipe, keysOfRecipe } from "../../models/Recipe";

import * as styles from "./recipePage.scss";
import client from "../../graphql/client";
import { partialMutateQuery, partialDictionaryMutateQuery, OperationType } from "../../graphql/request";
import { FormComponentProps } from "antd/lib/form";
import { RecipeStep, keysOfRecipeStep } from "../../models/RecipeStep";
import { diff } from "deep-object-diff";

export interface IRecipePageApolloProps {
    recipeId: string;
}

interface IRecipePageState {
    editing: boolean;
}

interface RecipeStepDictionary {
    [id: string]: RecipeStep,
}

class RecipePage extends React.Component<FormComponentProps & ChildProps<IRecipePageApolloProps, RecipeResponse, Response>, IRecipePageState> {
    public readonly state: IRecipePageState = {
        editing: false,
    }

    public render = () => {
        const getFieldDecorator = this.props.form.getFieldDecorator;

        if (this.props.data.loading) {
            return (
                <div>
                    Loading Recipes
                </div>
            );
        } else if (this.props.data.error || !this.props.data.recipe) {
            return (
                <div>
                    Failed to load Recipes
                </div>
            );
        }

        const editing = this.state.editing;
        const recipe = this.props.data.recipe;

        return (
            <div>
                <Form>
                    <div className={ styles.recipeHeader } style={ { backgroundImage: `url('${recipe.imageUrl}')` } }>
                        <h1>{ recipe.name }</h1>
                    </div>
                    <div className={ styles.recipeDescription }>
                        <Form.Item>
                            { editing ? (
                                getFieldDecorator("description", {
                                    initialValue: recipe.description,
                                })(
                                    <Input.TextArea />
                                )
                                ) : recipe.description }
                        </Form.Item>     
                    </div>
                    <div className={ styles.recipeSteps }>
                        <RecipeStepList
                            steps={ recipe.steps }
                            editing={ editing }
                            form={ this.props.form }
                        />
                    </div>
                    { editing ? (
                            <div>
                                <Button onClick={ this.cancelEditing }>Cancel</Button>
                                <Button type="primary" onClick={ this.saveEdits }>Save</Button>
                            </div>
                        ) : (
                        <Button type="primary" onClick={ this.startEditing }>
                            Edit
                        </Button>
                    ) }
                </Form>
            </div>
        );
    }

    private startEditing = () => {
        this.setState({
            editing: true,
        });
    }

    private cancelEditing = () => {
        this.setState({
            editing: false,
        });
    }

    private saveEdits = () => {
        const oldRecipe = this.props.data.recipe;

        const fields = this.props.form.getFieldsValue() as Recipe & {
            newSteps: RecipeStepDictionary,
        };

        const oldSteps: RecipeStepDictionary = {};

        for (const step of oldRecipe.steps) {
            oldSteps[step.id] = step;
        }

        const newSteps = fields.newSteps;

        const stepsQueries = partialDictionaryMutateQuery(oldSteps, newSteps, "createRecipeStep", "updateRecipeStep", "deleteRecipeStep",
                                                          keysOfRecipeStep, oldRecipe.id, "recipe");

        const newRecipe = {
            ...oldRecipe,
            ...this.props.form.getFieldsValue(),
        } as Recipe;

        delete (newRecipe as any).newSteps;

        const query = partialMutateQuery(oldRecipe.id, oldRecipe, newRecipe, "updateRecipe", keysOfRecipe);

        for (const stepsQuery of stepsQueries) {
            if (stepsQuery.operationType === OperationType.create) {
                client.mutate({
                    mutation: stepsQuery,
                    update: (cache, data) => {
                        const recipeResponse = cache.readQuery({
                            query: getRecipeWithSteps,
                            variables: {
                                id: oldRecipe.id,
                            }
                        }) as RecipeResponse;
                        
                        const recipe = {
                            ...recipeResponse.recipe
                        };

                        const createdStepData = data.data as RecipeStepResponse;
                        const createdStep = createdStepData.createRecipeStep;

                        recipe.steps.push(createdStep);

                        cache.writeQuery({
                            query: getRecipeWithSteps,
                            variables: {
                                id: oldRecipe.id,
                            },
                            data: {
                                recipe,
                            }
                        });
                    }
                });
            } else if (stepsQuery.operationType === OperationType.delete) {
                client.mutate({
                    mutation: stepsQuery,
                    update: (cache, data) => {
                        const recipeResponse = cache.readQuery({
                            query: getRecipeWithSteps,
                            variables: {
                                id: oldRecipe.id,
                            }
                        }) as RecipeResponse;
                        
                        const recipe = {
                            ...recipeResponse.recipe
                        };

                        const deletedStepData = data.data as RecipeStepResponse;
                        const createdStepId = deletedStepData.deleteRecipeStep.id;

                        recipe.steps = recipe.steps.filter((step) => step.id !== createdStepId);

                        cache.writeQuery({
                            query: getRecipeWithSteps,
                            variables: {
                                id: oldRecipe.id,
                            },
                            data: {
                                recipe,
                            }
                        });
                    }
                });
            } else {
                client.mutate({
                    mutation: stepsQuery,
                });
            }
        }

        if (query) {
            client.mutate({
                mutation: query,
            });
        }

        this.cancelEditing();
    }
}

const withRecipes = graphql<IRecipePageApolloProps, RecipeResponse>(getRecipeWithSteps, {
    options: (props) => {
        return {
            variables: {
                id: props.recipeId,
            }
        };
    }
});

export default withRecipes(Form.create()(RecipePage));