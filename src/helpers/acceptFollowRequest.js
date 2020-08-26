const { AuthenticationError } = require("apollo-server");
const FollowRelation = require("../models/FollowRelation");

const acceptFollowRequest = (user_id, context) => {
  return new Promise((resolve, reject) => {

    if(!context.user)
      reject(new AuthenticationError("BAD_AUTHENTICATION"));

    if(!user_id)
      reject(new Error("NO_USER_ID"));

    const query = FollowRelation.findOne({ user: user_id, follows: context.user._id });
    query.populate("user");
    query.exec((error, relation) => {

      if(error) {
        console.log(error);
        reject(new Error("ERROR_FINDING_RELATION"));
      }
      
      if(!relation)
        return reject(new Error("NO_RELATION"));

      relation.accepted = true;

      relation.save().then(() => {
        console.log("Follow request accepted.");
        resolve(relation.user);
      }).catch((error) => {
        console.log(error);
        reject(new Error("ERROR_SAVING_RELATION"));
      });
    });
  });
};

module.exports = acceptFollowRequest;