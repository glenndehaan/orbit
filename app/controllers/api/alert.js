/**
 * Import vendor packages
 */
const uuidv4 = require('uuid/v4');

/**
 * Import own packages
 */
const alertCollection = require('../../collections/Alert');

/**
 * Export all alert functions
 */
module.exports = {
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
