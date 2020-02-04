/**
 * Import vendor packages
 */
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
const settingsCollection = require('./collections/Settings');
const appController = require('./controllers/api/app');
const userController = require('./controllers/api/user');
const tokenController = require('./controllers/api/token');
const appsController = require('./controllers/api/apps');
const dashboardController = require('./controllers/api/dashboard');
const ipsController = require('./controllers/api/ips');
const serversController = require('./controllers/api/servers');
const contactsController = require('./controllers/api/contacts');
const contactController = require('./controllers/api/contact');
const alertsController = require('./controllers/api/alerts');
const alertController = require('./controllers/api/alert');

/**
 * Define global variables
 */
const dev = process.env.NODE_ENV !== 'production';

/**
 * Define Next.JS variables
 */
let nextReady = false;
const server = express();

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
    if(req.originalUrl !== "/api/user/login" && req.originalUrl !== "/api/app") {
        if(typeof req.headers.token === "undefined" || req.headers.token === "") {
            return res.json({
                success: false,
                error: 'Invalid token!'
            });
        } else {
            // Set current app settings
            const settings = await settingsCollection.findOne({type: '__base'});

            try {
                jwt.verify(req.headers.token, settings.jwtSecret);
            } catch(err) {
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
server.post('/api/app', appController);
server.post('/api/contact', contactController.create);
server.delete('/api/contact', contactController.delete);
server.post('/api/alert', alertController.create);
server.delete('/api/alert', alertController.delete);
server.get('/api/apps', appsController);
server.get('/api/ips', ipsController);
server.get('/api/servers', serversController);
server.get('/api/alerts', alertsController);
server.get('/api/contacts', contactsController);
server.get('/api/dashboard', dashboardController);
server.get('/api/token', tokenController);
server.post('/api/user/login', userController.login);

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

    if(req.originalUrl === "/admin/login") {
        req.session.userLoggedIn = undefined;
    }

    if(req.originalUrl === "/admin") {
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
});

handler.ready.catch(err => {
    console.error(err);
    process.exit(1);
});
