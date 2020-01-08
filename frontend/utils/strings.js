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
            text: interval + " years ago"
        };
    }
    interval = Math.floor(seconds / 2592000);

    if (interval > 1) {
        return {
            number: interval,
            type: "month",
            text: interval + " months ago"
        };
    }
    interval = Math.floor(seconds / 86400);

    if (interval > 1) {
        return {
            number: interval,
            type: "day",
            text: interval + " days ago"
        };
    }
    interval = Math.floor(seconds / 3600);

    if (interval > 1) {
        return {
            number: interval,
            type: "hour",
            text: interval + " hours ago"
        };
    }
    interval = Math.floor(seconds / 60);

    if (interval > 1) {
        return {
            number: interval,
            type: "minute",
            text: interval + " minutes ago"
        };
    }

    return {
        number: seconds,
        type: "second",
        text: seconds + " seconds ago"
    };
};

/**
 * Export string utils
 */
export default {timeSince};
