import * as React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import RecipePage from "./pages/recipe/RecipePage";
import RecipeListPage from "./pages/recipe/RecipeListPage";

import "antd/dist/antd.css";

export default class App extends React.Component<{}, {}> {
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
