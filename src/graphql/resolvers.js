const getCookieByName = require("../helpers/getCookieByName");
const getToken = require("../resolvers/getToken");
const sendConfirmationEmail = require("../resolvers/sendConfirmationEmail");
const logout = require("../resolvers/logout");
const refreshToken = require("../resolvers/refreshToken");
const getUserData = require("../resolvers/getUserData");
const getUserFeed = require("../resolvers/getUserFeed");
const getUserPosts = require("../resolvers/getUserPosts");
const getFollowRequests = require("../resolvers/getFollowRequests");
const getFollowers = require("../resolvers/getFollowers");
const getFollowing = require("../resolvers/getFollowing");
const getPostReactions = require("../resolvers/getPostReactions");
const getPostComments = require("../resolvers/getPostComments");
const userSearch = require("../resolvers/userSearch");
const getSessions = require("../resolvers/getSessions");
const registerUser = require("../resolvers/registerUser");
const confirmAccount = require("../resolvers/confirmAccount");
const editUser = require("../resolvers/editUser");
const createPost = require("../resolvers/createPost");
const followUser = require("../resolvers/followUser");
const acceptFollowRequest = require("../resolvers/acceptFollowRequest");
const deletePost = require("../resolvers/deletePost");
const editPost = require("../resolvers/editPost");
const reactPost = require("../resolvers/reactPost");
const commentPost = require("../resolvers/commentPost");
const sharePost = require("../resolvers/sharePost");
const setExpoPushToken = require("../resolvers/setExpoPushToken");
const deleteSessionById = require("../resolvers/deleteSessionById");

const resolvers = {
  Query: {
    // get user tokens from username and password
    getToken: async (parent, args, context, info) => {
      const tokens = await getToken(args.username, args.password, args.userPlatform, context.req.connection.remoteAddress, context.req.headers["user-agent"], args.pushToken, context.mysqlPool);
      // send refresh token as httpOnly cookie
      context.res.cookie("refresh_token", tokens.refresh_token.value, {
        maxAge: process.env.REFRESH_TOKEN_DURATION * 24 * 3600 * 1000,
        httpOnly: true
      });
      return tokens.access_token.value;
    },

    sendConfirmationEmail: async (parent, args, context, info) => {
      try {
        await sendConfirmationEmail(args.username, args.password, context.mysqlPool);
      } catch(e) {
        return e;
      }
      return null;
    },

    // logout
    logout: (parent, args, context, info) => {
      const refresh_token = getCookieByName("refresh_token", context.req.headers.cookie);
      const access_token = context.req.headers.authorization;
      context.res.cookie("refresh_token", null);
      return logout(refresh_token, access_token, context.user);
    },

    // provide new access token from refresh token
    refreshToken: async (parent, args, context, info) => {
      // get refresh token from cookies
      const refresh_token = getCookieByName("refresh_token", context.req.headers.cookie);
      // get new tokens from refresh token
      const tokens = await refreshToken(refresh_token, context.mysqlPool);
      // send new refresh token through cookies
      context.res.cookie("refresh_token", tokens.refresh_token.value, {
        maxAge: process.env.REFRESH_TOKEN_DURATION * 24 * 3600 * 1000,
        httpOnly: true
      });
      return tokens.access_token.value;
    },

    // get user data from ID or for the current user
    getUserData: (parent, args, context, info) => {
      return getUserData(args.id, context.user, context.mysqlPool);
    },

    // get user feed posts
    getUserFeed: (parent, args, context, info) => {
      return getUserFeed(args.page, args.perPage, context.user, context.mysqlPool);
    },

    getUserPosts: (parent, args, context, info) => {
      return getUserPosts(args.page, args.perPage, args.user_id, context.user, context.mysqlPool);
    },

    getFollowRequests: (parent, args, context, info) => {
      return getFollowRequests(context.user, context.mysqlPool);
    },

    getFollowers: (parent, args, context, info) => {
      return getFollowers(context.user, context.mysqlPool);
    },

    getFollowing: (parent, args, context, info) => {
      return getFollowing(context.user, context.mysqlPool);
    },

    getPostReactions: (parent, args, context, info) => {
      return getPostReactions(args.page, args.perPage, args.id, context.user, context.mysqlPool);
    },

    getPostComments: (parent, args, context, info) => {
      return getPostComments(args.page, args.perPage, args.id, context.user, context.mysqlPool);
    },

    userSearch: (parent, args, context, info) => {
      return userSearch(args.query, context.user, context.mysqlPool);
    },

    getSessions: (parent, args, context, info) => {
      return getSessions(context.user, context.mysqlPool);
    }

  },

  Mutation: {
    // registers a new user
    registerUser: (parent, args, context, info) => {
      return registerUser(args.name, args.surname, args.birthdate, args.email, args.username, args.password, args.profile_type, args.profile_privacy_type, context.mysqlPool);
    },

    confirmAccount: (parent, args, context, info) => {
      return confirmAccount(args.username, args.code, context.mysqlPool);
    },

    // edit current user data
    editUser: (parent, args, context, info) => {
      return editUser(args.name, args.surname, args.email, args.username, args.password, args.profile_pic_media_id, args.profile_type, args.profile_privacy_type, context.user, context.mysqlPool);
    },

    // creates a new post
    createPost: (parent, args, context, info) => {
      return createPost(args.text, args.media_id, context.user, context.mysqlPool);
    },

    // starts following user
    followUser: (parent, args, context, info) => {
      return followUser(args.id, context.user, context.mysqlPool);
    },

    // accepts follow request from user ID
    acceptFollowRequest: (parent, args, context, info) => {
      return acceptFollowRequest(args.user_id, context.user, context.mysqlPool);
    },

    // deletes post from post ID
    deletePost: (parent, args, context, info) => {
      return deletePost(args.id, context.user, context.mysqlPool);
    },

    // edits post from post ID. updates text
    editPost: (parent, args, context, info) => {
      return editPost(args.id, args.text, context.user, context.mysqlPool);
    },

    // react to post
    reactPost: (parent, args, context, info) => {
      return reactPost(args.id, context.user, context.mysqlPool);
    },

    // create comment in post
    commentPost: (parent, args, context, info) => {
      return commentPost(args.id, context.user, args.text, context.mysqlPool);
    },

    // shares a existing post
    sharePost: (parent, args, context, info) => {
      return sharePost(args.id, context.user, context.mysqlPool);
    },

    setExpoPushToken: (parent, args, context, info) => {
      return setExpoPushToken(args.token, context.user, context.mysqlPool);
    },

    deleteSessionById: (parent, args, context, info) => {
      return deleteSessionById(args.session_id, context.user, context.mysqlPool);
    }
  }
}

module.exports = resolvers;
