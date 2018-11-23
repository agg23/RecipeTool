import * as React from "react";
import { ChildProps, graphql } from "react-apollo";
import { ColumnProps } from "antd/lib/table";
import { Table } from "antd";

import { getRecipes, GetRecipesResponse } from "../graphql/recipe";
import { Recipe } from "../models/Recipe";
import { withRouter, RouteComponentProps } from "react-router-dom";

class RecipeListPage extends React.Component<RouteComponentProps<{}> & ChildProps<{}, GetRecipesResponse, Response>, {}> {
    private columns: ColumnProps<Recipe>[] = [
        {
            key: "name",
            dataIndex: "name",
            title: "Recipe Name",
            onCellClick: (recipe) => {
                console.log(recipe);
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
        console.log(this.props);
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

const withRecipes = graphql<{}, GetRecipesResponse>(getRecipes);

export default withRecipes(withRouter(RecipeListPage));