const fs = require("fs");
const getExpiredMedia = require("../controllers/media/getExpiredMedia");
const removeMediaById = require("../controllers/media/removeMediaById");

const mediaCleanup = () => {
    return new Promise(async (resolve, reject) => {
        let media = null;
        try {

            media = await getExpiredMedia();

            media.forEach(async (item, index) => {

                let deleteSuccess = true;

                // remove file from system
                try {
                    fs.unlinkSync(item.path);
                } catch(e) {
                    // -2 errno is ENOENT error (the file was already deleted)
                    if(e.errno != -2)
                        deleteSuccess = false;
                }

                // only remove from database if the delete was successful
                if(deleteSuccess) {
                    // remove media object from database
                    try {
                        await removeMediaById(item.id)
                    } catch(e) {
                        return reject(new Error("ERROR_REMOVING_DB_OBJECT"));
                    }
                } else {
                    return reject(new Error("ERROR_REMOVING_FILE"));
                }
            });
            
        } catch(e) {
            return reject(e);
        }
        return resolve(media);
    });
};

module.exports = mediaCleanup;