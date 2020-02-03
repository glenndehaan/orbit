/**
 * Import vendor packages
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Create the App collection
 */
const ContactSchema = new Schema({
    name: String,
    service: String,
    information: Object
}, { versionKey: false, collection: 'contact' });

/**
 * Export the App collection
 * @type {Model}
 */
module.exports = mongoose.model('Contact', ContactSchema);
