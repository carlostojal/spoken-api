const { AuthenticationError } = require("apollo-server");
const FollowRelation = require("../models/FollowRelation");

const acceptFollowRequest = (user_id, context) => {
  return new Promise((resolve, reject) => {

    if(!context.user)
      reject(new AuthenticationError("Bad authentication"));

    if(!user_id)
      reject(new Error("No user ID provided"));

    const query = FollowRelation.findOne({ user: user_id, follows: context.user._id });
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
};

module.exports = acceptFollowRequest;