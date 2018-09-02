import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { Recipe } from "../../api/models/Recipe";
import { requestCreateRecipe, requestPatchRecipe } from "../../api/RecipeAPI";
import { nullIfEmpty } from "../../utility/string";
import { RecipeStep, RecipeStepState } from "../../api/models/RecipeStep";
import { RouteProps } from "react-router";
import { requestStepsForRecipe } from "../../api/RecipeStepAPI";
import { IState } from "../../models/IState";
import EditRecipeStep from "./EditRecipeStep";

interface IEditRecipeProps {
    recipe?: Recipe;
}

interface IEditRecipeReduxProps {
    allSteps: RecipeStepState;
}

interface IEditRecipeState {
    name: string;
    imageUrl?: string;
    description?: string;
    servingSize?: string;
}

class EditRecipe extends React.Component<IEditRecipeReduxProps & IEditRecipeProps & DispatchProp<any>, IEditRecipeState> {
    readonly state: IEditRecipeState = this.props.recipe ? {
        name: this.props.recipe.name,
        imageUrl: this.props.recipe.imageUrl,
        description: this.props.recipe.description,
        servingSize: this.props.recipe.servingSize ? String(this.props.recipe.servingSize) : undefined,
    } : {
        name: "",
    }

    componentDidMount() {
        console.log(this.props);
        if (this.props.recipe) {
            this.props.dispatch(requestStepsForRecipe(this.props.recipe.id));
        }
    }

    inputChange(event) {
        const target = event.target;
        const name: string = target.name;

        const state = {};

        switch(name) {
            case "name": {
                state["name"] = target.value;
                break;
            }
            case "imageUrl": {
                state["imageUrl"] = target.value;
                break;
            }
            case "description": {
                state["description"] = target.value;
                break;
            }
            case "servingSize": {
                state["servingSize"] = target.value;
                break;
            }
        }

        this.setState(state);
    }

    handleSubmit(event) {
        event.preventDefault();

        if (this.state.name === "") {
            console.log("Invalid name");
            return;
        }

        let recipe: Recipe;

        if (this.props.recipe) {
            // TODO: Clean up like EditRecipeStep
            recipe = this.props.recipe;
            recipe.name = this.state.name;

            if (nullIfEmpty(this.state.imageUrl)) {
                recipe.imageUrl = this.state.imageUrl;
            }

            if (nullIfEmpty(this.state.description)) {
                recipe.description = this.state.description;
            }

            if (nullIfEmpty(this.state.servingSize)) {
                recipe.servingSize = parseFloat(this.state.servingSize);
            }

            console.log("Patching recipe");
            console.log(recipe);

            this.props.dispatch(requestPatchRecipe(recipe));
        } else {
            recipe = {
                name: this.state.name,
                imageUrl: nullIfEmpty(this.state.imageUrl),
                description: nullIfEmpty(this.state.description),
                servingSize: !this.state.servingSize || this.state.servingSize === "" ? null : parseFloat(this.state.servingSize),
            };

            console.log("Creating recipe");
            console.log(recipe);    

            this.props.dispatch(requestCreateRecipe(recipe));
        }
    }

    render() {
        return (
            <div>
                <form onSubmit={ this.handleSubmit.bind(this) }>
                    <label htmlFor="name">Recipe Name:</label><input name="name" value={ this.state.name } onChange={ this.inputChange.bind(this) } />
                    <label htmlFor="imageUrl">Image URL:</label><input name="imageUrl" value={ this.state.imageUrl } onChange={ this.inputChange.bind(this) } />
                    <label htmlFor="description">Description:</label><input name="description" value={ this.state.description } onChange={ this.inputChange.bind(this) } />
                    <label htmlFor="servingSize">Serving Size:</label><input name="servingSize" value={ this.state.servingSize } onChange={ this.inputChange.bind(this) } />
                    <input type="submit" value="Submit" />
                </form>
                <ul>
                    {this.props.recipe && this.props.allSteps[this.props.recipe.id] ? this.props.allSteps[this.props.recipe.id].map((step) => {
                        return <li><EditRecipeStep recipeId={ this.props.recipe.id } step={ step } /></li>
                    }) : null}
                    <li><EditRecipeStep recipeId={ this.props.recipe.id } /></li>
                </ul>
            </div>
        );
    }
}

const mapStateToProps = (state: IState): IEditRecipeReduxProps => {
    return {
        allSteps: state.api.recipeSteps,
    }
}

export default connect<IEditRecipeReduxProps, {}, IEditRecipeProps>(mapStateToProps)(EditRecipe);
