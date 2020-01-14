import React, {Component} from 'react';
import Head from 'next/head';

import Welcome from '../../components/Welcome';

export default class Ips extends Component {
    /**
     * React render function
     *
     * @returns {*}
     */
    render() {
        // Check if app is clean installed
        if(this.props.pageData.ips.length < 1) {
            return (
                <main className="col-md-10 ml-sm-auto px-4">
                    <Head>
                        <title>IP&apos;s | Orbit</title>
                        <meta property="og:title" content={`IP's | Orbit`}/>
                    </Head>
                    <Welcome host={this.props.application.host} token={this.props.token}/>
                </main>
            )
        }

        return (
            <main className="col-md-10 ml-sm-auto px-4">
                <Head>
                    <title>IP&apos;s | Orbit</title>
                    <meta property="og:title" content={`IP's | Orbit`}/>
                </Head>
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 className="h2">IP&apos;s</h1>
                </div>
                <div className="table-responsive">
                    <table className="table table-striped table-sm">
                        <thead>
                            <tr>
                                <th>IP</th>
                                <th>Country Code</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.pageData.ips.map((ip, key) => (
                                <tr key={key}>
                                    <td>{ip.public.ip}</td>
                                    <td>{ip.public.country_code}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        );
    }
}
