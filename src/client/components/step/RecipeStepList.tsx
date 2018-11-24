import * as React from "react";
import { RecipeStep } from "../../models/RecipeStep";
import { List, Avatar } from "antd";

export interface IRecipeStepListProps {
    steps: RecipeStep[];
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
        return (
            <List.Item
                key={ step.id }
            >
                <List.Item.Meta
                    avatar={ <Avatar icon="fund" /> }
                    title={ step.title }
                />
                { step.description }
            </List.Item>
        );
    }
}