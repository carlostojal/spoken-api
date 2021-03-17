
const ignoreRelation = (user, follows, mysqlPool) => {
  return new Promise(async (resolve, reject) => {

    mysqlPool.getConnection((err, connection) => {

      if (err)
        return reject(err);

      connection.query("UPDATE FollowRelations SET ignored = '1' WHERE user = ? AND follows = ?", [user, follows], (err, result) => {

        connection.release();

        if (err)
          return reject(err);

        return resolve(null);
      });
    });
  });
};

module.exports = ignoreRelation;