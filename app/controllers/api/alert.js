/**
 * Import vendor packages
 */
const uuidv4 = require('uuid/v4');

/**
 * Import own packages
 */
const alertCollection = require('../../collections/Alert');
const contactCollection = require('../../collections/Contact');
const appCollection = require('../../collections/App');

/**
 * Export all alert functions
 */
module.exports = {
    find: async (req, res) => {
        res.json({
            success: true,
            alerts: await alertCollection.find(),
            contacts: await contactCollection.find(),
            apps: await appCollection.find()
        });
    },

    /**
     * Create a new Alert
     *
     * @param req
     * @param res
     * @return {Promise<void>}
     */
    create: async (req, res) => {
        const alert = new alertCollection();
        alert.id = uuidv4();
        alert.contact = req.body.contact;
        alert.app = req.body.app;
        alert.alert = req.body.alert;
        await alert.save();

        res.json({
            success: true
        });
    },

    /**
     * Remove an alert
     *
     * @param req
     * @param res
     * @return {Promise<void>}
     */
    delete: async (req, res) => {
        await alertCollection.deleteOne({
            id: req.query.id
        });

        res.json({
            success: true
        });
    }
};
