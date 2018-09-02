import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { Recipe } from "../../api/models/Recipe";
import { requestCreateRecipe, requestPatchRecipe } from "../../api/RecipeAPI";
import { nullIfEmpty } from "../../utility/string";
import { RecipeStep } from "../../api/models/RecipeStep";
import { RouteProps } from "react-router";

interface IEditRecipeProps {
    recipe?: Recipe;
}

interface IEditRecipeState {
    name: string;
    imageUrl?: string;
    description?: string;
    servingSize?: string;
    steps: RecipeStep[];
}

class EditRecipe extends React.Component<IEditRecipeProps & DispatchProp<any>, IEditRecipeState> {
    readonly state: IEditRecipeState = this.props.recipe ? {
        name: this.props.recipe.name,
        imageUrl: this.props.recipe.imageUrl,
        description: this.props.recipe.description,
        servingSize: this.props.recipe.servingSize ? String(this.props.recipe.servingSize) : undefined,
        // TODO: Add existing steps
        steps: [],
    } : {
        name: "",
        steps: [],
    }

    componentDidMount() {
        console.log(this.props);
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
            <form onSubmit={ this.handleSubmit.bind(this) }>
                <label htmlFor="name">Recipe Name:</label><input name="name" value={ this.state.name } onChange={ this.inputChange.bind(this) } />
                <label htmlFor="imageUrl">Image URL:</label><input name="imageUrl" value={ this.state.imageUrl } onChange={ this.inputChange.bind(this) } />
                <label htmlFor="description">Description:</label><input name="description" value={ this.state.description } onChange={ this.inputChange.bind(this) } />
                <label htmlFor="servingSize">Serving Size:</label><input name="servingSize" value={ this.state.servingSize } onChange={ this.inputChange.bind(this) } />
                <input type="submit" value="Submit" />
            </form>
        );
    }
}

export default connect()(EditRecipe);
