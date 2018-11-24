import * as React from "react";
import { ChildProps, graphql } from "react-apollo";
import { Button, Form, Input } from "antd";

import { GetRecipeWithStepsResponse, getRecipeWithSteps } from "../../graphql/recipe";
import RecipeStepList from "../../components/step/RecipeStepList";
import { Recipe, keysOfRecipe } from "../../models/Recipe";

import * as styles from "./recipePage.scss";
import client from "../../graphql/client";
import { partialMutate } from "../../graphql/request";
import { FormComponentProps } from "antd/lib/form";

export interface IRecipePageApolloProps {
    recipeId: string;
}

interface IRecipePageState {
    editing: boolean;
}

class RecipePage extends React.Component<FormComponentProps & ChildProps<IRecipePageApolloProps, GetRecipeWithStepsResponse, Response>, IRecipePageState> {
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
                        <RecipeStepList steps={ recipe.steps } />
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

        const newRecipe = {
            ...oldRecipe,
            ...this.props.form.getFieldsValue(),
        } as Recipe;

        const query = partialMutate(oldRecipe, newRecipe, "updateRecipe", keysOfRecipe);

        client.mutate({
            mutation: query,
            variables: {
                id: oldRecipe.id,
            }
        });

        this.cancelEditing();
    }
}

const withRecipes = graphql<IRecipePageApolloProps, GetRecipeWithStepsResponse>(getRecipeWithSteps, {
    options: (props) => {
        console.log(props);
        return {
            variables: {
                id: props.recipeId,
            }
        };
    }
});

export default withRecipes(Form.create()(RecipePage));