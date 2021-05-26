const { AuthenticationError } = require("apollo-server");
const PostView = require("../db_models/PostView");
const PostReaction = require("../db_models/PostReaction");

const getPostAnalytics = async (post_id, type, user) => {

  if(!user)
    throw new AuthenticationError("BAD_AUTHENTICATION");

  let views = [];
  let reactions = [];

  // get from the database what is being requested
  if(type.includes("view")) {
    try {
      views = await PostView.find({post: post_id}).populate("user");
    } catch(e) {
      console.error(e);
      throw new Error("ERROR_GETTING_VIEWS");
    }
  } else {
    try {
      reactions = await PostReaction.find({post: post_id}).populate("user");
    } catch(e) {
      console.error(e);
      throw new Error("ERROR_GETTING_REACTIONS");
    }
  }

  let result = {
    labels: [],
    values: []
  };

  switch(type) {

    case "average_view_time":
      let sum = 0;
      views.map((view) => {
        sum += view.view_time
      });
      console.log(sum);
      console.log(views.length);
      console.log(sum / views.length);
      result.labels.push("average");
      result.values.push(sum / views.length);
      break;

    case "views_by_hour":
      views.sort((a, b) => {
        const a_date = new Date(a.time).getHours();
        const b_date = new Date(b.time).getHours();
        if(a_date > b_date)
          return 1;
        else if(a_date < b_date)
          return -1;
        return 0;
      });
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
        if(result.labels.includes(os)) {
          result.values[result.labels.indexOf(os)]++;
        } else {
          result.labels.push(os);
          result.values.push(1);
        }
      });
      break;

    case "views_by_platform":
      views.map((view) => {
        let platform = view.user_platform;
        if(result.labels.includes(platform)) {
          result.values[result.labels.indexOf(platform)]++;
        } else {
          result.labels.push(platform);
          result.values.push(1);
        }
      });
      break;

    case "views_by_age_range":
      result.labels = ["0-11", "12-18", "19-24", "25-49", "50+"];
      result.values = [0, 0, 0, 0, 0];
      views.map((view) => {
        const age = new Date().getFullYear() - new Date(view.user.birthdate).getFullYear();
        if(age < 12)
          result.values[0]++;
        else if(age < 19)
          result.values[1]++;
        else if(age < 25)
          result.values[2]++;
        else if(age < 50)
          result.values[3]++;
        else
          result.values[4]++;
      });
      break;

    case "reactions_by_age_range":
      reactions.map((reaction) => {
        const age = new Date().getFullYear() - new Date(reaction.user.birthdate).getFullYear();
        result.labels = ["0-11", "12-18", "19-24", "25-49", "50+"];
        result.values = [0, 0, 0, 0, 0];
        if(age < 12)
          result.values[0]++;
        else if(age < 19)
          result.values[1]++;
        else if(age < 25)
          result.values[2]++;
        else if(age < 50)
          result.values[3]++;
        else
          result.values[4]++;
      });
      break;

    default:
      throw new Error("NOT_IMPLEMENTED");
  }

  return result;
};

module.exports = getPostAnalytics;