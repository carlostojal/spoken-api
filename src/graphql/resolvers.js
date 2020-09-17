const getToken = require("../helpers/getToken");
const sendConfirmationEmail = require("../helpers/sendConfirmationEmail");
const logout = require("../helpers/logout");
const refreshToken = require("../helpers/refreshToken");
const getCookieByName = require("../helpers/getCookieByName");
const getUserData = require("../helpers/getUserData");
const getUserFeed = require("../helpers/getUserFeed");
const registerUser = require("../helpers/registerUser");
const editUser = require("../helpers/editUser");
const createPost = require("../helpers/createPost");
const followUser = require("../helpers/followUser");
const acceptFollowRequest = require("../helpers/acceptFollowRequest");
const deletePost = require("../helpers/deletePost");
const editPost = require("../helpers/editPost");
const reactPost = require("../helpers/reactPost");
const commentPost = require("../helpers/commentPost");

const resolvers = {
  Query: {
    // get user tokens from username and password
    getToken: async (parent, args, context, info) => {
      const tokens = await getToken(args.username, args.password, context.req.connection.remoteAddress, context.req.headers["user-agent"], context.redisClient);
      // send refresh token as httpOnly cookie
      context.res.cookie("refresh_token", tokens.refresh_token.value, {
        expires: new Date(tokens.refresh_token.expiry),
        httpOnly: true
      });
      return tokens.access_token.value;
    },

    sendConfirmationEmail: async (parent, args, context, info) => {
      try {
        await sendConfirmationEmail(context.user);
      } catch(e) {
        console.error(e);
        return e;
      }
      return context.user.email;
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
      const tokens = await refreshToken(refresh_token, context.req.connection.remoteAddress, context.req.headers["user-agent"], context.redisClient);
      // send new refresh token through cookies
      context.res.cookie("refresh_token", tokens.refresh_token.value, {
        expires: new Date(tokens.refresh_token.expiry),
        httpOnly: true
      });
      return tokens.access_token.value;
    },

    // get user data from ID or for the current user
    getUserData: (parent, args, context, info) => {
      return getUserData(args.id, context.user, context.redisClient);
    },

    // get user feed posts
    getUserFeed: (parent, args, context, info) => {
      return getUserFeed(args.page, args.perPage, context.user, context.redisClient);
    },

    getPostComments: (parent, args, context, info) => {
      return getPostComments(args.page, args.perPage, args.id, context.user, context.redisClient);
    }
  },

  Mutation: {
    // registers a new user
    registerUser: (parent, args, context, info) => {
      return registerUser(args.name, args.surname, args.birthdate, args.email, args.username, args.password, args.profile_type, args.profile_privacy_type);
    },

    // edit current user data
    editUser: (parent, args, context, info) => {
      return editUser(args.name, args.surname, args.email, args.username, args.password, args.profile_pic_media_id, args.profile_type, args.profile_privacy_type, context.user, context.redisClient);
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

    // deletes post from post ID
    deletePost: (parent, args, context, info) => {
      return deletePost(args.id, context.user);
    },

    // edits post from post ID. updates text
    editPost: (parent, args, context, info) => {
      return editPost(args.id, args.text, context.user);
    },

    // react to post
    reactPost: (parent, args, context, info) => {
      return reactPost(args.id, context.user, context.redisClient);
    },

    // create comment in post
    commentPost: (parent, args, context, info) => {
      return commentPost(args.id, context.user, args.text, context.redisClient);
    }
  }
}

module.exports = resolvers;