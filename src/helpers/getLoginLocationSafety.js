const Token = require("../models/Token");

const getLoginLocationSafety = (country, user) => {
  return new Promise(async (resolve, reject) => {

    const query = Token.find({ user: user._id });
    query.sort({ createdAt: 1 });
    query.exec((err, tokens) => {

      if(err) {
        console.error(err);
        return reject(new Error("ERROR_GETTING_PREVIOUS_SESSIONS"));
      }

      if(tokens.length == 0)
        return resolve(1);

      const perCountry = [];

      let i;

      for(i = 0; i < tokens.length; i++) {
        const location = JSON.parse(tokens[i].userLocation);
        if(location && location.country) {
          if(perCountry[location.country])
            perCountry[location.country]++;
          else
            perCountry[location.country] = 1;
        }
        // give more relevance to the last session location
        if(i == tokens.length - 1)
          perCountry[location.country] *= process.env.LAST_LOCATION_MULTIPLIER;
      };

      let total = 0;

      Object.keys(perCountry).forEach((countryCode) => {
        total += perCountry[countryCode];
      });

      let part = perCountry[country] ? perCountry[country] : 0;

      const percentage = part / total;

      return resolve(percentage);
    });
  });
};

module.exports = getLoginLocationSafety;