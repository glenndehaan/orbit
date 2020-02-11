/**
 * Import vendor packages
 */
const uuidv4 = require('uuid/v4');

/**
 * Import own packages
 */
const contactCollection = require('../../collections/Contact');
const alertCollection = require('../../collections/Alert');

/**
 * Export all contact functions
 */
module.exports = {
    /**
     * Get all contacts
     *
     * @param req
     * @param res
     * @return {Promise<void>}
     */
    find: async (req, res) => {
        res.json({
            success: true,
            contacts: await contactCollection.find()
        });
    },

    /**
     * Create a new Contact
     *
     * @param req
     * @param res
     * @return {Promise<void>}
     */
    create: async (req, res) => {
        const contact = new contactCollection();
        contact.id = uuidv4();
        contact.name = req.body.name;
        contact.service = req.body.service;
        contact.information = req.body.information;
        await contact.save();

        res.json({
            success: true
        });
    },

    /**
     * Remove a Contact
     *
     * @param req
     * @param res
     * @return {Promise<void>}
     */
    delete: async (req, res) => {
        await contactCollection.deleteOne({
            id: req.query.id
        });

        await alertCollection.deleteMany({
            contact: req.query.id
        });

        res.json({
            success: true
        });
    }
};
