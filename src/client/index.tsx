import * as React from "react";
import * as ReactDOM from "react-dom";
import { ApolloProvider } from "react-apollo";

import App from "./App";
import client from "./graphql/client";

ReactDOM.render(
    <ApolloProvider client={ client }>
        <App />
    </ApolloProvider>,
    document.getElementById("root")
);