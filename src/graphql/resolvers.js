const getCookieByName = require("../helpers/getCookieByName");

const resolvers = {
  Query: {
    // get user tokens from username and password
    getToken: async (parent, args, context, info) => {
      const getToken = require("../resolvers/getToken");
      const tokens = await getToken(args.username, args.password, args.userPlatform, context.req.connection.remoteAddress, context.req.headers["user-agent"], args.pushToken);
      // send refresh token as httpOnly cookie
      context.res.cookie("refresh_token", tokens.refresh_token.value, {
        maxAge: process.env.REFRESH_TOKEN_DURATION * 24 * 3600 * 1000,
        httpOnly: true
      });
      return tokens.access_token.value;
    },

    sendConfirmationEmail: async (parent, args, context, info) => {
      const sendConfirmationEmail = require("../resolvers/sendConfirmationEmail");
      try {
        await sendConfirmationEmail(args.username, args.password);
      } catch(e) {
        return e;
      }
      return null;
    },

    // logout
    logout: (parent, args, context, info) => {
      const logout = require("../resolvers/logout");
      const refresh_token = getCookieByName("refresh_token", context.req.headers.cookie);
      const access_token = context.req.headers.authorization;
      context.res.cookie("refresh_token", null);
      return logout(refresh_token, access_token, context.user);
    },

    // provide new access token from refresh token
    refreshToken: async (parent, args, context, info) => {
      const refreshToken = require("../resolvers/refreshToken");
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
      const getUserData = require("../resolvers/getUserData");
      return getUserData(args.id, context.user);
    },

    // get user feed posts
    getUserFeed: (parent, args, context, info) => {
      const getUserFeed = require("../resolvers/getUserFeed");
      return getUserFeed(args.page, args.perPage, context.user);
    },

    getUserPosts: (parent, args, context, info) => {
      const getUserPosts = require("../resolvers/getUserPosts");
      return getUserPosts(args.page, args.perPage, args.user_id, context.user);
    },

    getFollowRequests: (parent, args, context, info) => {
      const getFollowRequests = require("../resolvers/getFollowRequests");
      return getFollowRequests(context.user);
    },

    getFollowers: (parent, args, context, info) => {
      const getFollowers = require("../resolvers/getFollowers");
      return getFollowers(context.user);
    },

    getFollowing: (parent, args, context, info) => {
      const getFollowing = require("../resolvers/getFollowing");
      return getFollowing(context.user);
    },

    getPostReactions: (parent, args, context, info) => {
      const getPostReactions = require("../resolvers/getPostReactions");
      return getPostReactions(args.page, args.perPage, args.id, context.user);
    },

    getPostComments: (parent, args, context, info) => {
      const getPostComments = require("../resolvers/getPostComments");
      return getPostComments(args.page, args.perPage, args.id, context.user);
    },

    userSearch: (parent, args, context, info) => {
      const userSearch = require("../resolvers/userSearch");
      return userSearch(args.query, context.user);
    },

    getSessions: (parent, args, context, info) => {
      const getSessions = require("../resolvers/getSessions");
      return getSessions(context.user);
    }

  },

  Mutation: {
    // registers a new user
    registerUser: (parent, args, context, info) => {
      const registerUser = require("../resolvers/registerUser");
      return registerUser(args.name, args.surname, args.birthdate, args.email, args.username, args.password, args.profile_type, args.profile_privacy_type);
    },

    confirmAccount: (parent, args, context, info) => {
      const confirmAccount = require("../resolvers/confirmAccount");
      return confirmAccount(args.username, args.code);
    },

    // edit current user data
    editUser: (parent, args, context, info) => {
      const editUser = require("../resolvers/editUser");
      return editUser(args.name, args.surname, args.email, args.username, args.password, args.profile_pic_media_id, args.profile_type, args.profile_privacy_type, context.user, context.redisClient);
    },

    // creates a new post
    createPost: (parent, args, context, info) => {
      const createPost = require("../resolvers/createPost");
      return createPost(args.text, args.media_id, context.user);
    },

    // starts following user
    followUser: (parent, args, context, info) => {
      const followUser = require("../resolvers/followUser");
      return followUser(args.id, context.user);
    },

    // accepts follow request from user ID
    acceptFollowRequest: (parent, args, context, info) => {
      const acceptFollowRequest = require("../resolvers/acceptFollowRequest");
      return acceptFollowRequest(args.user_id, context.user);
    },

    // deletes post from post ID
    deletePost: (parent, args, context, info) => {
      const deletePost = require("../resolvers/deletePost");
      return deletePost(args.id, context.user);
    },

    // edits post from post ID. updates text
    editPost: (parent, args, context, info) => {
      const editPost = require("../resolvers/editPost");
      return editPost(args.id, args.text, context.user);
    },

    // react to post
    reactPost: (parent, args, context, info) => {
      const reactPost = require("../resolvers/reactPost");
      return reactPost(args.id, context.user);
    },

    // create comment in post
    commentPost: (parent, args, context, info) => {
      const commentPost = require("../resolvers/commentPost");
      return commentPost(args.id, context.user, args.text);
    },

    // shares a existing post
    sharePost: (parent, args, context, info) => {
      const sharePost = require("../resolvers/sharePost");
      return sharePost(args.id, context.user);
    },

    setExpoPushToken: (parent, args, context, info) => {
      const setExpoPushToken = require("../resolvers/setExpoPushToken");
      return setExpoPushToken(args.token, context.user);
    }
  }
}

module.exports = resolvers;
