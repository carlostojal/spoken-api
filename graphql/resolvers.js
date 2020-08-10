const bcrypt = require("bcrypt");
const createToken = require("../helpers/createToken");
const User = require("../models/User");
const Post = require("../models/Post");
const { AuthenticationError } = require("apollo-server");

exports.resolvers = {
  Query: {
    // get user tokens from username and password
    getToken: (parent, args, context, info) => {
      return new Promise((resolve, reject) => {
        User.findOne({
          username: args.username,
        }).then((result) => {
          if(result) { // user exists

            if(result.email_confirmed) { // user confirmed the email, so can login

              bcrypt.compare(args.password, result.password, (err, compareSuccess) => {
                if (err) reject(err);

                if(compareSuccess) { // correct password
                  // create tokens with specified duration and user id
                  const refresh_token = createToken(result._id, "refresh");
                  const access_token = createToken(result._id, "access");

                  User.updateOne({ _id: result._id }, { $set: { // set tokens in database
                    access_token: access_token,
                    refresh_token: refresh_token
                  }}).then((updateResult) => {
                    // set httpOnly cookie containing the refresh token
                    context.res.cookie("refresh_token", refresh_token.value, {
                      expires: new Date(refresh_token.expiry),
                      httpOnly: true
                    });
                    console.log("User got tokens.");
                    resolve(access_token.value);
                  }).catch((error) => {
                    reject(error);
                  });
                } else { // user exists but password is not correct
                  reject(new Error("Wrong password."));
                }
              });
            } else {
              reject(new Error("Email not confirmed."));
            }
          } else {
            reject(new Error("User not existent."));
          }
        }).catch((error) => {
          reject(error);
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
              profile_type: args.profile_type
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
                resolve(post);
              })
            });
          });
        }).catch((err) => {
          reject(err);
        });
      });
    }
  }
}
