import React, {Component} from 'react';
import Head from 'next/head';
import {connect} from 'unistore/react';

import Settings from '../../components/icons/Settings';
import Modal from '../../components/Modal';

import strings from '../../utils/strings';

class Apps extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.state = {
            token: '[token]',
            apps: [],
            modalOpen: false,
            modalApp: {
                os: {},
                process: {}
            }
        };
    }

    /**
     * Runs then component mounts
     */
    componentDidMount() {
        this.getToken();
        this.getApps();
    }

    /**
     * Get the app token
     */
    getToken() {
        fetch('/api/token', {
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
                        token: data.token
                    });
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    /**
     * Get all apps
     */
    getApps() {
        fetch('/api/apps', {
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
                        apps: data.apps
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
                process: {}
            }
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
                    <title>Apps | Orbit</title>
                    <meta property="og:title" content={`Apps | Orbit`}/>
                </Head>
                {this.state.modalOpen &&
                    <Modal title={`App: ${this.state.modalApp.project} (${this.state.modalApp.os.hostname})`} close={() => this.closeModal()}>
                        Hoi
                    </Modal>
                }
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 className="h2">Apps</h1>
                    <div className="btn-toolbar mb-2 mb-md-0">
                        <div className="btn-group mr-2">
                            App token: {this.state.token}
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
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.apps.map((app, key) => {
                                const timeType = strings.timeSince(Math.round(app.updated)).type;
                                const timeNumber = strings.timeSince(Math.round(app.updated)).number;

                                const offline = (timeType === "minute" && timeNumber > 20) || (timeType === "hour" || timeType === "day" || timeType === "month" || timeType === "year");

                                return (
                                    <tr key={key}>
                                        <td><span className={`dot ${offline ? 'bg-danger' : 'bg-success'}`}/>{offline ? 'Offline' : 'Online'}</td>
                                        <td>{app.project}</td>
                                        <td>{app.os.hostname}</td>
                                        <td>10.10.288.2 [Placeholder]</td>
                                        <td>{app.client}</td>
                                        <td>{strings.timeSince(Math.round(app.updated)).text}</td>
                                        <td><Settings height="20px" onClick={() => this.openModal(app)}/></td>
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

/**
 * Connect the store to the component
 */
export default connect('user,server')(Apps);
