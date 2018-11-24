import * as React from "react";
import { ChildProps, graphql } from "react-apollo";

import { GetRecipeWithStepsResponse, getRecipeWithSteps } from "../../graphql/recipe";

import * as styles from "./recipePage.scss";
import RecipeStepList from "../../components/step/RecipeStepList";
import { Button } from "antd";

export interface IRecipePageApolloProps {
    recipeId: string;
}

class RecipePage extends React.Component<ChildProps<IRecipePageApolloProps, GetRecipeWithStepsResponse, Response>, {}> {
    public render = () => {
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

        const recipe = this.props.data.recipe;

        return (
            <div>
                <div className={ styles.recipeHeader } style={ { backgroundImage: `url('${recipe.imageUrl}')` } }>
                    <h1>{ recipe.name }</h1>
                </div>
                <div className={ styles.recipeDescription }>
                    { recipe.description }
                </div>
                <div className={ styles.recipeSteps }>
                    <RecipeStepList steps={ recipe.steps } />
                </div>
                <Button type="primary">Edit</Button>
            </div>
        );
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

export default withRecipes(RecipePage);