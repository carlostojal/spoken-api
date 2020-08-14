const bcrypt = require("bcrypt");
const User = require("../models/User");

const registerUser = (name, surname, birthdate, email, username, password, profile_type) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(parseInt(process.env.HASH_SALT_ROUNDS), (err, salt) => {
      if (err) reject(err);

      bcrypt.hash(password, salt, (err, hash_password) => {
        if (err) reject(err);

        const user = new User({
          access_token: {
            value: null,
            expiry: null
          },
          refresh_token: {
            value: null,
            expiry: null
          },
          name: name,
          surname: surname,
          birthdate: new Date(parseInt(birthdate)).getTime().toString(),
          email: email,
          email_confirmed: false,
          username: username,
          password: hash_password,
          profile_pic_url: null,
          profile_type: profile_type || "public",
          posts: [],
          following:  [],
          followers: []
        });

        user.save().then((result) => {
          console.log("User registered.");
          resolve(result);
        }).catch((err) => {
          reject(err);
        });

      });
    });
  });
};

module.exports = registerUser;