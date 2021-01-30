const { AuthenticationError } = require("apollo-server");
const getUserById = require("../helpers/controllers/users/getUserById");
const insertRelation = require("../helpers/controllers/relations/insertRelation");
const removeRelation = require("../helpers/controllers/relations/removeRelation");
const sendNotification = require("../helpers/sendNotification");

const followUser = (id, user, mysqlPool) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      reject(new AuthenticationError("BAD_AUTHENTICATION"));

    if(!id)
      reject(new Error("NO_USER_ID_PROVIDED"));

    if(id == user.id)
      reject(new Error("USER_FOLLOWING_HIMSELF"));

    let user1 = null;
    try {
      user1 = await getUserById(id, mysqlPool);
    } catch(e) {
      
      return reject(new Error("ERROR_GETTING_USER"));
    }

    if(!user1)
      return reject(new Error("USER_NOT_FOUND"));

    const accepted = user1.profile_privacy_type == "public";

    const followRelation = {
      user: user.id,
      follows: user1.id,
      accepted
    };

    try {
      await insertRelation(followRelation, mysqlPool);

      try {
        sendNotification("New follower", `"${user.username}" started following you.`, user1.id, mysqlPool);
      } catch(e) {
        console.error(new Error("ERROR_SENDING_NOTIFICATION"));
      }

    } catch(e) {
      
      if(e.errno == 1062) { // duplicate key (relation already exists)
        // will remove the relation
        try {
          await removeRelation(user.id, user1.id, mysqlPool);
        } catch(e) {
          return reject(new Error("ERROR_REMOVING_RELATION"));
        }
      } else {
        return reject(new Error("ERROR_CREATING_RELATION"));
      }
    }

    return resolve(user1);
  });
};

module.exports = followUser;