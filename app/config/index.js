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
    login: {
        username: "admin",
        password: "admin@orbit!"
    }
};

/**
 * Builds the config and then returns it when correct
 */
try {
    module.exports = deepmerge(baseConfig, eval('require')(dev ? __dirname + '/config.json' : process.cwd() + '/config.json'));
} catch (e) {
    console.error(`[CONFIG] Does not exist! Location: ${dev ? __dirname + '/config.json' : process.cwd() + '/config.json'}`);
    console.error(e);
    process.exit(1);
}
