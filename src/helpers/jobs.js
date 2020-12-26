const CronJob = require("cron").CronJob;
const mediaCleanup = require("./jobs/mediaCleanup");

const jobs = async () => {

    // await mediaCleanup();

    const mediaCleanupJob = new CronJob(
        process.env.MEDIA_CLEANUP_CRONTAB,
        async () => {
            console.log("Cleaning unused media...");
            try {
                await mediaCleanup();
            } catch(e) {
                console.error("ERROR_CLEANING_MEDIA");
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