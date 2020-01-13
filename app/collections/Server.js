/**
 * Import vendor packages
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Create the Server collection
 */
const ServerSchema = new Schema({
    hostname: String,
    discovered: Number
}, { versionKey: false, collection: 'server' });

/**
 * Export the Server collection
 * @type {Model}
 */
module.exports = mongoose.model('Server', ServerSchema);
