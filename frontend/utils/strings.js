/**
 * Calculate the time ago
 *
 * @param date
 * @return {{number: *, text: string, type: string}}
 */
const timeSince = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return {
            number: interval,
            type: "year",
            text: interval + " year(s) ago"
        };
    }
    interval = Math.floor(seconds / 2592000);

    if (interval > 1) {
        return {
            number: interval,
            type: "month",
            text: interval + " month(s) ago"
        };
    }
    interval = Math.floor(seconds / 86400);

    if (interval > 1) {
        return {
            number: interval,
            type: "day",
            text: interval + " day(s) ago"
        };
    }
    interval = Math.floor(seconds / 3600);

    if (interval > 1) {
        return {
            number: interval,
            type: "hour",
            text: interval + " hour(s) ago"
        };
    }
    interval = Math.floor(seconds / 60);

    if (interval > 1) {
        return {
            number: interval,
            type: "minute",
            text: interval + " minute(s) ago"
        };
    }

    return {
        number: seconds,
        type: "second",
        text: seconds + " second(s) ago"
    };
};

/**
 * Export string utils
 */
export default {timeSince};
