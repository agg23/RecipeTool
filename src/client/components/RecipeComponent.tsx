import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { IState } from "../models/IState";
import { requestAllRecipes } from "../api/RecipeAPI";
import { Recipe } from "../api/models/Recipe";

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
                        return <li key={value.id}>{`Name: ${value.name}`}</li>
                    })}
                </ul>
            </div>
        );
    }
}

const mapStateToProps = (state: IState): IRecipeComponentReduxProps => ({
    recipes: state.api.recipe.recipes,
});

export default connect<IRecipeComponentReduxProps, {}, {}>(mapStateToProps)(RecipeComponent);