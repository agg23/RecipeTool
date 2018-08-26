import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { Recipe } from "../../api/models/Recipe";
import { requestCreateRecipe } from "../../api/RecipeAPI";
import { nullIfEmpty } from "../../utility/string";

interface ICreateRecipeState {
    name: string;
    imageUrl?: string;
    description?: string;
    servingSize?: string;
}

class CreateRecipe extends React.Component<DispatchProp<any>, ICreateRecipeState> {
    readonly state: ICreateRecipeState = {
        name: "",
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

        const recipe: Recipe = {
            name: this.state.name,
            imageUrl: nullIfEmpty(this.state.imageUrl),
            description: nullIfEmpty(this.state.description),
            servingSize: !this.state.servingSize || this.state.servingSize === "" ? null : parseFloat(this.state.servingSize),
        }

        console.log("Creating recipe");
        console.log(recipe);

        this.props.dispatch(requestCreateRecipe(recipe));

        console.log(this.state);
    }

    render() {
        return (
            <form onSubmit={ this.handleSubmit.bind(this) }>
                <input name="name" value={ this.state.name } onChange={ this.inputChange.bind(this) } />
                <input name="imageUrl" value={ this.state.imageUrl } onChange={ this.inputChange.bind(this) } />
                <input name="description" value={ this.state.description } onChange={ this.inputChange.bind(this) } />
                <input name="servingSize" value={ this.state.servingSize } onChange={ this.inputChange.bind(this) } />
                <input type="submit" value="Submit" />
            </form>
        );
    }
}

export default connect()(CreateRecipe);
