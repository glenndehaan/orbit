import React, {Component} from 'react';
import Head from 'next/head';
import {connect} from 'unistore/react';

import Welcome from '../../components/Welcome';

class Ips extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.state = {
            dataFetched: false,
            ips: []
        };
    }

    /**
     * Runs then component mounts
     */
    componentDidMount() {
        this.getApps();
    }

    /**
     * Get all apps
     */
    getApps() {
        fetch('/api/ips', {
            credentials: 'same-origin',
            method: 'GET',
            headers: {
                'token': this.props.user.token,
                'Content-Type': 'application/json'
            }
        })
            .then((response) => response.json())
            .then((data) => {
                if(data.success) {
                    this.setState({
                        dataFetched: true,
                        ips: data.ips
                    });
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    /**
     * React render function
     *
     * @returns {*}
     */
    render() {
        // Check if app is clean installed
        if(this.state.dataFetched && this.state.ips.length < 1) {
            return (
                <main className="col-md-10 ml-sm-auto px-4">
                    <Head>
                        <title>IP&apos;s | Orbit</title>
                        <meta property="og:title" content={`IP's | Orbit`}/>
                    </Head>
                    <Welcome/>
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
                            {this.state.ips.map((ip, key) => (
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

/**
 * Connect the store to the component
 */
export default connect('user')(Ips);
