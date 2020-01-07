/**
 * Import vendor packages
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Create the App collection
 */
const AppSchema = new Schema({
    os: 'Mixed',
    process: 'Mixed',
    id: String,
    project: String,
    env: String,
    client: String,
    updated: Number
}, { versionKey: false, collection: 'app' });

/**
 * Export the App collection
 * @type {Model}
 */
module.exports = mongoose.model('App', AppSchema);
