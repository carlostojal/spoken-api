const crypto = require("crypto");

const encryption = {

  encrypt: (input) => {

    const text = input.toString();

    return crypto.createHash("md5").update(text).digest("hex");
  }
};

module.exports = encryption;