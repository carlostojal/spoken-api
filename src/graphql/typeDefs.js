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
    media: Media
    edited: Boolean,
    original_post: Post,
    user_reacted: Boolean,
    promoted: Boolean,
    tags: [PostTags]
  }

  type PostTags {
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

  type Query {
    getToken(username: String!, password: String!, userPlatform: String, pushToken: String): String
    sendConfirmationEmail(username: String!, password: String!): String
    logout: User
    refreshToken: String
    getUserData(id: ID): User
    getUserFeed: [Post]
    getUserPosts(user_id: ID): [Post]
    getFollowRequests: [FollowRelation]
    getPostComments(id: Int!): [Post]
    userSearch(query: String!): [User]
    getSessions: [Session]
  }

  type Mutation {
    registerUser(name: String!, surname: String!, birthdate: String!, email: String!, username: String!, password: String!, profile_pic_media_id: Int, profile_type: ProfileType!, profile_privacy_type: ProfilePrivacyType!): User
    confirmAccount(username: String!, code: Int!): User
    editUser(name: String!, surname: String!, email: String!, username: String!, password: String!, profile_pic_mediaid: Int, profile_type: ProfileType!, profile_privacy_type: ProfilePrivacyType!): User
    createPost(text: String!, media_id: Int): Post
    followUser(id: String!): User
    acceptFollowRequest(user_id: Int!): User
    ignoreFollowRequest(user_id: Int!): User
    deletePost(id: Int!): Post
    editPost(id: Int!, text: String!): Post
    promotePost(id: Int!): String
    reactPost(id: Int!): Post
    commentPost(id: Int!, text: String!): Post
    addPostTag(tag_id: Int!, post_id: Int!): PostTags
    deletePostTag(tag_id: Int!, post_id: Int!): PostTags
    sharePost(id: Int!): Post
    capturePostAttention(id: Int!, view_time: Float!, reacted: Boolean!, shared: Boolean!): Boolean
    setExpoPushToken(token: String!): Boolean
    deleteSessionById(session_id: Int!): String
  }
`;

module.exports = typeDefs;
