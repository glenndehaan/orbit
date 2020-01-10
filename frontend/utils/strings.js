/**
 * Calculate the time ago
 *
 * @param date
 * @return {{number: *, text: string, type: string}}
 */
const timeSince = (date) => {
    const seconds = Math.floor((new Date().getTime() - date) / 1000);
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
 * Converts bytes to rounded number
 *
 * @param bytes
 * @param decimals
 * @return {string}
 */
const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Converts seconds to time format
 *
 * @return {string}
 */
const secondsToTime = (second) => {
    const sec_num = parseInt(second, 10);
    let hours = Math.floor(sec_num / 3600);
    let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    let seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) {
        hours = `0${hours}`;
    }
    if (minutes < 10) {
        minutes = `0${minutes}`;
    }
    if (seconds < 10) {
        seconds = `0${seconds}`;
    }

    return `${hours}:${minutes}:${seconds}`;
};

/**
 * Sum
 *
 * @param a
 * @param b
 * @return {*}
 */
const sum = (a, b) => {
    return a + b
};

/**
 * Export string utils
 */
export default {timeSince, formatBytes, secondsToTime, sum};
