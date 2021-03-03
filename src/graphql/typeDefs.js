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
    is_followed: Boolean
    is_himself: Boolean
  }

  type Post {
    id: ID,
    poster: User,
    time: String,
    text: String,
    media: Media
    edited: Boolean,
    original_post: Post,
    user_reacted: Boolean
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

  type Session {
    id: ID,
    created_at: String,
    expires_at: String,
    user_platform: String
  }

  type Query {
    getToken(username: String!, password: String!, userPlatform: String, pushToken: String): String
    sendConfirmationEmail(username: String!, password: String!): String
    logout: User
    refreshToken: String
    getUserData(id: Int): User
    getUserFeed(page: Int!, perPage: Int!): [Post]
    getUserPosts(page: Int!, perPage: Int!, user_id: Int): [Post]
    getFollowRequests: [FollowRelation]
    getFollowers: [FollowRelation]
    getFollowing: [FollowRelation]
    getPostReactions(page: Int!, perPage: Int!, id: Int!): [User]
    getPostComments(page: Int!, perPage: Int!, id: Int!): [Post]
    userSearch(query: String!): [User]
    getSessions: [Session]
  }

  type Mutation {
    registerUser(name: String!, surname: String!, birthdate: String!, email: String!, username: String!, password: String!, profile_pic_mediaid: Int, profile_type: ProfileType!, profile_privacy_type: ProfilePrivacyType!): User
    confirmAccount(username: String!, code: Int!): User
    editUser(name: String!, surname: String!, email: String!, username: String!, password: String!, profile_pic_mediaid: Int, profile_type: ProfileType!, profile_privacy_type: ProfilePrivacyType!): User
    createPost(text: String!, media_id: Int): Post
    followUser(id: String!): User
    acceptFollowRequest(user_id: Int!): User
    deletePost(id: Int!): Post
    editPost(id: Int!, text: String!): Post
    reactPost(id: Int!): Post
    commentPost(id: Int!, text: String!): Post
    sharePost(id: Int!): Post
    setExpoPushToken(token: String!): Boolean
    deleteSessionById(session_id: Int!): String
  }
`;

module.exports = typeDefs;
