const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const cors = require("cors");
const os = require("os");
require("dotenv").config({ path: ".env" });
require("log-timestamp");
require("./helpers/jobs")(); // cron jobs
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const getUserByToken = require("./helpers/session/getUserByToken");
const mysqlPool = require("./config/mysql");

console.log("\n** Spoken API **\n\n");
console.log(`Starting in ${process.env.NODE_ENV} environment.\n\n`);

const app = express();

const corsOptions = {
  origin: process.env.ALLOW_ORIGIN,
  credentials: true
};

app.use(cors(corsOptions));

app.get("/info", (req, res) => {
  return res.send(`Server name is <b>${os.hostname()}</b>.\nUp since <b>${new Date(Date.now() - (os.uptime() * 1000))}</b>.`);
});

// apollo server startup
const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  tracing: true,
  context: async ({ req, res }) => {

    // get access token from headers
    const token = req.headers.authorization;

    let user = null;

    // get user from token
    if(token) {
      try {
        user = await getUserByToken(token, mysqlPool);
      } catch(e) {
        console.error(e);
      }
    }

    return { req, res, user, mysqlPool };
  }
});
server.applyMiddleware({ app, cors: corsOptions });

const port = process.env.GRAPHQL_PORT || 4000;

app.listen({ port }, () => {
  console.log(`GraphQL Playground running at http://localhost:${port}${server.graphqlPath}\n`);
});

