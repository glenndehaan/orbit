import React, {Component} from 'react';
import Head from 'next/head';

export default class Home extends Component {
    /**
     * React render function
     *
     * @returns {*}
     */
    render() {
        return (
            <main>
                <Head>
                    <title>Home | Orbit</title>
                    <meta property="og:title" content={`Home | Orbit`}/>
                </Head>
                Home
            </main>
        );
    }
}
