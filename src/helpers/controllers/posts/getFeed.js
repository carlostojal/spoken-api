const addPostToCachePage = require("./addPostToCachePage");
const savePostToCache = require("./savePostToCache");

const getFeed = (page, perPage, user_id, mysqlPool) => {
  return new Promise(async (resolve, reject) => {

    mysqlPool.getConnection((err, connection) => {

      if(err)
        return reject(err);

      connection.query(`CALL GetFeed(?, ?, ?)`, [user_id, perPage, (page - 1) * perPage], async (err, result) => {

        connection.release();
  
        if(err)
          return reject(err);
  
        result = JSON.parse(JSON.stringify(result))[0];
  
        /*
        result.map(async (post) => {
          await addPostToCachePage(post.id, user_id, page);
          await savePostToCache(post);
        });*/
  
        return resolve(result);
      });
    });
  });
};

module.exports = getFeed;