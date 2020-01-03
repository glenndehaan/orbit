/**
 * Import vendor packages
 */
const express = require('express');
const next = require('next');
const instantListen = require('instant-listen');

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
const log = require('simple-node-logger').createSimpleLogger({
    logFilePath: `${__dirname}/log/orbit.log`,
    timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS'
});
log.setLevel('trace');

/**
 * Catch unhandled promise rejections
 */
process.on('unhandledRejection', reason => {
    log.error(reason);
});

/**
 * Create Next.JS app
 */
const handler = instantListen(async () => {
    const nextDir = `${__dirname}/../frontend`;
    const app = next({dev: dev, dir: nextDir, conf: require(`${__dirname}/../next.config.js`)});

    log.info(`[NEXT.JS] Is starting...`);

    const handle = app.getRequestHandler();
    await app.prepare();

    log.info(`[NEXT.JS] Is ready!`);
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
 * Log all requests before anything else
 */
server.use((req, res, next) => {
    log.trace(`[EXPRESS][REQUEST](${req.method}): ${req.originalUrl}`);
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
 * Check if Next.JS is ready to handle requests
 */
server.use((req, res, next) => {
    if (nextReady) {
        return next();
    }

    res.send(`<html><head><title>Next.JS Is Warming Up...</title><style>*{font-family:Verdana,Arial;font-size:20px;font-weight:bold;text-align:center}.text{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}@keyframes blink{0%{opacity:0.2}20%{opacity:1}100%{opacity:0.2}}.loading span{font-family:Verdana;font-size:72px;line-height:20px;animation-name:blink;animation-duration:1.4s;animation-iteration-count:infinite;animation-fill-mode:both}.loading span:nth-child(2){animation-delay:0.2s}.loading span:nth-child(3){animation-delay:0.4s}</style></head><body> <main> <span class="text"> Next.JS Is Warming Up...<br/>Page will reload when the server is ready<br/> <span class="loading"> <span>.</span> <span>.</span> <span>.</span> </span> </main> <script>setInterval(function(){const xhr=new XMLHttpRequest();xhr.onreadystatechange=()=>{if(xhr.readyState===XMLHttpRequest.DONE){if(xhr.status===200){if(xhr.responseText==='true'){window.location.reload();}}}};xhr.open("GET","/next-ready-check-url",true);xhr.send();},1000);</script> </body></html>`);
});

/**
 * Let Next.JS serve everything!
 */
server.use(handler);

/**
 * Start server on specific port
 */
server.listen(3000, "0.0.0.0", err => {
    if (err) throw err;
    handler.init();
    log.info(`[NODE] Service started with success! App running at: 0.0.0.0:3000`);
});

handler.ready.catch(err => {
    console.error(err);
    process.exit(1);
});
