const { AuthenticationError } = require("apollo-server");

const logout = (refresh_token, access_token, user) => {

  return new Promise((resolve, reject) => {

    if (!user) return reject(new AuthenticationError("USER_NOT_AUTHENTICATED"));

    // remove refresh token
    user.refresh_tokens.filter((token) => token.value != refresh_token);

    // remove access token
    user.access_tokens.filter((token) => token.value != access_token);

    user.save().then((user) => {
      return resolve(user);
    }).catch((error) => {
      return reject(new Error("ERROR_SAVING_USER"));
    });
  });
};

module.exports = logout;