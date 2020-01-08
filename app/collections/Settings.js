/**
 * Import vendor packages
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Create the Settings collection
 */
const SettingsSchema = new Schema({
    type: String,
    token: String,
    jwtSecret: String
}, { versionKey: false, collection: 'settings' });

/**
 * Export the Settings collection
 * @type {Model}
 */
module.exports = mongoose.model('Settings', SettingsSchema);
