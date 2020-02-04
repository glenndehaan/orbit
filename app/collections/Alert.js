/**
 * Import vendor packages
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Create the Alert collection
 */
const AlertSchema = new Schema({
    id: String,
    contact: String,
    app: String,
    alert: String
}, { versionKey: false, collection: 'alert' });

/**
 * Export the Alert collection
 * @type {Model}
 */
module.exports = mongoose.model('Alert', AlertSchema);
