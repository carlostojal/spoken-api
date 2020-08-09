const { gql } = require("apollo-server");

exports.typeDefs = gql`
  type User {
    id: ID,
    name: String,
    surname: String,
    birthdate: String,
    email: String,
    email_confirmed: Boolean,
    username: String,
    profile_pic_url: String,
    profile_type: String,
  }

  type Query {
    getToken(username: String!, password: String!): String
  }

  type Mutation {
    registerUser(name: String!, surname: String!, birthdate: String, email: String!, username: String!, password: String!, profile_pic_url: String, profile_type: String!): User
  }
`
