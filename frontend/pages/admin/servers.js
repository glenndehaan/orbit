import React, {Component} from 'react';
import Head from 'next/head';
import {connect} from 'unistore/react';

class Servers extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.state = {
            servers: []
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
        fetch('/api/servers', {
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
                        servers: data.servers
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
        return (
            <main className="col-md-10 ml-sm-auto px-4">
                <Head>
                    <title>Servers | Orbit</title>
                    <meta property="og:title" content={`Servers | Orbit`}/>
                </Head>
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 className="h2">Servers</h1>
                </div>
                <div className="table-responsive">
                    <table className="table table-striped table-sm">
                        <thead>
                            <tr>
                                <th>Hostname</th>
                                <th>IP</th>
                                <th/>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.servers.map((ip, key) => (
                                <tr key={key}>
                                    <td>hgjhgj</td>
                                    <td>jghghj</td>
                                    <td>jghghj</td>
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
export default connect('user')(Servers);
