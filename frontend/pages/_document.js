import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
    /**
     * @param ctx
     * @return Object
     */
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps };
    }

    /**
     * React render function
     *
     * @returns {*}
     */
    render() {
        return (
            <Html lang="en">
                <Head>
                    <meta name="description" content="A simple telemetry system to monitor your remote applications"/>

                    <meta property="og:description" content="A simple telemetry system to monitor your remote applications"/>
                    <meta property="og:type" content="website"/>

                    <link rel="manifest" href="/manifest.json"/>
                    <link rel="shortcut icon" href="/images/favicon.ico"/>
                    <link rel="apple-touch-icon" href="/images/icon/logo_192x192.png"/>

                    <meta name="mobile-web-app-capable" content="yes"/>
                    <meta name="theme-color" content="#343a40"/>
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}
