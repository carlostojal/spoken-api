
const getSession = (session_key, redisClient) => {
  return new Promise((resolve, reject) => {
    redisClient.get(session_key, (err, result) => {

      if(err)
        return reject(err);

      return resolve(result);
    });
  });
}

const getSessions = (user_id, redisClient) => {
  return new Promise((resolve, reject) => {
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
