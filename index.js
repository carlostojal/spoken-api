const { ApolloServer } = require("apollo-server");
const { typedefs } = require("./src/typedefs.js");
const { resolvers } = require("./src/resolvers");
require("dotenv").config();

const server = new ApolloServer({
    typeDefs: typedefs,
    resolvers: resolvers
});

server.listen().then(({ url }) => {
    console.log(`GraphQL running at ${url}`);
});