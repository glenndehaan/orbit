/**
 * Import own packages
 */
const appCollection = require('../../collections/App');
const serverCollection = require('../../collections/Server');
const settingsCollection = require('../../collections/Settings');

const alerting = require('../../modules/alerting');

/**
 * Export all app functions
 */
module.exports = {
    /**
     * Returns all apps
     *
     * @param req
     * @param res
     * @return {Promise<void>}
     */
    find: async (req, res) => {
        const apps = await appCollection.find({}, {
            _id: 0
        });

        res.json({
            success: true,
            apps
        });
    },

    /**
     * Creates a new app
     *
     * @param req
     * @param res
     * @return {Promise<*|void|Promise>}
     */
    create: async (req, res) => {
        // Check if the bearer is oke
        if (typeof req.headers.bearer === "undefined" || req.headers.bearer === '') {
            global.log.error('[ORBIT] Api missing headers!');

            return res.json({
                status: 'ERROR'
            });
        }

        const settings = await settingsCollection.findOne({type: '__base'});

        if (settings === null || settings.token !== req.headers.bearer) {
            global.log.error('[ORBIT] Incorrect token!');

            return res.json({
                status: 'ERROR'
            });
        }

        // Check if body is oke
        if (typeof req.body.id === "undefined" || req.body.id === '') {
            global.log.error('[ORBIT] Incorrect body!');

            return res.json({
                status: 'ERROR'
            });
        }

        // Check if an entry already exists
        const appCheck = await appCollection.findOne({id: req.body.id});

        if (appCheck === null) {
            // Store the data in mongo
            const app = new appCollection(req.body);
            await app.save();

            // Send new app alert
            await alerting.send("app-discovered", req.body);

            global.log.info(`[ORBIT] New app created (ID: ${req.body.id})`);
        } else {
            // Store the data in mongo
            await appCollection.findOneAndReplace({
                id: req.body.id
            }, req.body);

            global.log.info(`[ORBIT] Update app (ID: ${req.body.id})`);
        }

        // Check if an entry already exists
        const serverCheck = await serverCollection.findOne({hostname: req.body.os.hostname});

        if (serverCheck === null) {
            // Store the data in mongo
            const server = new serverCollection({
                hostname: req.body.os.hostname,
                discovered: new Date().getTime()
            });
            await server.save();

            global.log.info(`[ORBIT] New server created (Hostname: ${req.body.os.hostname})`);
        }

        // Send correct response
        res.json({
            status: 'OK'
        });
    },

    /**
     * Remove an App
     *
     * @param req
     * @param res
     * @return {Promise<void>}
     */
    delete: async (req, res) => {
        const app = await appCollection.findOne({
            id: req.query.id
        });

        const apps = await appCollection.find({
            'os.hostname': app.os.hostname
        });

        if(apps.length < 1) {
            await serverCollection.deleteMany({
                hostname: app.os.hostname
            });
        }

        await appCollection.deleteOne({
            id: req.query.id
        });

        res.json({
            success: true
        });
    }
};
