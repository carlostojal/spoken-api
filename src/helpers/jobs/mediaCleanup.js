const getExpiredMedia = require("../controllers/media/getExpiredMedia");

const mediaCleanup = () => {
    return new Promise(async (resolve, reject) => {
        let media = null;
        try {
            let media = await getExpiredMedia();
            media = await getExpiredMedia();
            console.log(media);
            // remove the files one by one and remove from the database here
            try {

            } catch(e) {
                
            }
        } catch(e) {
            return reject(e);
        }
        return resolve(media);
    });
};

module.exports = mediaCleanup;