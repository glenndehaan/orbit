/**
 * Import own packages
 */
const appCollection = require('../collections/App');
const settingsCollection = require('../collections/Settings');

/**
 * Exports the app data endpoint
 *
 * @param req
 * @param res
 */
module.exports = async (req, res) => {
    // Check if the bearer is oke
    if(typeof req.headers.bearer === "undefined" || req.headers.bearer === '') {
        global.log.error('[ORBIT] Api missing headers!');

        return res.json({
            status: 'ERROR'
        });
    }

    const settings = await settingsCollection.findOne({type: '__base'});

    if(settings === null || settings.token !== req.headers.bearer) {
        global.log.error('[ORBIT] Incorrect token!');

        return res.json({
            status: 'ERROR'
        });
    }

    // Check if body is oke
    if(typeof req.body.id === "undefined" || req.body.id === '') {
        global.log.error('[ORBIT] Incorrect body!');

        return res.json({
            status: 'ERROR'
        });
    }

    // Check if an entry already exists
    const appCheck = await appCollection.findOne({id: req.body.id});

    if(appCheck === null) {
        // Store the data in mongo
        const app = new appCollection(req.body);
        await app.save();

        global.log.info(`[ORBIT] New app created (ID: ${req.body.id})`);
    } else {
        // Store the data in mongo
        await appCollection.findOneAndReplace({
            id: req.body.id
        }, req.body);

        global.log.info(`[ORBIT] Update app (ID: ${req.body.id})`);
    }

    // Send correct response
    res.json({
        status: 'OK'
    });
};
