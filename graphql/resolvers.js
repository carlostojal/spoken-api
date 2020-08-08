const jwt = require('jsonwebtoken');
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
            const token_expiry = Date.now() + (60 * process.env.TOKEN_DURATION * 1000);
            const token = jwt.sign({
              exp: token_expiry,
              data: {
                user_id: result._id
              }
            }, process.env.TOKEN_SECRET);
            User.updateOne({ _id: result._id }, { $set: { active_token: token, token_expiry: token_expiry } }).then((updateResult) => {
              resolve(token);
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
