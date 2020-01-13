/**
 * Import own packages
 */
const appCollection = require('../../collections/App');

/**
 * Returns all servers
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */
module.exports = async (req, res) => {
    const servers = await appCollection.find({}, {
        _id: 0
    });

    res.json({
        success: true,
        servers: servers.filter((obj, pos, arr) => {
            return arr.map(mapObj => mapObj["os"]["hostname"]).indexOf(obj["os"]["hostname"]) === pos;
        })
    });
};
