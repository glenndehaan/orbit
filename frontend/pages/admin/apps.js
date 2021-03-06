import React, {Component} from 'react';
import Head from 'next/head';

import Trash from '../../components/icons/Trash';
import Settings from '../../components/icons/Settings';
import Modal from '../../components/Modal';
import Welcome from '../../components/Welcome';

import strings from '../../utils/strings';
import fetch from "isomorphic-unfetch";
import Router from "next/router";

export default class Apps extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.state = {
            modalOpen: false,
            modalApp: {
                os: {},
                process: {},
                public: {}
            }
        };
    }

    /**
     * Opens the modal
     *
     * @param app
     */
    openModal(app) {
        this.setState({
            modalOpen: true,
            modalApp: app
        });
    }

    /**
     * Closes the modal
     */
    closeModal() {
        this.setState({
            modalOpen: false,
            modalApp: {
                os: {},
                process: {},
                public: {}
            }
        });
    }

    /**
     * Remove an app
     *
     * @param id
     */
    delete(id) {
        fetch(`${this.props.application.host}/api/app?id=${id}`, {
            credentials: 'same-origin',
            method: 'DELETE',
            headers: {
                'token': this.props.application.user.token,
                'Content-Type': 'application/json'
            }
        })
            .then((response) => response.json())
            .then(() => {
                Router.push('/admin/apps');
            })
            .catch((error) => {
                console.error('API Error:', error);
            });
    }

    /**
     * React render function
     *
     * @returns {*}
     */
    render() {
        // Check if app is clean installed
        if(this.props.pageData.apps.length < 1) {
            return (
                <main className="col-md-10 ml-sm-auto px-4">
                    <Head>
                        <title>Apps | Orbit</title>
                        <meta property="og:title" content={`Apps | Orbit`}/>
                    </Head>
                    <Welcome host={this.props.application.host} token={this.props.token}/>
                </main>
            )
        }

        return (
            <main className="col-md-10 ml-sm-auto px-4">
                <Head>
                    <title>Apps | Orbit</title>
                    <meta property="og:title" content={`Apps | Orbit`}/>
                </Head>
                {this.state.modalOpen &&
                    <Modal title={`App: ${this.state.modalApp.project} (${this.state.modalApp.os.hostname})`} close={() => this.closeModal()}>
                        <div className="row">
                            <div className="col-sm">
                                <h3>App</h3>
                                <div className="table-responsive">
                                    <table className="table table-striped table-sm">
                                        <tbody>
                                            <tr>
                                                <td>Project</td>
                                                <td>{this.state.modalApp.project}</td>
                                            </tr>
                                            <tr>
                                                <td>Environment</td>
                                                <td>{this.state.modalApp.env}</td>
                                            </tr>
                                            <tr>
                                                <td>Orbit Client</td>
                                                <td>{this.state.modalApp.client}</td>
                                            </tr>
                                            <tr>
                                                <td>UID</td>
                                                <td>{this.state.modalApp.process.uid}</td>
                                            </tr>
                                            <tr>
                                                <td>PID</td>
                                                <td>{this.state.modalApp.process.pid}</td>
                                            </tr>
                                            <tr>
                                                <td>Current Working Directory (cwd)</td>
                                                <td>{this.state.modalApp.process.cwd}</td>
                                            </tr>
                                            <tr>
                                                <td>Architecture</td>
                                                <td>{this.state.modalApp.process.arch}</td>
                                            </tr>
                                            <tr>
                                                <td>Argument Vector</td>
                                                <td>{this.state.modalApp.process.argv.join(', ')}</td>
                                            </tr>
                                            <tr>
                                                <td>Uptime</td>
                                                <td>{strings.secondsToTime(this.state.modalApp.process.uptime)} ({this.state.modalApp.process.uptime})</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <h3>Network</h3>
                                <div className="table-responsive">
                                    <table className="table table-striped table-sm">
                                        <tbody>
                                            <tr>
                                                <td>Public IP</td>
                                                <td>{this.state.modalApp.public.ip}</td>
                                            </tr>
                                            <tr>
                                                <td>Country Code</td>
                                                <td>{this.state.modalApp.public.country_code}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="col-sm">
                                <h3>System</h3>
                                <div className="table-responsive">
                                    <table className="table table-striped table-sm">
                                        <tbody>
                                            <tr>
                                                <td>Type</td>
                                                <td>{this.state.modalApp.os.type}</td>
                                            </tr>
                                            <tr>
                                                <td>Platform</td>
                                                <td>{this.state.modalApp.os.platform}</td>
                                            </tr>
                                            <tr>
                                                <td>Release</td>
                                                <td>{this.state.modalApp.os.release}</td>
                                            </tr>
                                            <tr>
                                                <td>Architecture</td>
                                                <td>{this.state.modalApp.os.arch}</td>
                                            </tr>
                                            <tr>
                                                <td>Processor</td>
                                                <td>{this.state.modalApp.os.cpus[0].model}</td>
                                            </tr>
                                            <tr>
                                                <td>Free Memory</td>
                                                <td>{strings.formatBytes(this.state.modalApp.os.freemem)}</td>
                                            </tr>
                                            <tr>
                                                <td>Total Memory</td>
                                                <td>{strings.formatBytes(this.state.modalApp.os.totalmem)}</td>
                                            </tr>
                                            <tr>
                                                <td>Uptime</td>
                                                <td>{strings.secondsToTime(this.state.modalApp.os.uptime)} ({this.state.modalApp.os.uptime})</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <h3>Network</h3>
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
                                            {Object.keys(this.state.modalApp.os.networkInterfaces).map((key) => {
                                                const cidrs = this.state.modalApp.os.networkInterfaces[key].map((network) => {
                                                    return network.cidr;
                                                });
                                                const macs = this.state.modalApp.os.networkInterfaces[key].map((network) => {
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
                        <h3>App Environment</h3>
                        <div className="table-responsive">
                            <table className="table table-striped table-sm">
                                <thead>
                                    <tr>
                                        <th>Key</th>
                                        <th>Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.keys(this.state.modalApp.process.env).map((key) => (
                                        <tr key={key}>
                                            <td>{key}</td>
                                            <td>{this.state.modalApp.process.env[key]}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Modal>
                }
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 className="h2">Apps</h1>
                    <div className="btn-toolbar mb-2 mb-md-0">
                        <div className="btn-group mr-2">
                            App token: {this.props.token}
                        </div>
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="table table-striped table-sm">
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Name</th>
                                <th>Server</th>
                                <th>IP</th>
                                <th>Client</th>
                                <th>Last Seen</th>
                                <th/>
                                <th/>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.pageData.apps.map((app, key) => {
                                const timeType = strings.timeSince(Math.round(app.updated)).type;
                                const timeNumber = strings.timeSince(Math.round(app.updated)).number;

                                const offline = (timeType === "minute" && timeNumber > 20) || (timeType === "hour" || timeType === "day" || timeType === "month" || timeType === "year");

                                return (
                                    <tr key={key}>
                                        <td><span className={`dot ${offline ? 'bg-danger' : 'bg-success'}`}/>{offline ? 'Offline' : 'Online'}</td>
                                        <td>{app.project}</td>
                                        <td>{app.os.hostname}</td>
                                        <td>{app.public.ip} ({app.public.country_code})</td>
                                        <td>{app.client}</td>
                                        <td>{strings.timeSince(Math.round(app.updated)).text}</td>
                                        <td><Settings height="20px" onClick={() => this.openModal(app)}/></td>
                                        <td><Trash height="20px" color="#dc3545" onClick={() => this.delete(app.id)}/></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </main>
        );
    }
}
