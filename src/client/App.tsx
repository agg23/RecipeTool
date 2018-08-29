import * as React from "react";
import RecipeComponent from "./components/RecipeComponent";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import EditRecipe from "./components/recipes/EditRecipe";
import { connect, DispatchProp } from "react-redux";
import { IState } from "./models/IState";
import { Recipe } from "./api/models/Recipe";

interface IAppReduxProps {
    recipes: Recipe[];
}

class App extends React.Component<IAppReduxProps & DispatchProp<any>, {}> {
    render(){
        return(
            <div className="App">
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/" component={RecipeComponent} />
                        <Route path="/recipe/:id" render={(props) => {
                            const id = parseInt(props.match.params.id);
                            if (id) {
                                const recipe = this.props.recipes.find((recipe) => recipe.id === id);
                                return <EditRecipe recipe={recipe} />
                            }
                            return <EditRecipe />
                        }}/>
                    </Switch> 
                </BrowserRouter>
            </div>
        );
    }
}

const mapStateToProps = (state: IState) => {
    return {
        recipes: state.api.recipe.recipes,
    };
}

export default connect<IAppReduxProps>(mapStateToProps)(App);