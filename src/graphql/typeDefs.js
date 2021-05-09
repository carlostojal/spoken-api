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

  enum AnalyticsType {
    views_by_hour
    reactions_by_user_interests
    views_by_os
    views_by_platform
    views_by_age_range
    reactions_by_age_range
    views_promoted_vs_regular
  }

  type User {
    _id: ID,
    name: String,
    surname: String,
    birthdate: String,
    username: String,
    profile_pic: Media,
    profile_type: String,
    profile_privacy_type: String
    is_followed: Boolean
    is_himself: Boolean
  }

  type Post {
    _id: ID,
    poster: User,
    time: String,
    text: String,
    media: Media,
    reactions: [User],
    comments: [Post],
    edited: Boolean,
    original_post: Post,
    promoted: Boolean,
    tags: [Tag]
  }

  type Tag {
    _id: ID,
    name: String
  }

  type Media {
    _id: ID,
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
    _id: ID,
    created_at: String,
    expires_at: String,
    user_platform: String
  }
  
  type Analytics {
    labels: [String],
    values: [Float]
  }

  type Query {
    getToken(username: String!, password: String!, userPlatform: String, pushToken: String): String
    sendConfirmationEmail(username: String!, password: String!): String
    logout: User
    refreshToken: String
    getUserData(id: ID): User
    getUserFeed: [Post]
    getUserPosts(user_id: ID): [Post]
    getFollowRequests: [FollowRelation]
    getPostComments(id: ID!): [Post]
    userSearch(query: String!): [User]
    getSessions: [Session]
    getPostAnalytics(id: ID!, type: AnalyticsType!): Analytics
  }

  type Mutation {
    registerUser(name: String!, surname: String!, birthdate: String!, email: String!, username: String!, password: String!, profile_pic_media_id: Int, profile_type: ProfileType!, profile_privacy_type: ProfilePrivacyType!): User
    confirmAccount(username: String!, code: Int!): User
    editUser(name: String!, surname: String!, email: String!, username: String!, password: String!, profile_pic: ID, profile_type: ProfileType!, profile_privacy_type: ProfilePrivacyType!): User
    createPost(text: String!, media_id: ID): Post
    followUser(id: String!): User
    acceptFollowRequest(user_id: ID!): User
    ignoreFollowRequest(user_id: ID!): User
    deletePost(id: ID!): Post
    editPost(id: ID!, text: String!): Post
    promotePost(id: ID!): String
    reactPost(id: ID!, user_lat: Float, user_long: Float, user_platform: String, user_os: String): Post
    commentPost(id: ID!, text: String!): Post
    collectPostView(id: ID!, user_lat: Float, user_long: Float, user_platform: String, user_os: String, view_time: Float): Post
    addPostTag(tag_id: ID!, post_id: ID!): Tag
    deletePostTag(tag_id: ID!, post_id: ID!): Tag
    setExpoPushToken(token: String!): Boolean
    deleteSessionById(session_id: ID!): Session
  }
`;

module.exports = typeDefs;
