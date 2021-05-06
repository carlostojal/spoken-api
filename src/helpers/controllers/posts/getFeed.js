const Post = require("../../../db_models/Post");
const FollowRelation = require("../../../db_models/FollowRelation");

const getFeed = (page, perPage, user_id) => {
  return new Promise(async (resolve, reject) => {

    const relations = FollowRelation.find({user: user_id});
    let following_ids = [];
    relations.map((relation) => {
      following_ids.push(relation.follows);
    });
    

    const posts = Post.find({poster: {$in: following_ids}}).populate("poster").exec((err, res) => {

      if(err) return reject(err);

      let posts = [];
      res.map((post) => {

        relations.map((relation) => {
          if(relation.follows == post.poster._id)
            posts.push(post);
        });
      });
    });
  });
};

module.exports = getFeed;