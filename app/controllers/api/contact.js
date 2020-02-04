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
    const contact = new contactCollection();
    contact.name = req.body.name;
    contact.service = req.body.service;
    contact.information = req.body.information;
    await contact.save();

    res.json({
        success: true
    });
};
