/**
 * Import own packages
 */
const settingsCollection = require('../../collections/Settings');

/**
 * Returns the app token
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */
module.exports = async (req, res) => {
    const settings = await settingsCollection.findOne({type: '__base'});

    res.json({
        success: true,
        token: settings.token
    });
};
