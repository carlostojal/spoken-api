
const checkBirthdate = (date) => {
  const d = new Date(parseInt(date));
  return d.getTime() >= Date.now() - (process.env.MAX_BIRTHDATE_AGE * 31556926000) && d.getTime() <= Date.now();
};

module.exports = checkBirthdate;