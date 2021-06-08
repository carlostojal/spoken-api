const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const cors = require("cors");
const os = require("os");
require("dotenv").config({ path: ".env" });
require("log-timestamp");
const typeDefs = require("./src/graphql/typeDefs");
const resolvers = require("./src/graphql/resolvers");
const getUserByToken = require("./src/helpers/session/getUserByToken");
const capturePromoteOrder = require("./src/helpers/paypal/capturePromoteOrder");
require("./src/config/mongoose");
const getPostRatings = require("./src/helpers/usage/getPostRatings");

console.log("\n** Spoken API **\n\n");
console.log(`Starting in ${process.env.NODE_ENV} environment.\n\n`);

const app = express();

const corsOptions = {
  origin: (origin, callback) => {
    callback(null, true);
  },
  credentials: true
};

app.use(cors(corsOptions));

// returns server info
app.get("/info", (req, res) => {
  return res.send(`Server name is <b>${os.hostname()}</b>.\nUp since <b>${new Date(Date.now() - (os.uptime() * 1000))}</b>.`);
});

// captures PayPal orders
app.get("/capture_order", async (req, res) => {
  try {
    await capturePromoteOrder(req.query.token);
  } catch(e) {
    let out;
    if(e.message == "ERROR_PROMOTING_POST")
      out += "There was an internal error. You were refunded.";
    else if(e.message == "ERROR_REFUNDING")
      out += "There was an error refunding your order.";
    else
      out += "There was an error processing your order.";
    return res.send(out);
  }
  
  return res.send("Order concluded. You can now return to the app.");
});

app.post("/post_ratings", async (req, res) => {

  console.log(req.connection.remoteAddress);

  let out = JSON.stringify("NOT_ALLOWED");
  // check if the machine accessing is the recommender machine
  // this will return sensitive information, so it is important that only the recommender system can access
  if(req.connection.remoteAddress == process.env.RECOMMENDER_ADDRESS)
    out = await getPostRatings();

  return res.send(out);

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
        user = await getUserByToken(token);
      } catch(e) {
        console.error(e);
      }
    }

    return { req, res, user };
  }
});
server.applyMiddleware({ app, cors: corsOptions });

const port = process.env.GRAPHQL_PORT || 4000;

app.listen({ port }, () => {
  console.log(`GraphQL Playground running at http://localhost:${port}${server.graphqlPath}\n`);
});

process.on("exit", () => {
  console.log("Shutting down server...");
});

module.exports = {
  app
};