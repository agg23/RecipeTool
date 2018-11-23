import * as React from "react";
import { ChildProps, graphql } from "react-apollo";

import { GetRecipeWithStepsResponse, getRecipeWithSteps } from "../graphql/recipe";

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

        return <div>
            { this.props.data.recipe.name }
        </div>
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