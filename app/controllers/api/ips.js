/**
 * Import own packages
 */
const appCollection = require('../../collections/App');

/**
 * Returns all IP's
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */
module.exports = async (req, res) => {
    const ips = await appCollection.find({}, {
        _id: 0,
        public: 1
    });

    res.json({
        success: true,
        ips: ips.filter((obj, pos, arr) => {
            return arr.map(mapObj => mapObj["public"]["ip"]).indexOf(obj["public"]["ip"]) === pos;
        })
    });
};
