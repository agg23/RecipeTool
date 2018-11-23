import * as React from "react";
import { ChildProps, graphql } from "react-apollo";

import { getRecipes, GetRecipeResponse } from "../graphql/recipe";

class RecipePage extends React.Component<ChildProps<{}, GetRecipeResponse, Response>, {}> {
    public render = () => {
        console.log(this.props);
        if (this.props.data.loading) {
            return (
                <div>
                    Loading Recipes
                </div>
            );
        } else if (this.props.data.error) {
            return (
                <div>
                    Failed to load Recipes
                </div>
            );
        } else {
            return (
                <div>
                    { this.props.data.recipes.map((recipe) => {
                        return <div>{ recipe.name }</div>;
                    }) }
                </div>
            );
        }
    }
}

const withRecipes = graphql<{}, GetRecipeResponse>(getRecipes);

export default withRecipes(RecipePage);