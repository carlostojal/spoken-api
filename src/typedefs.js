const { gql } = require("apollo-server");

exports.typedefs = gql`
  
  type User {
    id: ID!,
    email: String!,
    name: String!,
    bio: String,
    username: String!,
    password: String!,
    posts: [Post]
  }

  type Post {
    id: ID!,
    user: User!,
    time: Int!,
    text: String!
  }

  type Query {
    users(username_like: String, name_like: String): [User]
    user(id: ID, email: String, username: String): User
    posts: [Post]
    post(id: ID): Post
  }

`;

