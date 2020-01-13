/**
 * Import vendor packages
 */
const fs = require('fs');

/**
 * Import base packages
 */
const deepmerge = require('deepmerge');

/**
 * Check if we are using the dev version
 */
const dev = process.env.NODE_ENV !== 'production';

/**
 * Define base config
 */
const baseConfig = {
    application: {},
    log: {
        level: "info"
    },
    jwt: {
        algorithm: "HS512",
        expiresIn: "24h"
    },
    login: {
        username: "admin",
        password: "admin@orbit!"
    }
};

/**
 * Builds the config and then returns it when correct
 */
try {
    module.exports = deepmerge(baseConfig, eval('require')(dev ? `${__dirname}/config.json` : `${process.env.SNAP_COMMON}/config.json`));
} catch (e) {
    const config = fs.readFileSync(__dirname + '/../../_scripts/config/config.build.json', 'utf8');
    fs.writeFileSync(dev ? `${__dirname}/config.json` : `${process.env.SNAP_COMMON}/config.json`, config);
    console.log(`[CONFIG] Default config has been saved! Location: ${dev ? `${__dirname}/config.json` : `${process.env.SNAP_COMMON}/config.json`}`);

    module.exports = deepmerge(baseConfig, JSON.parse(config));
}
