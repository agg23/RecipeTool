import * as React from "react";
import RecipeComponent from "./components/RecipeComponent";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import EditRecipe from "./components/recipes/EditRecipe";
import { connect, DispatchProp } from "react-redux";
import { IState } from "./models/IState";
import { Recipe } from "./api/models/Recipe";
import RecipeListPage from "./pages/RecipeListPage";

import "antd/dist/antd.css";
import RecipePage from "./pages/RecipePage";

interface IAppReduxProps {
    recipes: Recipe[];
}

class App extends React.Component<IAppReduxProps & DispatchProp<any>, {}> {
    render(){
        return(
            <div className="App">
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/recipes" component={ RecipeListPage } />
                        <Route path="/recipe/:id" render={(props) => {
                            return <RecipePage recipeId={ props.match.params.id } />
                        }}/>
                        <Route render={ () => <Redirect to="/recipes" /> } />
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