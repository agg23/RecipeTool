import * as React from "react";
import { ChildProps, graphql } from "react-apollo";
import { ColumnProps } from "antd/lib/table";
import { Table } from "antd";

import { getRecipes, RecipesResponse } from "../../graphql/recipe";
import { Recipe } from "../../models/Recipe";
import { withRouter, RouteComponentProps } from "react-router-dom";

class RecipeListPage extends React.Component<RouteComponentProps<{}> & ChildProps<{}, RecipesResponse, Response>, {}> {
    private columns: ColumnProps<Recipe>[] = [
        {
            key: "name",
            dataIndex: "name",
            title: "Recipe Name",
            onCellClick: (recipe) => {
                this.props.history.push(`/recipe/${recipe.id}`);
            }
        },
        {
            key: "description",
            dataIndex: "description",
            title: "Description",
        },
        {
            key: "servingSize",
            dataIndex: "servingSize",
            title: "Serving Size",
        },
    ];

    public render = () => {
        if (this.props.data.loading) {
            return (
                <div>
                    Loading Recipes
                </div>
            );
        } else if (this.props.data.error || !this.props.data.recipes) {
            return (
                <div>
                    Failed to load Recipes
                </div>
            );
        }

        const items = this.props.data.recipes.map((recipe) => {
            return {
                ...recipe,
                key: recipe.id,
            };
        })

        return (
            <div><Table dataSource={ items } columns={ this.columns } /></div>
        );
    }
}

const withRecipes = graphql<{}, RecipesResponse>(getRecipes);

export default withRecipes(withRouter(RecipeListPage));