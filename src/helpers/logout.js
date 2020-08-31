const { AuthenticationError } = require("apollo-server");

/*
*
* Promise logout(refresh_token, access_token, user)
*
* Summary:
*   The logout function receives the current access token and refresh token
*   and removes them from the database. Also receives the user object to 
*   perform the needed updates in the database. Returns the logged out
*   user.
*
* Parameters:
*   String: refresh_token
*   String: access_token
*   Object: user
*
* Return Value:
*   Promise: 
*     Object: user
*
* Description:
*   This function receives the current tokens and removes them from the 
*   user model. Also resets the refresh token cookie in browser.
*   Returns the logged out user.
*   
*/

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
      console.log(error);
      return reject(new Error("ERROR_SAVING_USER"));
    });
  });
};

module.exports = logout;