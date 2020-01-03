/**
 * Import vendor modules
 */
const withSass = require('@zeit/next-sass');

/**
 * Check if we are using the dev version
 */
const dev = process.env.NODE_ENV !== 'production';

module.exports = withSass({
    distDir: '../.next',
    poweredByHeader: false,
    webpack(config) {
        if (dev) {
            config.module.rules.push({
                enforce: 'pre',
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
                options: {
                    failOnError: true,
                    failOnWarning: false
                }
            });
        }

        return config;
    }
});
