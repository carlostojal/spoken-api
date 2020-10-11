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
    profile_pic: Media,
    profile_type: String,
    profile_privacy_type: String
  }

  type Post {
    id: ID,
    poster: User,
    time: String,
    text: String,
    media: Media
    edited: Boolean,
    original_post: Post
  }

  type Comment {
    id: ID,
    time: String,
    user: User,
    text: String,
    edited: Boolean
  }

  type Media {
    id: ID,
    url: String,
    is_nsfw: Boolean,
    nsfw_cause: String
  }

  type FollowRelation {
    user: User,
    follows: User,
    accepted: Boolean,
    create_time: String
  }

  type Query {
    getToken(username: String!, password: String!, userPlatform: String): String
    sendConfirmationEmail(username: String!, password: String!): String
    logout: User
    refreshToken: String
    getUserData(id: String): User
    getUserFeed(page: Int!, perPage: Int!): [Post]
    getFollowRequests: [FollowRelation]
    getFollowers: [FollowRelation]
    getFollowing: [FollowRelation]
    getPostReactions(page: Int!, perPage: Int!, id: String): [User]
    getPostComments(page: Int!, perPage: Int!, id: String!): [Post]
  }

  type Mutation {
    registerUser(name: String!, surname: String!, birthdate: String!, email: String!, username: String!, password: String!, profile_pic_mediaid: String, profile_type: ProfileType!, profile_privacy_type: ProfilePrivacyType!): User
    confirmAccount(user_id: String!, code: Int!): User
    editUser(name: String!, surname: String!, email: String!, username: String!, password: String!, profile_pic_mediaid: String, profile_type: ProfileType!, profile_privacy_type: ProfilePrivacyType!): User
    createPost(text: String!, media_id: String): Post
    followUser(id: String!): User
    acceptFollowRequest(user_id: String!): User
    deletePost(id: String!): Post
    editPost(id: String!, text: String!): Post
    reactPost(id: String!): Post
    commentPost(id: String!, text: String!): Post
    sharePost(id: String!): Post
  }
`;

module.exports = typeDefs;
