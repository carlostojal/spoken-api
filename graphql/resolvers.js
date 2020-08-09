const bcrypt = require("bcrypt");
const createToken = require("../helpers/createToken");
const User = require("../models/User");

exports.resolvers = {
  Query: {
    // get user tokens from username and password
    getToken: (parent, args, context, info) => {
      return new Promise((resolve, reject) => {
        User.findOne({
          username: args.username,
          password: args.password
        }).then((result) => {
          if(result) { // user exists

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
          } else {
            reject(new Error("Bad credentials.")); 
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
    }
  }
}
