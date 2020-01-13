import React, {Component} from 'react';
import Head from 'next/head';
import {connect} from 'unistore/react';

import Settings from '../../components/icons/Settings';
import Modal from '../../components/Modal';
import Welcome from '../../components/Welcome';

import strings from '../../utils/strings';

class Servers extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.state = {
            dataFetched: false,
            servers: [],
            modalOpen: false,
            modalServer: {
                os: {},
                process: {},
                public: {}
            }
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
                        dataFetched: true,
                        servers: data.servers
                    });
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    /**
     * Opens the modal
     *
     * @param server
     */
    openModal(server) {
        this.setState({
            modalOpen: true,
            modalServer: server
        });
    }

    /**
     * Closes the modal
     */
    closeModal() {
        this.setState({
            modalOpen: false,
            modalServer: {
                os: {},
                process: {},
                public: {}
            }
        });
    }

    /**
     * React render function
     *
     * @returns {*}
     */
    render() {
        // Check if app is clean installed
        if(this.state.dataFetched && this.state.servers.length < 1) {
            return (
                <main className="col-md-10 ml-sm-auto px-4">
                    <Head>
                        <title>Servers | Orbit</title>
                        <meta property="og:title" content={`Servers | Orbit`}/>
                    </Head>
                    <Welcome/>
                </main>
            )
        }

        return (
            <main className="col-md-10 ml-sm-auto px-4">
                <Head>
                    <title>Servers | Orbit</title>
                    <meta property="og:title" content={`Servers | Orbit`}/>
                </Head>
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 className="h2">Servers</h1>
                </div>
                {this.state.modalOpen &&
                    <Modal title={`Server: ${this.state.modalServer.os.hostname}`} close={() => this.closeModal()}>
                        <div className="row">
                            <div className="col-sm">
                                <h3>System</h3>
                                <div className="table-responsive">
                                    <table className="table table-striped table-sm">
                                        <tbody>
                                            <tr>
                                                <td>Type</td>
                                                <td>{this.state.modalServer.os.type}</td>
                                            </tr>
                                            <tr>
                                                <td>Platform</td>
                                                <td>{this.state.modalServer.os.platform}</td>
                                            </tr>
                                            <tr>
                                                <td>Release</td>
                                                <td>{this.state.modalServer.os.release}</td>
                                            </tr>
                                            <tr>
                                                <td>Architecture</td>
                                                <td>{this.state.modalServer.os.arch}</td>
                                            </tr>
                                            <tr>
                                                <td>Processor</td>
                                                <td>{this.state.modalServer.os.cpus[0].model}</td>
                                            </tr>
                                            <tr>
                                                <td>Free Memory</td>
                                                <td>{strings.formatBytes(this.state.modalServer.os.freemem)}</td>
                                            </tr>
                                            <tr>
                                                <td>Total Memory</td>
                                                <td>{strings.formatBytes(this.state.modalServer.os.totalmem)}</td>
                                            </tr>
                                            <tr>
                                                <td>Uptime</td>
                                                <td>{strings.secondsToTime(this.state.modalServer.os.uptime)} ({this.state.modalServer.os.uptime})</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="col-sm">
                                <h3>Public Network</h3>
                                <div className="table-responsive">
                                    <table className="table table-striped table-sm">
                                        <tbody>
                                            <tr>
                                                <td>Public IP</td>
                                                <td>{this.state.modalServer.public.ip}</td>
                                            </tr>
                                            <tr>
                                                <td>Country Code</td>
                                                <td>{this.state.modalServer.public.country_code}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <h3>Private Network</h3>
                                <div className="table-responsive">
                                    <table className="table table-striped table-sm">
                                        <thead>
                                            <tr>
                                                <th>Interface</th>
                                                <th>CIDR</th>
                                                <th>MAC</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.keys(this.state.modalServer.os.networkInterfaces).map((key) => {
                                                const cidrs = this.state.modalServer.os.networkInterfaces[key].map((network) => {
                                                    return network.cidr;
                                                });
                                                const macs = this.state.modalServer.os.networkInterfaces[key].map((network) => {
                                                    return network.mac;
                                                });

                                                return (
                                                    <tr key={key}>
                                                        <td>{key}</td>
                                                        <td>{cidrs.join(', ')}</td>
                                                        <td>{macs.join(', ')}</td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </Modal>
                }
                <div className="table-responsive">
                    <table className="table table-striped table-sm">
                        <thead>
                            <tr>
                                <th>Hostname</th>
                                <th>IP</th>
                                <th>Uptime</th>
                                <th/>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.servers.map((server, key) => (
                                <tr key={key}>
                                    <td>{server.os.hostname}</td>
                                    <td>{server.public.ip} ({server.public.country_code})</td>
                                    <td>{strings.secondsToTime(server.os.uptime)}</td>
                                    <td><Settings height="20px" onClick={() => this.openModal(server)}/></td>
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
