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
            <main className="col-md-10 ml-sm-auto px-4">
                <Head>
                    <title>Not Found | Orbit</title>
                    <meta property="og:title" content={`Not Found | Orbit`}/>
                </Head>
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 className="h2">Not Found</h1>
                </div>
                <div>
                    Whoops it seems this page isn&apos;t here anymore. Lets get you back on track:<br/>
                    <a href="/">Home</a>
                </div>
            </main>
        )
    }
}
