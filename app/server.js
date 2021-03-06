/**
 * Import vendor packages
 */
const program = require('commander');
const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');
const instantListen = require('instant-listen');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const jwt = require('jsonwebtoken');

/**
 * Import own packages
 */
const config = require('./config');

const mongodb = require('./modules/mongodb');
const alerting = require('./modules/alerting');

const settingsCollection = require('./collections/Settings');
const appCollection = require('./collections/App');

const appController = require('./controllers/api/app');
const userController = require('./controllers/api/user');
const tokenController = require('./controllers/api/token');
const dashboardController = require('./controllers/api/dashboard');
const ipController = require('./controllers/api/ip');
const serverController = require('./controllers/api/server');
const contactController = require('./controllers/api/contact');
const alertController = require('./controllers/api/alert');

/**
 * Define global variables
 */
let subcommand = false;
const dev = process.env.NODE_ENV !== 'production';
const sendAlerts = {};

/**
 * Init logger and set log level
 */
global.log = require('simple-node-logger').createSimpleLogger({
    logFilePath: dev ? `${__dirname}/log/orbit.log` : `${process.env.SNAP_COMMON}/orbit.log`,
    timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS'
});
global.log.setLevel(config.log.level);

/**
 * Catch unhandled promise rejections
 */
process.on('unhandledRejection', reason => {
    global.log.error(reason);
});

/**
 * Runs the Express server
 */
const runServer = () => {
    /**
     * Define Next.JS variables
     */
    let nextReady = false;
    const server = express();

    /**
     * Create Next.JS app
     */
    const handler = instantListen(async () => {
        const nextDir = `${__dirname}/../frontend`;
        const nextConfig = require(`${__dirname}/../next.config.js`);

        nextConfig.publicRuntimeConfig = {
            defaultPassword: config.login.username === "admin" && config.login.password === "admin@orbit!"
        };

        const app = next({dev: dev, dir: nextDir, conf: nextConfig});

        global.log.info(`[NEXT.JS] Is starting...`);

        const handle = app.getRequestHandler();
        await app.prepare();

        global.log.info(`[NEXT.JS] Is ready!`);
        nextReady = true;

        return handle;
    });

    /**
     * Trust proxy
     */
    server.enable('trust proxy');

    /**
     * Disable powered by header for security reasons
     */
    server.disable('x-powered-by');

    /**
     * Include express session
     */
    server.use(session({
        secret: 'orbit-server',
        resave: false,
        saveUninitialized: true,
        store: new MemoryStore({
            checkPeriod: 86400000 // prune expired entries every 24h
        }),
        cookie: {secure: false, httpOnly: false}
    }));

    /**
     * Configure app to use bodyParser()
     */
    server.use(bodyParser.urlencoded({extended: true}));
    server.use(bodyParser.json());

    /**
     * Log all requests before anything else
     */
    server.use((req, res, next) => {
        global.log.trace(`[EXPRESS][REQUEST](${req.method}): ${req.originalUrl}`);
        next();
    });

    /**
     * Add Next.JS check route
     */
    server.use((req, res, next) => {
        if (req.originalUrl === "/next-ready-check-url") {
            res.set('Content-Type', 'text/plain');
            return res.status(200).send(`${nextReady}`);
        }

        next();
    });

    /**
     * Add api authentication check
     */
    server.use('/api', async (req, res, next) => {
        if (req.originalUrl !== "/api/user/login" && req.originalUrl !== "/api/app") {
            if (typeof req.headers.token === "undefined" || req.headers.token === "") {
                return res.json({
                    success: false,
                    error: 'Invalid token!'
                });
            } else {
                // Set current app settings
                const settings = await settingsCollection.findOne({type: '__base'});

                try {
                    jwt.verify(req.headers.token, settings.jwtSecret);
                } catch (err) {
                    return res.json({
                        success: false,
                        error: 'Invalid token!'
                    });
                }
            }
        }

        next();
    });

    /**
     * Add api endpoints
     */
    // Functional
    server.post('/api/user/login', userController.login);
    server.post('/api/app', appController.create);
    server.post('/api/contact', contactController.create);
    server.post('/api/alert', alertController.create);

    server.delete('/api/app', appController.delete);
    server.delete('/api/contact', contactController.delete);
    server.delete('/api/alert', alertController.delete);

    server.get('/api/contact', contactController.test);

    // Data
    server.get('/api/apps', appController.find);
    server.get('/api/ips', ipController);
    server.get('/api/servers', serverController);
    server.get('/api/alerts', alertController.find);
    server.get('/api/contacts', contactController.find);
    server.get('/api/dashboard', dashboardController);
    server.get('/api/token', tokenController);

    /**
     * Check if Next.JS is ready to handle requests
     */
    server.use((req, res, next) => {
        if (nextReady) {
            return next();
        }

        res.send(`<html><head><title>Orbit Is Warming Up...</title><style>*{font-family:Verdana,Arial;font-size:20px;font-weight:bold;text-align:center}.text{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}@keyframes blink{0%{opacity:0.2}20%{opacity:1}100%{opacity:0.2}}.loading span{font-family:Verdana;font-size:72px;line-height:20px;animation-name:blink;animation-duration:1.4s;animation-iteration-count:infinite;animation-fill-mode:both}.loading span:nth-child(2){animation-delay:0.2s}.loading span:nth-child(3){animation-delay:0.4s}</style></head><body> <main> <span class="text"> Orbit Is Warming Up...<br/>Page will reload when the server is ready<br/> <span class="loading"> <span>.</span> <span>.</span> <span>.</span> </span> </main> <script>setInterval(function(){const xhr=new XMLHttpRequest();xhr.onreadystatechange=()=>{if(xhr.readyState===XMLHttpRequest.DONE){if(xhr.status===200){if(xhr.responseText==='true'){window.location.reload();}}}};xhr.open("GET","/next-ready-check-url",true);xhr.send();},1000);</script> </body></html>`);
    });

    /**
     * Check if a user is logged in
     */
    server.use((req, res, next) => {
        const splittedUrl = req.originalUrl.split("/");

        if (splittedUrl[1] && splittedUrl[1] === "admin" && req.originalUrl !== "/admin/login") {
            if (req.session.userLoggedIn !== true) {
                return res.redirect(307, '/admin/login');
            }
        }

        if (req.originalUrl === "/admin/login") {
            req.session.userLoggedIn = undefined;
        }

        if (req.originalUrl === "/admin") {
            return res.redirect(307, '/admin/dashboard');
        }

        next();
    });

    /**
     * Let Next.JS serve everything!
     */
    server.use(handler);

    /**
     * Start server on specific port
     */
    mongodb.init().then(() => {
        server.listen(43001, "0.0.0.0", err => {
            if (err) throw err;
            handler.init();
            global.log.info(`[ORBIT] Service started with success! App running at: 0.0.0.0:43001`);
            global.log.info(`[ORBIT] Support and Help: https://github.com/glenndehaan/orbit`);
        });

        // Alerting check
        setInterval(async () => {
            global.log.info('[ALERTS] Checking for new alerts to send...');

            const currentEpoch = new Date();
            const offlineEpoch = new Date(currentEpoch.getTime() - 1200000);

            const onlineApps = await appCollection.find({
                updated: {
                    $gt: offlineEpoch.getTime()
                }
            });
            const offlineApps = await appCollection.find({
                updated: {
                    $lt: offlineEpoch.getTime()
                }
            });

            // Check if app is online
            for (let item = 0; item < onlineApps.length; item++) {
                const app = onlineApps[item];

                if (typeof sendAlerts[app.id] !== "undefined") {
                    // Send online app alert
                    await alerting.send("app-online", app);

                    delete sendAlerts[app.id];
                }
            }

            // Send alerts to offline apps
            for (let item = 0; item < offlineApps.length; item++) {
                const app = offlineApps[item];

                if (typeof sendAlerts[app.id] === "undefined") {
                    // Send offline app alert
                    await alerting.send("app-offline", app);

                    sendAlerts[app.id] = true;
                }
            }
        }, 300000); // 5 minutes
    });

    /**
     * Catch Next.JS Errors
     */
    handler.ready.catch(err => {
        console.error(err);
        process.exit(1);
    });
};

/**
 * Set application name
 */
program.name('orbit');

/**
 * Setup application commands
 */
program
    .command('server')
    .description('starts the orbit server')
    .action(() => {
        subcommand = true;
        runServer();
    });

program
    .command('backup')
    .description('exports the orbit database for migration/backup')
    .action(async () => {
        subcommand = true;
        await mongodb.export();
    });

program
    .command('restore')
    .description('imports an orbit database backup')
    .action(async () => {
        subcommand = true;
        await mongodb.import();
    });

/**
 * Let commander handle process arguments
 */
program.parse(process.argv);

/**
 * Run help when no command is given
 */
if (!subcommand) {
    program.outputHelp();
}
