const bcrypt = require("bcrypt");
const { AuthenticationError } = require("apollo-server");
const getToken = require("../helpers/getToken");
const getUserData = require("../helpers/getUserData");
const User = require("../models/User");
const Post = require("../models/Post");
const FollowRelation = require("../models/FollowRelation");

exports.resolvers = {
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
      return new Promise((resolve, reject) => {

        if(!context.user)
          return reject(new AuthenticationError("Bad authentication."));

        // get all posts which poster ID is in the current user following array
        const query = User.findOne({ _id: context.user._id });
        query.populate({
          path: "following",
          populate: {
            path: "follows"
          }
        });
        query.exec((error, user) => {
          if (error) return reject(error);

          let followingArray = [];

          user.following.map((relation) => {
            if(relation.accepted)
              followingArray.push(relation.follows._id);
          });

          followingArray.push(context.user._id);

          const query = Post.find({ poster: { $in: followingArray }});
          query.populate("poster", "_id name surname username profile_pic_url");
          query.limit(args.perPage);
          query.skip(args.perPage * (args.page - 1));
          query.sort({time: -1});
          query.exec((error, posts) => {
            if (error) return reject(error);
            resolve(posts);
          });
        });
      });
    }
  },

  Mutation: {
    // registers a new user
    registerUser: (parent, args, context, info) => {
      return new Promise((resolve, reject) => {
        bcrypt.genSalt(parseInt(process.env.HASH_SALT_ROUNDS), (err, salt) => {
          if (err) reject(err);

          bcrypt.hash(args.password, salt, (err, hash_password) => {
            if (err) reject(err);

            const user = new User({
              access_token: {
                value: null,
                expiry: null
              },
              refresh_token: {
                value: null,
                expiry: null
              },
              name: args.name,
              surname: args.surname,
              birthdate: new Date(parseInt(args.birthdate)).getTime().toString(),
              email: args.email,
              email_confirmed: false,
              username: args.username,
              password: hash_password,
              profile_pic_url: null,
              profile_type: args.profile_type || "public",
              posts: [],
              following:  [],
              followers: []
            });

            user.save().then((result) => {
              console.log("User registered.");
              resolve(result);
            }).catch((err) => {
              reject(err);
            });

          });
        });
      });
    },

    // creates a new post
    createPost: (parent, args, context, info) => {
      return new Promise((resolve, reject) => {

        if(!context.user)
          reject(new AuthenticationError("Bad authentication"));

        const post = new Post({ // create post
          poster: context.user._id,
          time: Date.now().toString(),
          text: args.text
        });

        post.save().then((result) => { // save post
          console.log("Post made");
          let query = Post.findOne({_id: result._id}, "_id time text"); // find post from ID
          query.populate("poster", "name surname username profile_pic_url"); // populate poster info from poster ID
          query.exec((err, post) => {
            if (err) reject(err);
            User.findOne({_id: context.user._id}, (err, result) => { // update user posts array
              if (err) reject(err);
              result.posts.push(post._id);
              result.save().then((err, result) => {
                console.log("Post created.");
                resolve(post);
              })
            });
          });
        }).catch((err) => {
          reject(err);
        });
      });
    },

    // starts following user
    followUser: (parent, args, context, info) => {
      return new Promise((resolve, reject) => {

        if(!context.user)
          reject(new AuthenticationError("Bad authentication"));

        if(!args.id)
          reject(new Error("No user ID provided"));

        if(args.id == context.user._id)
          reject(new Error("User can't follow himself"));

        // find user from provided ID
        User.findOne({ _id: args.id }).then((user) => {

          if(!user)
            reject(new Error("User doesn't exist."));

          const accepted = user.profile_type == "public";

          User.findOne({ _id: context.user._id }).then((currentUser) => {
            
            // create follow relation
            const followRelation = new FollowRelation({
              user: context.user._id,
              follows: args.id,
              accepted
            });

            followRelation.save().then((result) => {
              // add follow relation to the current user following array
              currentUser.following.push(result._id);
              currentUser.save().then(() => {
                // add follow relation to the other user followers array
                user.followers.push(result._id);
                user.save().then(() => {
                  console.log("User followed");
                  resolve(user);
                }).catch((error) => {
                  reject(error);
                })
              }).catch((error) => {
                reject(error);
              });
              resolve(user);
            }).catch((error) => {
              reject(error);
            });

          }).catch((error) => {
            reject(error);
          });

        }).catch((error) => {
          reject(error);
        });
      });
    },

    // stops following user
    unfollowUser: (parent, args, context, info) => {
      return new Promise((resolve, reject) => {

        if(!context.user)
          reject(new AuthenticationError("Bad authentication"));

        if(!args.id)
          reject(new Error("No user ID provided"));

          FollowRelation.findOne({ user: context.user._id, follows: args.id }).then((followRelation) => {

            if(!followRelation)
              return reject(new Error("Relation not existent"));

            // find user that will be unfollowed
            User.findOne({ _id: args.id }).then((user) => {

              if(!user)
                reject(new Error("User doesn't exist."));
              
              // remove follow relation from followers array
              for(let i = 0; i < user.followers.length; i++) {
                if(user.followers[i]._id == followRelation._id) {
                  user.followers.splice(i, 1);
                  i--;
                }
              }

              user.save().then(() => {

                // find current session user
                User.findOne({ _id: context.user._id }).then((currentUser) => {

                  for(let i = 0; i < currentUser.following.length; i++) {
                    if(currentUser.following[i]._id == followRelation._id) {
                      user.followers.splice(i, 1);
                      i--;
                    }
                  }

                  currentUser.save().then(() => {
                    // resolve with the unfollowed user
                    console.log("User unfollowed.");
                    resolve(user);
                  }).catch((error) => {
                    reject(error);
                  })
      
                }).catch((error) => {
                  reject(error);
                });

              }).catch((error) => {
                reject(error);
              });
            }).catch((error) => {
              reject(error);
            });
          }).catch((error) => {
            reject(error);
          });
        });          
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
