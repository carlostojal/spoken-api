const getExpiredMedia = require("../controllers/media/getExpiredMedia");

const mediaCleanup = () => {
    return new Promise(async (resolve, reject) => {
        console.log("Cleaning unused media...");
        try {
            let media = await getExpiredMedia();
            console.log(media);
            // remove the files one by one and remove from the database here
        } catch(e) {
            return reject(e);
        }
        console.log("Media cleanup done.");
        return resolve(media);
    });
};

module.exports = mediaCleanup;