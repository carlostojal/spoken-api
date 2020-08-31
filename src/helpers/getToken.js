const bcrypt = require("bcrypt");
const User = require("../models/User");
const createToken = require("./createToken");

/*
*
* Promise getToken(username, password)
*
* Summary:
*   The getToken function receives the user username/email and password
*   and returns a promise with the resulting tokens.
*
* Parameters:
*   String: username or email
*   String: password
*
* Return Value:
*   Promise: User resulting access token and refresh token and respective 
*   expiration dates in epoch time.
*
* Description:
*   This function receives user credentials and generates a new access
*   and refresh token that are resolved in a promise.
*   If not successfull an error is returned.
*   
*/

const getToken = (username, password) => {
  return new Promise((resolve, reject) => {
    User.findOne({
      $or: [
        {username: username},
        {email: username}
      ]
    }).then((user) => {

      if(!user)
        return reject(new Error("USER_NOT_EXISTENT"));

      if(!user.email_confirmed) 
        return reject(new Error("EMAIL_NOT_CONFIRMED"));

      bcrypt.compare(password, user.password, (err, compareSuccess) => { // compare the provided password with the user one
        
        if (err) return reject(new Error("AUTHENTICATION_ERROR"));

        if(!compareSuccess) return reject(new Error("WRONG_PASSWORD"));

        // create tokens with specified duration and user id
        const refresh_token = createToken(user._id, "refresh");
        const access_token = createToken(user._id, "access");

        // remove expired refresh tokens
        user.refresh_tokens = user.refresh_tokens.filter((refresh_token) => refresh_token.expiry > Date.now());

        // remove expired access tokens
        user.access_tokens = user.access_tokens.filter((access_token) => access_token.expiry > Date.now());

        // add the new tokens
        user.refresh_tokens.push(refresh_token);
        user.access_tokens.push(access_token);

        // update the user in the database
        user.save().then(() => {
          console.log("User got tokens.");
          resolve({ access_token, refresh_token }); // return tokens to resolvers
        }).catch((error) => {
          console.log(error);
          return reject(new Error("ERROR_UPDATING_USER"));
        });

      });
    }).catch((error) => {
      console.log(error);
      return reject(new Error("ERROR_GETTING_USER"));
    });
  });
}

module.exports = getToken;