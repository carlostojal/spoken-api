
const mediaIdToUrl = (id) => {
  return `${process.env.EXPRESS_ADDRESS}:${process.env.EXPRESS_PORT}/media/${id}`;
}

module.exports = mediaIdToUrl;