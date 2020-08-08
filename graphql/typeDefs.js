const { gql } = require("apollo-server");

exports.typeDefs = gql`
  type User {
    id: Int,
    name: String,
    surname: String,
    birthdate: Int,
    email: String,
    email_confirmed: Boolean,
    username: String,
    profile_pic_url: String,
    profile_type: String,
  }

  type Query {
    getToken(username: String!, password: String!): String
  }
`
