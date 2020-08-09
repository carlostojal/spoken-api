const createToken = require("../helpers/createToken");
const User = require("../models/User");

exports.resolvers = {
  Query: {
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
  }
}
