const { AuthenticationError } = require("apollo-server");
const getPostById = require("../helpers/controllers/posts/getPostById");
const formatPost = require("../helpers/formatPost");
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

    try {
      post = formatPost(post);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_FORMATING_POST"));
    }

    if(post.poster.id != user.id)
      return reject(new Error("BAD_PERMISSIONS"));

    let order;
    try {
      order = await createPromoteOrder();
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_CREATING_ORDER"));
    }

    console.log(order);

    return resolve(order);
  });
};

module.exports = promotePost;