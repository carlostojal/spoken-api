
const generateId = () => {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for(let i = 0; i < 15; i++)
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  return result;
};

module.exports = generateId;