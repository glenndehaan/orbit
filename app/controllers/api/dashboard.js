/**
 * Import own packages
 */
const appCollection = require('../../collections/App');
const serverCollection = require('../../collections/Server');

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
    const totalServers = await serverCollection.countDocuments();
    const totalOnline = await appCollection.countDocuments({
        updated: {
            $gt: offlineEpoch.getTime()
        }
    });
    const totalOffline = await appCollection.countDocuments({
        updated: {
            $lt: offlineEpoch.getTime()
        }
    });

    // Data
    const topDiscovered = await appCollection.find({
        updated: {
            $gt: offlineEpoch.getTime()
        }
    }, {
        _id: 0
    }, {
        limit: 3,
        sort: {
            'process.uptime': -1
        }
    });
    const topDiscoveredIps = await appCollection.find({}, {
        _id: 0,
        public: 1,
        'os.hostname': 1
    }, {
        limit: 3,
        sort: {
            'process.uptime': -1
        }
    });
    const topOffline = await appCollection.find({
        updated: {
            $lt: offlineEpoch.getTime()
        }
    }, {
        _id: 0
    }, {
        limit: 3,
        sort: {
            'process.uptime': -1
        }
    });

    res.json({
        success: true,
        topDiscovered,
        topDiscoveredIps,
        topOffline,
        totalOnline,
        totalOffline,
        totalApps,
        totalServers
    });
};
