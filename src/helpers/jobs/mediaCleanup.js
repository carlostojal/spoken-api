const fs = require("fs");
const getExpiredMedia = require("../controllers/media/getExpiredMedia");
const removeMediaById = require("../controllers/media/removeMediaById");

const mediaCleanup = () => {
    return new Promise(async (resolve, reject) => {
        let media = null;
        try {

            media = await getExpiredMedia();

            media.forEach(async (item, index) => {

                console.log(`Media with ID ${item.id} is expired.`);

                let deleteSuccess = true;

                // remove file from system
                try {
                    console.log(`Removing media with ID ${item.id}...`);
                    fs.unlinkSync(item.path);
                } catch(e) {
                    // -2 errno is ENOENT error (the file was already deleted)
                    if(e.errno != -2)
                        deleteSuccess = false;
                }

                // only remove from database if the delete was successful
                if(deleteSuccess) {
                    console.log("Deleted.");
                    // remove media object from database
                    try {
                        console.log("Removing from database...");
                        await removeMediaById(item.id)
                        console.log("Removed.\n");
                    } catch(e) {
                        console.error(new Error("ERROR_REMOVING_DB_OBJECT"));
                    }
                } else {
                    console.error(new Error("ERROR_REMOVING_FILE"));
                }
            });
            
        } catch(e) {
            return reject(e);
        }
        return resolve(media);
    });
};

module.exports = mediaCleanup;