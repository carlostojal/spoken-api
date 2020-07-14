import apollo from "apollo-server";
const { ApolloServer } = apollo;
import typedefs from "./src/typedefs.js";
import resolvers from "./src/resolvers.js";

const server = new ApolloServer({
    typeDefs: typedefs,
    resolvers: resolvers
});

server.listen().then(({ url }) => {
    console.log(`SpokenNetwork API running at ${url}`);
});