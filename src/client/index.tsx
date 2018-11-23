import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ApolloProvider } from "react-apollo";

import App from "./App";
import { store } from "./store";
import client from "./graphql/client";

ReactDOM.render(
    <ApolloProvider client={ client }>
        <Provider store={ store }>
            <App />
        </Provider>
    </ApolloProvider>,
    document.getElementById("root")
);