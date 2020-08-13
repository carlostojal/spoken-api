const bcrypt = require("bcrypt");
const { AuthenticationError } = require("apollo-server");
const getToken = require("../helpers/getToken");
const getUserData = require("../helpers/getUserData");
const getUserFeed = require("../helpers/getUserFeed");
const registerUser = require("../helpers/registerUser");
const createPost = require("../helpers/createPost");
const followUser = require("../helpers/followUser");
const unfollowUser = require("../helpers/unfollowUser");
const User = require("../models/User");
const Post = require("../models/Post");
const FollowRelation = require("../models/FollowRelation");
const { create } = require("../models/User");
const followRelation = require("../schemas/FollowRelation");

const resolvers = {
  Query: {
    // get user tokens from username and password
    getToken: (parent, args, context, info) => {
      return getToken(args.username, args.password, context);
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
      return registerUser(args.name, args.surname, args.birthdate, args.email, args.username, args.password, args.profile_type);
    },

    // creates a new post
    createPost: (parent, args, context, info) => {
      return createPost(args.text, context);
    },

    // starts following user
    followUser: (parent, args, context, info) => {
      return followUser(args.id, context);
    },

    // stops following user
    unfollowUser: (parent, args, context, info) => {
      return unfollowUser(args.id, context);
    },

    acceptFollowRequest: (parent, args, context, info) => {
      return new Promise((resolve, reject) => {

        if(!context.user)
          reject(new AuthenticationError("Bad authentication"));

        if(!args.user_id)
          reject(new Error("No user ID provided"));

        const query = FollowRelation.findOne({ user: args.user_id, follows: context.user._id });
        query.populate("user");
        query.exec((error, relation) => {

          if(error) 
            reject(error);
          
          if(!relation)
            return reject(new Error("Relation not existent."));

          relation.accepted = true;

          relation.save().then(() => {
            console.log("Follow request accepted.");
            resolve(relation.user);
          }).catch((error) => {
            reject(error);
          });
        });
      });
    }
  }
}

module.exports = resolvers;