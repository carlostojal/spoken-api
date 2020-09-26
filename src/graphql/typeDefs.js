const { gql } = require("apollo-server");

const typeDefs = gql`

  enum ProfileType {
    personal
    business
  }

  enum ProfilePrivacyType {
    public
    private
  }

  type User {
    id: ID,
    name: String,
    surname: String,
    birthdate: String,
    email: String,
    username: String,
    profile_pic_url: String,
    profile_type: String,
    profile_privacy_type: String,
    n_following: Int,
    n_followers: Int
  }

  type Post {
    id: ID,
    poster: User,
    time: String,
    text: String,
    media_url: String,
    edited: Boolean,
    user_reacted: Boolean
  }

  type Comment {
    id: ID,
    time: String,
    user: User,
    text: String,
    edited: Boolean
  }

  type Query {
    getToken(username: String!, password: String!, userPlatform: String): String
    sendConfirmationEmail: String
    logout: User
    refreshToken: String
    getUserData(id: String): User
    getUserFeed(page: Int!, perPage: Int!): [Post]
    getPostComments(page: Int!, perPage: Int!, id: String): [Comment]
  }

  type Mutation {
    registerUser(name: String!, surname: String!, birthdate: String!, email: String!, username: String!, password: String!, profile_pic_mediaid: String, profile_type: ProfileType!, profile_privacy_type: ProfilePrivacyType!): User
    confirmAccount(user_id: String!, code: Int!): User
    editUser(name: String!, surname: String!, email: String!, username: String!, password: String!, profile_pic_mediaid: String, profile_type: ProfileType!, profile_privacy_type: ProfilePrivacyType!): User
    createPost(text: String!, mediaid: String): Post
    followUser(id: String!): User
    acceptFollowRequest(userid: String!): User
    deletePost(id: String!): Post
    editPost(id: String!, text: String!): Post
    reactPost(id: String!): Post
    commentPost(id: String!, text: String!): Post
  }
`;

module.exports = typeDefs;