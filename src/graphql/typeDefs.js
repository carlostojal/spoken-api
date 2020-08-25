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
    posts: [Post],
    n_following: Int,
    following: [FollowRelation],
    n_followers: Int,
    followers: [FollowRelation]
  }

  type Post {
    id: ID,
    poster: User,
    time: String,
    text: String,
    media_url: String,
    edited: Boolean
  }

  type FollowRelation {
    user: User,
    follows: User,
    accepted: Boolean
  }

  type Query {
    getToken(username: String!, password: String!): String
    logout: User
    refreshToken: String
    getUserData(id: String): User
    getUserFeed(page: Int!, perPage: Int!): [Post]
  }

  type Mutation {
    registerUser(name: String!, surname: String!, birthdate: String!, email: String!, username: String!, password: String!, profile_pic_media_id: String, profile_type: ProfileType!, profile_privacy_type: ProfilePrivacyType!): User
    editUser(name: String!, surname: String!, email: String!, username: String!, password: String!, profile_pic_media_id: String, profile_privacy_type: ProfilePrivacyType!): User
    createPost(text: String!, media_id: String): Post
    followUser(id: String!): User
    unfollowUser(id: String!): User
    acceptFollowRequest(user_id: String!): User
    deletePost(id: String!): Post
    editPost(id: String!, text: String!): Post
    reactPost(id: String!): Post
  }
`;

module.exports = typeDefs;