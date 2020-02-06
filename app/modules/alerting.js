/**
 * Import vendor modules
 */
const fetch = require('node-fetch');
const nodemailer = require('nodemailer');
const fs = require('fs');

/**
 * Import own modules
 */
const config = require('../config');
const alertCollection = require('../collections/Alert');
const contactCollection = require('../collections/Contact');

/**
 * Send an email notification
 *
 * @param type
 * @param alert
 * @param contact
 * @param app
 * @return {Promise<unknown>}
 */
const email = (type, alert, contact, app) => {
    return new Promise((resolve) => {
        const transport = nodemailer.createTransport(config.smtp);

        let message = '';
        let title = 'Orbit: ';

        if(type === "app-offline") {
            title += "App Offline";
            message = `<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">An app has gone offline:</p><br/><p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 5px;"><b>Name:</b> ${app.project}</p><p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 5px;"><b>Server:</b> ${app.os.hostname}</p><p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 5px;"><b>IP:</b> ${app.public.ip} (${app.public.country_code})</p><p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;"><b>Client:</b> ${app.client}</p>`;
        }

        if(type === "app-discovered") {
            title += "App Discovered";
            message = `<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">A new app has been discovered!</p><br/><p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 5px;"><b>Name:</b> ${app.project}</p><p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 5px;"><b>Server:</b> ${app.os.hostname}</p><p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 5px;"><b>IP:</b> ${app.public.ip} (${app.public.country_code})</p><p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;"><b>Client:</b> ${app.client}</p>`;
        }

        let template = fs.readFileSync(`${__dirname}/../templates/email.html`, 'utf-8');
        template = template.replace('__CONTENT__', message);
        template = template.replace('__PRE_HEADER__', title);
        template = template.replace('__TITLE__', title);

        transport.sendMail({
            from: config.email.from,
            to: contact.information.to,
            subject: title,
            html: template
        }, () => {
            resolve();
        })
    });
};

/**
 * Send a pushover notification
 *
 * @param type
 * @param alert
 * @param contact
 * @param app
 */
const pushover = (type, alert, contact, app) => {
    let message = '';
    let title = 'Orbit: ';

    if(type === "app-offline") {
        title += "App Offline";
        message = `An app has gone offline: <br/><br/><b> Name:</b> ${app.project}<br/><b> Server:</b> ${app.os.hostname}<br/><b> IP:</b> ${app.public.ip} (${app.public.country_code})<br/><b> Client:</b> ${app.client}`;
    }

    if(type === "app-discovered") {
        title += "App Discovered";
        message = `A new app has been discovered! <br/><br/><b> Name:</b> ${app.project}<br/><b> Server:</b> ${app.os.hostname}<br/><b> IP:</b> ${app.public.ip} (${app.public.country_code})<br/><b> Client:</b> ${app.client}`;
    }

    return new Promise((resolve) => {
        fetch(`https://api.pushover.net/1/messages.json?token=${contact.information.applicationApiKey}&user=${contact.information.destinationKey}&title=${title}&message=${message}&html=1`, {method: 'POST'})
            .then(() => {
                resolve();
            });
    });
};

/**
 * Exports all alerting functions
 */
module.exports = {
    /**
     * Send an alert based on the type
     *
     * @param type
     * @param app
     * @return {Promise<unknown>}
     */
    send: (type, app) => {
        //eslint-disable-next-line
        return new Promise(async (resolve) => {
            const alerts = await alertCollection.find({
                alert: type
            });

            for(let item = 0; item < alerts.length; item++) {
                const alert = alerts[item];
                const contact = await contactCollection.findOne({
                    id: alert.contact
                });

                if(contact.service === "email") {
                    global.log.info(`[ALERT] Send to email!`);
                    await email(type, alert, contact, app);
                }

                if(contact.service === "pushover") {
                    global.log.info(`[ALERT] Send to pushover!`);
                    await pushover(type, alert, contact, app);
                }
            }

            resolve();
        });
    }
};
