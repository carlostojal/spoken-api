const { AuthenticationError } = require("apollo-server");
const FollowRelation = require("../db_models/FollowRelation");

const checkFollow = async (user_id, user) => {

  if(!user)
    throw new AuthenticationError("BAD_AUTHENTICATION");

  let relation = null;
  try {
    relation = await FollowRelation.findOne({
      user: user._id,
      follows: user_id,
    });
  } catch(e) {
    console.error(e);
    throw new Error("ERROR_GETTING_RELATION");
  }

  if(!relation)
    return false;

  if(!relation.accepted)
    throw new Error("NOT_ACCEPTED");
  
  return true;
};

module.exports = checkFollow;