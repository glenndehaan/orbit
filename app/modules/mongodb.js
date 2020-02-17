/**
 * Import base packages
 */
const fs = require('fs');
const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');

/**
 * Import own packages
 */
const config = require('../config');
const alertCollection = require('../collections/Alert');
const appCollection = require('../collections/App');
const contactCollection = require('../collections/Contact');
const serverCollection = require('../collections/Server');
const settingsCollection = require('../collections/Settings');

/**
 * Define the dev status
 */
const dev = process.env.NODE_ENV !== 'production';

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
                let connectString = '';

                if(config.mongo.username && config.mongo.password) {
                    connectString = `mongodb://${config.mongo.username}:${config.mongo.password}@${config.mongo.host}:${config.mongo.port}/${config.mongo.database}?authSource=admin`;
                } else {
                    connectString = `mongodb://${config.mongo.host}:${config.mongo.port}/${config.mongo.database}`;
                }

                mongoose.connect(connectString, {
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

                        if (await settingsCollection.findOne({type: '__base'}) === null) {
                            const settings = settingsCollection({
                                type: '__base',
                                token: uuidv4(),
                                jwtSecret: uuidv4()
                            });

                            await settings.save();
                            global.log.info('[ORBIT] New settings have been generated!');
                            resolve();
                        } else {
                            resolve();
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
     * Imports a backup into the MongoDB database
     *
     * @return {Promise<unknown>}
     */
    import() {
        return new Promise(async (resolve) => {
            if (!fs.existsSync(dev ? `${__dirname}/../../_resources/db/alerts.json` : `${process.env.SNAP_COMMON}/backup/alerts.json`)) {
                global.log.error(`[RESTORE] Missing alerts backup file!`);
                resolve();
                return;
            }

            if (!fs.existsSync(dev ? `${__dirname}/../../_resources/db/apps.json` : `${process.env.SNAP_COMMON}/backup/apps.json`)) {
                global.log.error(`[RESTORE] Missing apps backup file!`);
                resolve();
                return;
            }

            if (!fs.existsSync(dev ? `${__dirname}/../../_resources/db/contacts.json` : `${process.env.SNAP_COMMON}/backup/contacts.json`)) {
                global.log.error(`[RESTORE] Missing contacts backup file!`);
                resolve();
                return;
            }

            if (!fs.existsSync(dev ? `${__dirname}/../../_resources/db/servers.json` : `${process.env.SNAP_COMMON}/backup/servers.json`)) {
                global.log.error(`[RESTORE] Missing servers backup file!`);
                resolve();
                return;
            }

            if (!fs.existsSync(dev ? `${__dirname}/../../_resources/db/settings.json` : `${process.env.SNAP_COMMON}/backup/settings.json`)) {
                global.log.error(`[RESTORE] Missing settings backup file!`);
                resolve();
                return;
            }

            await this.init();

            global.log.info(`[RESTORE] Loading backup files into memory...`);
            const alerts = JSON.parse(fs.readFileSync(dev ? `${__dirname}/../../_resources/db/alerts.json` : `${process.env.SNAP_COMMON}/backup/alerts.json`, 'utf-8'));
            const apps = JSON.parse(fs.readFileSync(dev ? `${__dirname}/../../_resources/db/apps.json` : `${process.env.SNAP_COMMON}/backup/apps.json`, 'utf-8'));
            const contacts = JSON.parse(fs.readFileSync(dev ? `${__dirname}/../../_resources/db/contacts.json` : `${process.env.SNAP_COMMON}/backup/contacts.json`, 'utf-8'));
            const servers = JSON.parse(fs.readFileSync(dev ? `${__dirname}/../../_resources/db/servers.json` : `${process.env.SNAP_COMMON}/backup/servers.json`, 'utf-8'));
            const settings = JSON.parse(fs.readFileSync(dev ? `${__dirname}/../../_resources/db/settings.json` : `${process.env.SNAP_COMMON}/backup/settings.json`, 'utf-8'));

            // Cleanup database before import
            global.log.info(`[RESTORE] Dropping the following collection(s): alert,app,contact,server,settings...`);
            await alertCollection.deleteMany({});
            await appCollection.deleteMany({});
            await contactCollection.deleteMany({});
            await serverCollection.deleteMany({});
            await settingsCollection.deleteMany({});

            // Import new entries
            for(let item = 0; item < alerts.length; item++) {
                global.log.info(`[RESTORE] Importing Alert ID: ${alerts[item]._id}`);
                await new alertCollection(alerts[item]).save();
            }

            for(let item = 0; item < apps.length; item++) {
                global.log.info(`[RESTORE] Importing App ID: ${apps[item]._id}`);
                await new appCollection(apps[item]).save();
            }

            for(let item = 0; item < contacts.length; item++) {
                global.log.info(`[RESTORE] Importing Contact ID: ${contacts[item]._id}`);
                await new contactCollection(contacts[item]).save();
            }

            for(let item = 0; item < servers.length; item++) {
                global.log.info(`[RESTORE] Importing Server ID: ${servers[item]._id}`);
                await new serverCollection(servers[item]).save();
            }

            for(let item = 0; item < settings.length; item++) {
                global.log.info(`[RESTORE] Importing Setting ID: ${settings[item]._id}`);
                await new settingsCollection(settings[item]).save();
            }

            global.log.info(`[RESTORE] Complete!`);

            this.close();

            resolve();
        })
    }

    /**
     * Exports the MongoDB database to JSON files
     *
     * @return {Promise<unknown>}
     */
    export() {
        return new Promise(async (resolve) => {
            await this.init();

            const alerts = await alertCollection.find();
            global.log.info(`[BACKUP] Exporting ${alerts.length} alert(s)...`);

            const apps = await appCollection.find();
            global.log.info(`[BACKUP] Exporting ${apps.length} app(s)...`);

            const contacts = await contactCollection.find();
            global.log.info(`[BACKUP] Exporting ${contacts.length} contact(s)...`);

            const servers = await serverCollection.find();
            global.log.info(`[BACKUP] Exporting ${servers.length} server(s)...`);

            const settings = await settingsCollection.find();
            global.log.info('[BACKUP] Exporting settings...');

            if(!dev) {
                if (!fs.existsSync(`${process.env.SNAP_COMMON}/backup`)) {
                    fs.mkdirSync(`${process.env.SNAP_COMMON}/backup`);
                }
            }

            fs.writeFileSync(dev ? `${__dirname}/../../_resources/db/alerts.json` : `${process.env.SNAP_COMMON}/backup/alerts.json`, JSON.stringify(alerts));
            fs.writeFileSync(dev ? `${__dirname}/../../_resources/db/apps.json` : `${process.env.SNAP_COMMON}/backup/apps.json`, JSON.stringify(apps));
            fs.writeFileSync(dev ? `${__dirname}/../../_resources/db/contacts.json` : `${process.env.SNAP_COMMON}/backup/contacts.json`, JSON.stringify(contacts));
            fs.writeFileSync(dev ? `${__dirname}/../../_resources/db/servers.json` : `${process.env.SNAP_COMMON}/backup/servers.json`, JSON.stringify(servers));
            fs.writeFileSync(dev ? `${__dirname}/../../_resources/db/settings.json` : `${process.env.SNAP_COMMON}/backup/settings.json`, JSON.stringify(settings));

            global.log.info('[BACKUP] Complete!');

            this.close();

            resolve();
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
