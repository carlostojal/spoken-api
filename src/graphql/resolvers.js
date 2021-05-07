const getCookieByName = require("../helpers/getCookieByName");
const getToken = require("../resolvers/getToken");
const sendConfirmationEmail = require("../resolvers/sendConfirmationEmail");
const logout = require("../resolvers/logout");
const refreshToken = require("../resolvers/refreshToken");
const getUserData = require("../resolvers/getUserData");
const getUserFeed = require("../resolvers/getUserFeed");
const getUserPosts = require("../resolvers/getUserPosts");
const getFollowRequests = require("../resolvers/getFollowRequests");
const getPostComments = require("../resolvers/getPostComments");
const userSearch = require("../resolvers/userSearch");
const getSessions = require("../resolvers/getSessions");
const registerUser = require("../resolvers/registerUser");
const confirmAccount = require("../resolvers/confirmAccount");
const editUser = require("../resolvers/editUser");
const createPost = require("../resolvers/createPost");
const followUser = require("../resolvers/followUser");
const acceptFollowRequest = require("../resolvers/acceptFollowRequest");
const ignoreFollowRequest = require("../resolvers/ignoreFollowRequest");
const deletePost = require("../resolvers/deletePost");
const editPost = require("../resolvers/editPost");
const promotePost = require("../resolvers/promotePost");
const reactPost = require("../resolvers/reactPost");
const commentPost = require("../resolvers/commentPost");
const sharePost = require("../resolvers/sharePost");
const setExpoPushToken = require("../resolvers/setExpoPushToken");
const deleteSessionById = require("../resolvers/deleteSessionById");
const capturePostAttention = require("../resolvers/capturePostAttention");

const resolvers = {
  Query: {
    // get user tokens from username and password
    getToken: async (parent, args, context, info) => {
      const tokens = await getToken(args.username, args.password, args.userPlatform, context.req.connection.remoteAddress, context.req.headers["user-agent"], args.pushToken);
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
      const tokens = await refreshToken(refresh_token);
      // send new refresh token through cookies
      context.res.cookie("refresh_token", tokens.refresh_token.value, {
        maxAge: process.env.REFRESH_TOKEN_DURATION * 24 * 3600 * 1000,
        httpOnly: true
      });
      return tokens.access_token.value;
    },

    // get user data from ID or for the current user
    getUserData: (parent, args, context, info) => {
      return getUserData(args.id, context.user);
    },

    // get user feed posts
    getUserFeed: (parent, args, context, info) => {
      return getUserFeed(context.user);
    },

    getUserPosts: (parent, args, context, info) => {
      return getUserPosts(args.page, args.perPage, args.user_id, context.user);
    },

    getFollowRequests: (parent, args, context, info) => {
      return getFollowRequests(context.user);
    },

    getPostComments: (parent, args, context, info) => {
      return getPostComments(args.id, context.user);
    },

    userSearch: (parent, args, context, info) => {
      return userSearch(args.query, context.user);
    },

    getSessions: (parent, args, context, info) => {
      return getSessions(context.user);
    }

  },

  Mutation: {
    // registers a new user
    registerUser: (parent, args, context, info) => {
      return registerUser(args.name, args.surname, args.birthdate, args.email, args.username, args.password, args.profile_type, args.profile_privacy_type);
    },

    confirmAccount: (parent, args, context, info) => {
      return confirmAccount(args.username, args.code);
    },

    // edit current user data
    editUser: (parent, args, context, info) => {
      return editUser(args.name, args.surname, args.email, args.username, args.password, args.profile_pic, args.profile_type, args.profile_privacy_type, context.user);
    },

    // creates a new post
    createPost: (parent, args, context, info) => {
      return createPost(args.text, args.media_id, context.user);
    },

    // starts following user
    followUser: (parent, args, context, info) => {
      return followUser(args.id, context.user);
    },

    // accepts follow request from user ID
    acceptFollowRequest: (parent, args, context, info) => {
      return acceptFollowRequest(args.user_id, context.user);
    },

    ignoreFollowRequest: (parent, args, context, info) => {
      return ignoreFollowRequest(args.user_id, context.user);
    },

    // deletes post from post ID
    deletePost: (parent, args, context, info) => {
      return deletePost(args.id, context.user);
    },

    // edits post from post ID. updates text
    editPost: (parent, args, context, info) => {
      return editPost(args.id, args.text, context.user);
    },

    promotePost: (parent, args, context, info) => {
      return promotePost(args.id, context.user, context.mysqlPool);
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

    capturePostAttention: (parent, args, context, info) => {
      return capturePostAttention(args.id, args.view_time, args.reacted, args.shared, context.user, context.mysqlPool);
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
