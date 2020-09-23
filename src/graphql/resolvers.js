const getToken = require("../resolvers/getToken");
const sendConfirmationEmail = require("../resolvers/sendConfirmationEmail");
const logout = require("../resolvers/logout");
const refreshToken = require("../resolvers/refreshToken");
const getUserData = require("../resolvers/getUserData");
const getUserFeed = require("../resolvers/getUserFeed");
const registerUser = require("../resolvers/registerUser");
const confirmAccount = require("../resolvers/confirmAccount");
const editUser = require("../resolvers/editUser");
const createPost = require("../resolvers/createPost");
const followUser = require("../resolvers/followUser");
const acceptFollowRequest = require("../resolvers/acceptFollowRequest");
const editPost = require("../resolvers/editPost");
const reactPost = require("../resolvers/reactPost");
const commentPost = require("../resolvers/commentPost");
const deletePost = require("../resolvers/deletePost");
const getCookieByName = require("../helpers/getCookieByName");

const resolvers = {
  Query: {
    // get user tokens from username and password
    getToken: async (parent, args, context, info) => {
      const tokens = await getToken(args.username, args.password, args.userPlatform, context.req.connection.remoteAddress, context.req.headers["user-agent"], context.redisClient);
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
      const tokens = await refreshToken(refresh_token, context.redisClient);
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

    confirmAccount: (parent, args, context, info) => {
      return confirmAccount(args.user_id, args.code);
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