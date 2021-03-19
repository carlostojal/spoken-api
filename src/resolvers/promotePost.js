const { AuthenticationError } = require("apollo-server");
const getPostById = require("../helpers/controllers/posts/getPostById");
const createPromoteOrder = require("../helpers/paypal/createPromoteOrder");

const promotePost = (id, user, mysqlPool) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    let post = null;
    try {
      post = await getPostById(id, mysqlPool);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_POST"));
    }

    if(!post)
      return reject(new Error("POST_NOT_FOUND"));

    if(post.promoted)
      return reject(new Error("POST_ALREADY_PROMOTED"));

    if(post.poster_id != user.id)
      return reject(new Error("BAD_PERMISSIONS"));

    let order;
    try {
      order = await createPromoteOrder(id);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_CREATING_ORDER"));
    }

    // console.log(order);

    return resolve(order);
  });
};

module.exports = promotePost;