/**
 * Import own packages
 */
const appCollection = require('../../collections/App');

/**
 * Returns all apps
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */
module.exports = async (req, res) => {
    const apps = await appCollection.find();

    res.json({
        success: true,
        apps
    });
};
