/**
 * Import own packages
 */
const alertCollection = require('../../collections/Alert');
const contactCollection = require('../../collections/Contact');
const appCollection = require('../../collections/App');

/**
 * Returns all Alerts
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */
module.exports = async (req, res) => {
    res.json({
        success: true,
        alerts: await alertCollection.find(),
        contacts: await contactCollection.find(),
        apps: await appCollection.find()
    });
};
