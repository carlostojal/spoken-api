const { gql } = require("apollo-server");

exports.typeDefs = gql`

  type User {
    id: ID,
    name: String,
    surname: String,
    birthdate: String,
    email: String,
    username: String,
    profile_pic_url: String,
    profile_type: String,
    posts: [Post],
    following: [Follower],
    followers: [Follower]
    }]
  }

  type Post {
    id: ID,
    poster: User,
    time: String,
    text: String
  }

  type Follower {
    user: User,
    accepted: Boolean
  }

  type Query {
    getToken(username: String!, password: String!): String
    getUserData(id: String): String
  }

  type Mutation {
    registerUser(name: String!, surname: String!, birthdate: String, email: String!, username: String!, password: String!, profile_pic_url: String, profile_type: String!): User
    createPost(text: String!): Post
  }
`
