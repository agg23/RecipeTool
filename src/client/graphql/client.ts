import ApolloClient from "apollo-boost";

const client = new ApolloClient({
    uri: "http://192.168.1.199:4466",
});

export default client;