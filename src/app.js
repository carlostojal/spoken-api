const { ApolloServer } = require("apollo-server");
require("dotenv").config({ path: ".env" });
require("./express"); // express server
require("./helpers/jobs")(); // cron jobs
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const getUserByToken = require("./helpers/session/getUserByToken");

console.log("** Spoken API **\n\n");
console.log(`Starting in ${process.env.NODE_ENV} environment.\n\n`);

// apollo server startup
const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  context: async ({ req, res }) => {

    // get access token from headers
    const token = req.headers.authorization;

    let user = null;

    // get user from token
    if(token) {
      try {
        user = await getUserByToken(token);
      } catch(e) {
        
      }
    }

    return { req, res, user };
  }
});

server.listen().then(({ url }) => {
  console.log(`GraphQL Playground running at ${url}\n`);
});

