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
            <main className="col-md-10 ml-sm-auto px-4">
                <Head>
                    <title>Home | Orbit</title>
                    <meta property="og:title" content={`Home | Orbit`}/>
                </Head>
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 className="h2">Home</h1>
                </div>
            </main>
        );
    }
}
