import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { Recipe } from "../../api/models/Recipe";
import { requestCreateRecipe, requestPatchRecipe } from "../../api/RecipeAPI";
import { nullIfEmpty, nullIfEmptyFloat } from "../../utility/string";
import { RecipeStep, RecipeStepState } from "../../api/models/RecipeStep";
import { IState } from "../../models/IState";
import { requestCreateRecipeStep, requestPatchRecipeStep } from "../../api/RecipeStepAPI";

interface IEditRecipeStepProps {
    recipeId: number;
    step?: RecipeStep;
}

interface IEditRecipeStepReduxProps {
    allSteps: RecipeStepState;
}

interface IEditRecipeStepState {
    stepNumber: number;
    description?: string;
    foodCategoryId?: number;
    type?: string;
    duration?: string;
    quantity?: string;
}

class EditRecipeStep extends React.Component<IEditRecipeStepReduxProps & IEditRecipeStepProps & DispatchProp<any>, IEditRecipeStepState> {
    readonly state: IEditRecipeStepState = this.props.step ? {
        stepNumber: this.props.step.step,
        description: this.props.step.description,
        foodCategoryId: this.props.step.foodCategoryId,
        type: this.props.step.type,
        duration: this.props.step.duration ? String(this.props.step.duration) : null,
        quantity: this.props.step.quantity ? String(this.props.step.quantity) : null,
    } : {
        // If steps for current recipe already exist, then this is the next step, otherwise its the first
        stepNumber: this.props.allSteps[this.props.recipeId] ? 
            this.props.allSteps[this.props.recipeId].length : 0,
    }

    componentDidMount() {
        console.log(this.props);
    }

    inputChange(event) {
        const target = event.target;
        const name: string = target.name;

        const state = {};

        if (!name) {
            return;
        }

        state[name] = target.value;

        this.setState(state);
    }

    handleSubmit(event) {
        event.preventDefault();

        let recipeStep: RecipeStep = {
            step: this.state.stepNumber,
            recipeId: this.props.recipeId,
            description: nullIfEmpty(this.state.description),
            foodCategoryId: this.state.foodCategoryId,
            type: nullIfEmpty(this.state.type),
            duration: nullIfEmptyFloat(this.state.duration),
            quantity: nullIfEmptyFloat(this.state.quantity),
        };

        if (this.props.step) {
            console.log("Patching recipe step");
            console.log(recipeStep);

            this.props.dispatch(requestPatchRecipeStep(recipeStep));
        } else {
            console.log("Creating recipe step");
            console.log(recipeStep);    

            this.props.dispatch(requestCreateRecipeStep(recipeStep));
        }
    }

    render() {
        return (
            <form onSubmit={ this.handleSubmit.bind(this) }>
                <label htmlFor="description">Description:</label><input name="description" value={ this.state.description } onChange={ this.inputChange.bind(this) } />
                <label htmlFor="foodCategoryId">Food Category:</label><input name="foodCategoryId" value={ this.state.foodCategoryId } onChange={ this.inputChange.bind(this) } />
                <label htmlFor="type">Type:</label><input name="type" value={ this.state.type } onChange={ this.inputChange.bind(this) } />
                <label htmlFor="duration">Duration:</label><input name="duration" value={ this.state.duration } onChange={ this.inputChange.bind(this) } />
                <label htmlFor="quantity">Quantity:</label><input name="quantity" value={ this.state.quantity } onChange={ this.inputChange.bind(this) } />
                <input type="submit" value="Submit" />
            </form>
        );
    }
}

const mapStateToProps = (state: IState): IEditRecipeStepReduxProps => {
    return {
        allSteps: state.api.recipeSteps
    };
}

export default connect<IEditRecipeStepReduxProps, {}, IEditRecipeStepProps>(mapStateToProps)(EditRecipeStep);
