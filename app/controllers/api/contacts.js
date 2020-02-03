/**
 * Import own packages
 */
const contactCollection = require('../../collections/Contact');

/**
 * Returns all Contacts
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */
module.exports = async (req, res) => {
    res.json({
        success: true,
        contacts: await contactCollection.find()
    });
};
