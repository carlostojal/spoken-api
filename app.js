const { ApolloServer } = require("apollo-server");
require("dotenv").config();
require("./config/mongoose");
const { typeDefs } = require("./graphql/typeDefs");
const { resolvers } = require("./graphql/resolvers");
const User = require("./models/User.js");
const Post = require("./models/Post.js");
const getUserByToken = require("./helpers/getUserByToken");

// apollo server startup
const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  context: async ({ req, res }) => {

    // get access token from headers
    const token = req.headers.authorization;

    let user = null;

    // get user from token
    if(token)
      user = await getUserByToken(token);

    return { req, res, user };
  }
});

server.listen().then(({ url }) => {
  console.log(`GraphQL Playground running at ${url}\n`);
});

/*
const user = new User({
  access_token: {
    value: null,
    expiry: null
  },
  refresh_token: {
    value: null,
    expiry: null
  },
  name: "Carlos",
  surname: "Tojal",
  birthdate: ""156425353242"",
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
  }); */
