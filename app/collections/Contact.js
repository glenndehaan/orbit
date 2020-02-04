/**
 * Import vendor packages
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Create the Contact collection
 */
const ContactSchema = new Schema({
    id: String,
    name: String,
    service: String,
    information: Object
}, { versionKey: false, collection: 'contact' });

/**
 * Export the Contact collection
 * @type {Model}
 */
module.exports = mongoose.model('Contact', ContactSchema);
