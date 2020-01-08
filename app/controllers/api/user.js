/**
 * Import vendor modules
 */
const jwt = require('jsonwebtoken');

/**
 * Import own modules
 */
const config = require('../../config');
const settingsCollection = require('../../collections/Settings');

/**
 * Exports the user endpoints
 */
module.exports = {
    /**
     * Login endpoint
     *
     * @param req
     * @param res
     */
    login: async (req, res) => {
        // Check if a username/password has been send
        if (typeof req.body.username === "undefined" || req.body.username === "" || typeof req.body.password === "undefined" || req.body.password === "") {
            return res.json({
                success: false,
                error: "Missing username/password!"
            });
        }

        // Check if the username/password is oke
        if (req.body.username !== config.login.username || req.body.password !== config.login.password) {
            return res.json({
                success: false,
                error: "Incorrect username/password!"
            });
        }

        // Set current app settings
        const settings = await settingsCollection.findOne({type: '__base'});

        // Generate token
        const token = jwt.sign({username: req.body.username}, settings.jwtSecret, {
            algorithm: config.jwt.algorithm,
            expiresIn: config.jwt.expiresIn
        });

        // Set session
        req.session.userLoggedIn = true;

        // Send success
        res.json({
            success: true,
            token
        });
    }
};
