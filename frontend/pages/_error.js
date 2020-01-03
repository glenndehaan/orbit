import React, {Component} from 'react';
import Head from 'next/head';

export default class MyError extends Component {
    /**
     * React render function
     *
     * @returns {*}
     */
    render() {
        return (
            <main>
                <Head>
                    <title>Not Found | Orbit</title>
                    <meta property="og:title" content={`Not Found | Orbit`}/>
                </Head>
                <h2>404 Page not found!</h2>
            </main>
        )
    }
}
