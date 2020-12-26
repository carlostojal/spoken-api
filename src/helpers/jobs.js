const CronJob = require("cron").CronJob;
const mediaCleanup = require("./jobs/mediaCleanup");

const jobs = async () => {

    const mediaCleanupJob = new CronJob(
        process.env.MEDIA_CLEANUP_CRONTAB,
        async () => {
            console.log("Cleaning unused media...");
            try {
                await mediaCleanup();
            } catch(e) {
                console.error(new Error("ERROR_REMOVING_UNUSED_MEDIA"));
                console.error(e);
            }
            console.log("Media cleanup done.");
        },
        null,
        false,
        process.env.CRONTAB_TIMEZONE
    );

    mediaCleanupJob.start();

}

module.exports = jobs;