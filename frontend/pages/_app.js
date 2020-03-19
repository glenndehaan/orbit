import '../utils/polyfills';

import React from 'react';
import App from 'next/app';
import {withRouter} from 'next/router';
import getConfig from 'next/config';
import fetch from 'isomorphic-unfetch';

import '../scss/style.scss';

import Topbar from '../components/Topbar';
import Sidenav from '../components/Sidenav';
import storage from '../modules/storage';

/**
 * Get data for each page
 *
 * @param baseUrl
 * @param endpoint
 * @param token
 * @return {Promise<unknown>}
 */
const getPageData = (baseUrl, endpoint, token) => {
    return new Promise((resolve) => {
        fetch(`${baseUrl}/api/${endpoint}`, {
            credentials: 'same-origin',
            method: 'GET',
            headers: {
                'token': token,
                'Content-Type': 'application/json'
            }
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    resolve(data);
                }
            })
            .catch((error) => {
                resolve({});
                console.error('API Error:', error);
            });
    });
};

/**
 * Get the app token
 *
 * @param baseUrl
 * @param token
 * @return {Promise<unknown>}
 */
const getAppToken = (baseUrl, token) => {
    return new Promise((resolve) => {
        fetch(`${baseUrl}/api/token`, {
            credentials: 'same-origin',
            method: 'GET',
            headers: {
                'token': token,
                'Content-Type': 'application/json'
            }
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    resolve(data.token);
                }
            })
            .catch((error) => {
                resolve('');
                console.error('API Error:', error);
            });
    });
};

class MyApp extends App {
    /**
     * @return Object
     */
    static async getInitialProps({ctx}) {
        const {publicRuntimeConfig} = getConfig();

        const pageProps = {
            application: {
                ip: ctx.req ? ctx.req.ip : '',
                host: ctx.req ? `${ctx.req.protocol}://${ctx.req.get('host')}` : window.location.origin,
                url: ctx.req ? `${ctx.req.protocol}://${ctx.req.get('host')}${ctx.req.originalUrl}` : window.location.href,
                user: {
                    token: ctx.req ? (ctx.req.session.token ? ctx.req.session.token : '') : (storage.get('token') ? storage.get('token') : '')
                }
            }
        };

        if (ctx.pathname !== "/" && ctx.pathname !== "/admin/login" && ctx.pathname !== "/_error") {
            const apiPath = ctx.pathname.replace('/admin/', '');

            pageProps.pageData = await getPageData(pageProps.application.host, apiPath, pageProps.application.user.token);
            pageProps.token = await getAppToken(pageProps.application.host, pageProps.application.user.token);
        } else {
            pageProps.pageData = {};
            pageProps.token = '';
        }

        pageProps.nextConfig = publicRuntimeConfig;

        return {pageProps};
    }

    /**
     * React render function
     *
     * @returns {*}
     */
    render() {
        const {Component, pageProps, router} = this.props;

        if (router.pathname === "/") {
            return (
                <>
                    <div id="home">
                        <Component {...pageProps} />
                    </div>
                </>
            );
        }

        if (router.pathname === "/admin/login") {
            return (
                <>
                    <div id="signin-page">
                        <Component {...pageProps} />
                    </div>
                </>
            );
        }

        if (router.route === "/_error") {
            return (
                <>
                    <Component {...pageProps} />
                </>
            );
        }

        return (
            <>
                <Topbar/>
                <div className="container-fluid">
                    <div className="row">
                        <Sidenav/>
                        <Component {...pageProps} />
                    </div>
                </div>
            </>
        );
    }
}

/**
 * Export the app
 */
export default withRouter(MyApp);
