import React, {Component} from 'react';
import Head from 'next/head';

import Settings from '../../components/icons/Settings';

export default class Apps extends Component {
    /**
     * React render function
     *
     * @returns {*}
     */
    render() {
        return (
            <main className="col-md-10 ml-sm-auto px-4">
                <Head>
                    <title>Apps | Orbit</title>
                    <meta property="og:title" content={`Apps | Orbit`}/>
                </Head>
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 className="h2">Apps</h1>
                </div>
                <div className="table-responsive">
                    <table className="table table-striped table-sm">
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Name</th>
                                <th>Server</th>
                                <th>IP</th>
                                <th>Last Seen</th>
                                <th/>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span className="dot bg-success"/>Online</td>
                                <td>glenndehaan-website</td>
                                <td>home.devone.nl</td>
                                <td>10.10.288.2</td>
                                <td>15m ago</td>
                                <td><Settings height="20px"/></td>
                            </tr>
                            <tr>
                                <td><span className="dot bg-danger"/>Offline</td>
                                <td>glenndehaan-website-test</td>
                                <td>home.devone.nl</td>
                                <td>10.10.288.2</td>
                                <td>2h ago</td>
                                <td><Settings height="20px"/></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </main>
        );
    }
}
