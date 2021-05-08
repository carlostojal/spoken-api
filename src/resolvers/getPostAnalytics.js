const { AuthenticationError } = require("apollo-server");
const Post = require("../db_models/Post");
const PostView = require("../db_models/PostView");

const getPostAnalytics = (post_id, type, user) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    let views = [];
    try {
      views = await PostView.find({post: post_id});
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_VIEWS"))
    }

    let result = {
      labels: [],
      values: []
    };

    switch(type) {

      case "views_by_hour":
        views.map((view) => {
          let hour = new Date(view.time).getHours();
          // if there is a view at this hour, increment the count
          if(result.labels.includes(hour)) {
            result.values[result.labels.indexOf(hour)]++;
          } else {
            // else there is not, so append both the label and the value to the arrays
            result.labels.push(hour);
            result.values.push(1);
          }
        });
        break;

      case "views_by_os":
        views.map((view) => {
          let os = view.user_os;
          // if there is a view at this hour, increment the count
          if(result.labels.includes(os)) {
            result.values[result.labels.indexOf(os)]++;
          } else {
            // else there is not, so append both the label and the value to the arrays
            result.labels.push(os);
            result.values.push(1);
          }
        });
        break;

      default:
        return reject(new Error("NOT_IMPLEMENTED"));
    }

    return resolve(result);
  });
};

module.exports = getPostAnalytics;