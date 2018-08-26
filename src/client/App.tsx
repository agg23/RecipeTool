import * as React from "react";
import RecipeComponent from "./components/RecipeComponent";

class App extends React.Component {
    render(){
        return(
            <div className="App">
                <RecipeComponent />
            </div>
        );
    }
}

export default App;