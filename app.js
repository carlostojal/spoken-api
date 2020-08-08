const { ApolloServer } = require("apollo-server");
require("dotenv").config();
require("./config/mongoose");
require("./config/rest");
const { typeDefs } = require("./graphql/typeDefs");
const { resolvers } = require("./graphql/resolvers");
const User = require("./models/User.js");
const Post = require("./models/Post.js");

// apollo server startup
const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  context: ({ res }) => ({
    res
  })
});

server.listen().then(({ url }) => {
  console.log(`GraphQL Playground running at ${url}\n`);
});

/*
const user = new User({
  active_token: "carlostojal_token",
  token_expiry: 1231243243,
  name: "Carlos",
  surname: "Tojal",
  birthdate: 156425353242,
  email: "carlos.tojal@mail.com",
  "email_confirmed": true,
  "username": "carlostojal",
  "password": "password",
  "profile_pic_url": "asdasd.jpg",
  "profile_type": "private"
});

user
  .save()
  .then((result) => {
    console.log("user saved");
  })
  .catch((err) => {
    console.error(err);
  });
  */
