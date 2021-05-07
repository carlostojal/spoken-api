const { AuthenticationError } = require("apollo-server");
const createPromoteOrder = require("../helpers/paypal/createPromoteOrder");
const Post = require("../db_models/Post");

const promotePost = (id, user) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    if(user.profile_type != "business")
      return reject(new Error("NOT_BUSINESS_ACCOUNT"));

    // check if post exists
    let post = null;
    try {
      post = await Post.findById(id);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_POST"));
    }

    if(!post)
      return reject(new Error("POST_NOT_FOUND"));

    // if the post is already promoted don't allow
    if(post.promoted)
      return reject(new Error("POST_ALREADY_PROMOTED"));

    // check if the current user is the post owner
    if(post.poster != user._id)
      return reject(new Error("BAD_PERMISSIONS"));

    // create the PayPal order
    let order;
    try {
      order = await createPromoteOrder(post);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_CREATING_ORDER"));
    }

    // only keep the approve link to return
    order.links =  order.links.filter((link) => {
      return link.rel === "approve";
    });

    // return the link to the client
    return resolve(order.links[0].href);
  });
};

module.exports = promotePost;