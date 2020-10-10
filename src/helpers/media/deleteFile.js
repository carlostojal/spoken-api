const fs = require("fs");

const deleteFile = (path) => {
  return new Promise((resolve, reject) => {

    fs.unlink(path, (error) => {
      
      if(error) {
        return reject(new Error("ERROR_DELETING_FILE"));
      }

      return resolve(null);

    });
  });
};

module.exports = deleteFile;