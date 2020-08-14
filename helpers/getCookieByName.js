
const getCookieByName = (name, rawCookies) => {
  const value = `; ${rawCookies}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

module.exports = getCookieByName;
