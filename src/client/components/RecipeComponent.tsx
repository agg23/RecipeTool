import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { IState } from "../models/IState";
import { requestAllRecipes } from "../api/RecipeAPI";
import { Recipe } from "../api/models/Recipe";
import CreateRecipe from "./recipes/CreateRecipe";
import { Link } from "react-router-dom";

interface IRecipeComponentReduxProps {
    recipes: Recipe[],
}

class RecipeComponent extends React.Component<IRecipeComponentReduxProps & DispatchProp<any>, any> {
    componentDidMount() {
        this.props.dispatch(requestAllRecipes());
    }
    
    render() {
        return (
            <div>
                <div>Recipes</div>
                <ul>
                    {this.props.recipes.map((value) => {
                        return <li key={value.id}>{`Name: ${value.name}`}<Link to={`recipe/${value.id}`}>Edit</Link></li>
                    })}
                </ul>
                <CreateRecipe />
            </div>
        );
    }
}

const mapStateToProps = (state: IState): IRecipeComponentReduxProps => ({
    recipes: state.api.recipe.recipes,
});

export default connect<IRecipeComponentReduxProps, {}, {}>(mapStateToProps)(RecipeComponent);