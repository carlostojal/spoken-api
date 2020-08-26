const getToken = require("../helpers/getToken");
const logout = require("../helpers/logout");
const refreshToken = require("../helpers/refreshToken");
const getCookieByName = require("../helpers/getCookieByName");
const getUserData = require("../helpers/getUserData");
const getUserFeed = require("../helpers/getUserFeed");
const registerUser = require("../helpers/registerUser");
const editUser = require("../helpers/editUser");
const createPost = require("../helpers/createPost");
const followUser = require("../helpers/followUser");
const unfollowUser = require("../helpers/unfollowUser");
const acceptFollowRequest = require("../helpers/acceptFollowRequest");
const deletePost = require("../helpers/deletePost");
const editPost = require("../helpers/editPost");
const reactPost = require("../helpers/reactPost");
const commentPost = require("../helpers/commentPost");

const resolvers = {
  Query: {
    // get user tokens from username and password
    getToken: (parent, args, context, info) => {
      return getToken(args.username, args.password, context);
    },

    // logout
    logout: (parent, args, context, info) => {
      const refresh_token = getCookieByName("refresh_token", context.req.headers.cookie);
      const access_token = context.req.headers.authorization;
      return logout(refresh_token, access_token, context.res);
    },

    // provide new access token from refresh token
    refreshToken: (parent, args, context, info) => {
      const refresh_token = getCookieByName("refresh_token", context.req.headers.cookie);
      return refreshToken(refresh_token, context.res);
    },

    // get user data from ID or for the current user
    getUserData: (parent, args, context, info) => {
      return getUserData(args.id, context);
    },

    // get user feed posts
    getUserFeed: (parent, args, context, info) => {
      return getUserFeed(args.page, args.perPage, context);
    }
  },

  Mutation: {
    // registers a new user
    registerUser: (parent, args, context, info) => {
      return registerUser(args.name, args.surname, args.birthdate, args.email, args.username, args.password, args.profile_type, args.profile_privacy_type);
    },

    // edit current user data
    editUser: (parent, args, context, info) => {
      return editUser(args.name, args.surname, args.email, args.username, args.password, args.profile_pic_media_id, args.profile_privacy_type);
    },

    // creates a new post
    createPost: (parent, args, context, info) => {
      return createPost(args.text, args.media_id, context);
    },

    // starts following user
    followUser: (parent, args, context, info) => {
      return followUser(args.id, context);
    },

    // stops following user
    unfollowUser: (parent, args, context, info) => {
      return unfollowUser(args.id, context);
    },

    // accepts follow request from user ID
    acceptFollowRequest: (parent, args, context, info) => {
      return acceptFollowRequest(args.user_id, context);
    },

    // deletes post from post ID
    deletePost: (parent, args, context, info) => {
      return deletePost(args.id, context);
    },

    // edits post from post ID. updates text
    editPost: (parent, args, context, info) => {
      return editPost(args.id, args.text, context);
    },

    // react to post
    reactPost: (parent, args, context, info) => {
      return reactPost(args.id, context.user);
    },

    // create comment in post
    commentPost: (parent, args, context, info) => {
      return commentPost(args.id, context.user, args.text);
    }
  }
}

module.exports = resolvers;