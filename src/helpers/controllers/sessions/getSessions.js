
const getSessions = (user_id) => {
  return new Promise(async (resolve, reject) => {

    let redisClient;
    try {
      redisClient = await require("../../../config/redis");
    } catch(e) {
      return reject(e);
    }

    redisClient.keys(`session:${user_id}:*`, async (err, result) => {

      if(err)
        return reject(err);

      let sessions = [];

      for(let i = 0; i < result.length; i++) {
        try {
          sessions[i] = JSON.parse(await getSession(result[i], redisClient));
        } catch(e) {
          return reject(e);
        }
      }

      return resolve(sessions);
    });
  });
};

module.exports = getSessions;
