const { AuthenticationError } = require("apollo-server");
const User = require("../db_models/User");
const FollowRelation = require("../db_models/FollowRelation");

const followUser = async (id, user) => {

  if(!user)
    throw new AuthenticationError("BAD_AUTHENTICATION");

  if(id == user._id)
    throw new Error("USER_FOLLOWING_HIMSELF");

  let user1 = null;
  try {
    user1 = await User.findById(id);
  } catch(e) {
    console.error(e);
    throw new Error("ERROR_GETTING_USER");
  }

  if(!user1)
    throw new Error("USER_NOT_FOUND");

  const accepted = user1.profile_privacy_type == "public";

  try {

    let existing = await FollowRelation.findOne({user: user._id, follows: user1._id});
    let cur_user = await User.findById(user._id);

    if(existing) {

      cur_user.following.pop(user1._id);
      user1.followers.pop(cur_user._id);
      await cur_user.save();
      await user1.save();
      await existing.remove();

    } else {

      if(accepted) {
        cur_user.following.push(id);
        user1.followers.push(user._id);
        await cur_user.save();
        await user1.save();
      }

      const followRelation = new FollowRelation({
        user: user._id,
        follows: user1._id,
        accepted
      });

      await followRelation.save();

    }

  } catch(e) {
    throw new Error("ERROR_CREATING_RELATION");
  }

  return accepted;
};

module.exports = followUser;