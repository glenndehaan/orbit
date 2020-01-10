/**
 * Import own packages
 */
const appCollection = require('../../collections/App');

/**
 * Returns all dashboard data
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */
module.exports = async (req, res) => {
    const currentEpoch = new Date();
    const offlineEpoch = new Date(currentEpoch.getTime() - 1200000);

    // Counters
    const totalApps = await appCollection.countDocuments();
    const totalOffline = await appCollection.countDocuments({
        updated: {
            $gt: offlineEpoch.getTime()
        }
    });
    const totalOnline = await appCollection.countDocuments({
        updated: {
            $lt: offlineEpoch.getTime()
        }
    });

    // Data
    const topDiscovered = await appCollection.find({
        updated: {
            $gt: offlineEpoch.getTime()
        }
    }, {}, {
        limit: 3,
        sort: {
            'process.uptime': -1
        }
    });
    const topOffline = await appCollection.find({
        updated: {
            $lt: offlineEpoch.getTime()
        }
    }, {}, {
        limit: 3,
        sort: {
            'process.uptime': -1
        }
    });

    res.json({
        success: true,
        topDiscovered,
        topOffline,
        totalOnline,
        totalOffline,
        totalApps
    });
};
