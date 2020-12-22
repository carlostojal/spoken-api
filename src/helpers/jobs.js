const CronJob = require("cron").CronJob;
const mediaCleanup = require("./jobs/mediaCleanup");

const jobs = () => {

    const mediaCleanupJob = new CronJob(
        process.env.MEDIA_CLEANUP_CRONTAB,
        async () => {
            try {
                await mediaCleanup();
            } catch(e) {
                console.error("ERROR_CLEANING_MEDIA");
                console.error(e);
            }
        },
        null,
        true,
        process.env.CRONTAB_TIMEZONE
    );

}

module.exports = jobs;