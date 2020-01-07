/**
 * Import base packages
 */
const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');

/**
 * Import own packages
 */
const config = require('../config');
const settingsCollection = require('../collections/Settings');

/**
 * MongoDB connector
 */
class MongoDB {
    /**
     * Function to setup the MongoDB connection
     *
     * @return Promise
     */
    init() {
        return new Promise((resolve) => {
            if (typeof config.mongo !== "undefined") {
                mongoose.connect(`mongodb://${config.mongo.username}:${config.mongo.password}@${config.mongo.host}:${config.mongo.port}/${config.mongo.database}?authSource=admin`, {
                    useNewUrlParser: true,
                    useCreateIndex: true,
                    useUnifiedTopology: true
                }, async (err) => {
                    if (err) {
                        global.log.error(`[MONGO] Error while connecting: ${err}`);
                        setTimeout(() => {
                            process.exit(1);
                        });
                    } else {
                        global.log.info(`[MONGO] Connection successful!`);
                        resolve();

                        if (await settingsCollection.findOne({type: '__base'}) === null) {
                            const settings = settingsCollection({
                                type: '__base',
                                token: uuidv4()
                            });

                            await settings.save();
                            global.log.info('[ORBIT] New settings have been generated!');
                        }
                    }
                });
            } else {
                global.log.info('[MONGO] Connection details not provided! Mongo inactive');
                resolve();
            }
        });
    }

    /**
     * Closes the MongoDB connection
     */
    close() {
        if (typeof config.mongo !== 'undefined') {
            mongoose.connection.close();
            global.log.info('[MONGO] Connection closed!');
        } else {
            global.log.info('[MONGO] Connection details not provided! Mongo inactive');
        }
    }
}

/**
 * Export the MongoDB connector
 * @type {MongoDB}
 */
module.exports = new MongoDB;
