const CronJob = require("cron").CronJob;

const jobs = () => {

    const mediaCleanupJob = new CronJob(
        process.env.MEDIA_CLEANUP_CRONTAB,
        () => {
            console.log("Cleaning unused media.");
        },
        null,
        true,
        process.env.CRONTAB_TIMEZONE
    );

}

module.exports = jobs;