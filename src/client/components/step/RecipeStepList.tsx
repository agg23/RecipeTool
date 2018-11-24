import * as React from "react";
import { RecipeStep } from "../../models/RecipeStep";
import { List, Avatar, Form, Input, Button } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";

export interface IRecipeStepListProps {
    steps: RecipeStep[];
    editing: boolean;
    form: WrappedFormUtils; 
}

interface IRecipeStepListState {
    editing: boolean;
    newSteps: RecipeStep[];
    deletedIds: Set<string>;
}

export default class RecipeStepList extends React.Component<IRecipeStepListProps, {}> {
    public static getDerivedStateFromProps(newProps: IRecipeStepListProps, oldState: IRecipeStepListState) {
        let newSteps = oldState.newSteps;
        let deletedIds = oldState.deletedIds;

        if (newProps.editing !== oldState.editing) {
            newSteps = [];
            deletedIds = new Set();
        }

        return {
            ...oldState,
            editing: newProps.editing,
            newSteps,
            deletedIds,
        }
    }

    public readonly state: IRecipeStepListState = {
        editing: false,
        newSteps: [],
        deletedIds: new Set(),
    }

    public render = () => {
        const steps = this.props.steps.concat(this.state.newSteps).filter((step) => !this.state.deletedIds.has(step.id));

        return (
            <div>
                <List
                    size="large"
                    dataSource={ steps }
                    renderItem={ this.renderRow }
                />
                { this.props.editing ?
                    <Button type="primary" onClick={ this.addStep }>Add Step</Button>
                    : null }
            </div>
        );
    }

    private renderRow = (step: RecipeStep) => {
        const editing = this.props.editing;
        const getFieldDecorator = this.props.form.getFieldDecorator;
        
        return (
            <List.Item
                key={ step.id }
            >
                <List.Item.Meta
                    avatar={ <Avatar icon="fund" /> }
                    title={
                        <Form.Item>
                            { editing ? (
                                getFieldDecorator(`newSteps.${step.id}.title`, {
                                    initialValue: step.title,
                                })(
                                    <Input />
                                )
                                ) : step.title }
                        </Form.Item>
                    }
                />
                <Form.Item>
                    { editing ? (
                        getFieldDecorator(`newSteps.${step.id}.description`, {
                            initialValue: step.description,
                        })(
                            <Input.TextArea />
                        )
                        ) : step.description }
                </Form.Item>
                { editing ? (
                        <Button onClick={ () => this.deleteStep(step.id) }>Delete Step</Button>
                    ) : null }
            </List.Item>
        );
    }

    /* Input */

    private addStep = () => {
        const newStep: RecipeStep = {
            id: this.state.newSteps.length.toString(),
        };

        const newSteps = [...this.state.newSteps, newStep];

        this.setState({
            newSteps,
        });
    }

    private deleteStep = (id: string) => {
        const filteredNewSteps = this.state.newSteps.filter((step) => step.id !== id);

        if (filteredNewSteps.length !== this.state.newSteps.length) {
            // Found in newly added
            this.setState({
                newSteps: filteredNewSteps,
            });
        } else {
            // Must be in existing nodes
            const deletedIds = new Set(this.state.deletedIds);

            deletedIds.add(id);

            this.setState({
                deletedIds,
            });
        }
    }
}