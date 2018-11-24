import * as React from "react";
import { RecipeStep } from "../../models/RecipeStep";
import { List, Avatar, Form, Input } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";

export interface IRecipeStepListProps {
    steps: RecipeStep[];
    editing: boolean;
    form: WrappedFormUtils; 
}

export default class RecipeStepList extends React.Component<IRecipeStepListProps, {}> {
    public render = () => {
        return (
            <List
                size="large"
                dataSource={ this.props.steps }
                renderItem={ this.renderRow }
            />
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
            </List.Item>
        );
    }
}