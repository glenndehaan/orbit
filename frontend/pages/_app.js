import '../utils/polyfills';

import React from 'react';
import App from 'next/app';
import {Provider} from 'unistore/react';
import {withRouter} from 'next/router';

import store from '../modules/store';

import '../scss/style.scss';
import Topbar from "../components/Topbar";
import Sidenav from "../components/Sidenav";

class MyApp extends App {
    /**
     * @return Object
     */
    static async getInitialProps() {
        return {};
    }

    /**
     * React render function
     *
     * @returns {*}
     */
    render() {
        const {Component, pageProps, router} = this.props;

        if(router.pathname === "/admin/login") {
            return (
                <Provider store={store}>
                    <div id="signin-page">
                        <Component {...pageProps} />
                    </div>
                </Provider>
            );
        }

        return (
            <Provider store={store}>
                <>
                    <Topbar/>
                    <div className="container-fluid">
                        <div className="row">
                            <Sidenav/>
                            <Component {...pageProps} />
                        </div>
                    </div>
                </>
            </Provider>
        );
    }
}

/**
 * Export the app
 */
export default withRouter(MyApp);
