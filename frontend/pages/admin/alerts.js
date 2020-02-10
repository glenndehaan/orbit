import React, {Component} from 'react';
import Head from 'next/head';
import Router from 'next/router';
import fetch from 'isomorphic-unfetch';

import Trash from '../../components/icons/Trash';
import Modal from '../../components/Modal';

import strings from '../../utils/strings';

export default class Contacts extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.state = {
            modalOpen: false,
            allAppsSelected: false
        };

        this.contact = null;
        this.app = null;
        this.rule = null;
    }

    /**
     * Opens the modal
     */
    openModal() {
        this.setState({
            modalOpen: true
        });
    }

    /**
     * Closes the modal
     */
    closeModal() {
        this.setState({
            modalOpen: false
        });
    }

    /**
     * Checks if the fields are filled in
     */
    validateForm() {
        let valid = true;
        this.contact.classList.remove("is-invalid");
        this.app.classList.remove("is-invalid");
        this.rule.classList.remove("is-invalid");

        if(this.contact.value === "") {
            this.contact.classList.add("is-invalid");
            valid = false;
        }

        if(this.app.value === "") {
            this.app.classList.add("is-invalid");
            valid = false;
        }

        if(this.rule.value === "") {
            this.rule.classList.add("is-invalid");
            valid = false;
        }

        // Check initial fields
        if(!valid) {
            return;
        }

        // Send form
        this.submit();
    }

    /**
     * Adds a new alert rule
     */
    submit() {
        const body = {
            contact: this.contact.value,
            app: this.app.value,
            alert: this.rule.value
        };

        fetch(`${this.props.application.host}/api/alert`, {
            credentials: 'same-origin',
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'token': this.props.application.user.token,
                'Content-Type': 'application/json'
            }
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    Router.push('/admin/alerts');
                    this.closeModal();
                }
            })
            .catch((error) => {
                console.error('API Error:', error);
            });
    }

    /**
     * Remove an alert
     *
     * @param id
     */
    delete(id) {
        fetch(`${this.props.application.host}/api/alert?id=${id}`, {
            credentials: 'same-origin',
            method: 'DELETE',
            headers: {
                'token': this.props.application.user.token,
                'Content-Type': 'application/json'
            }
        })
            .then((response) => response.json())
            .then(() => {
                Router.push('/admin/alerts');
            })
            .catch((error) => {
                console.error('API Error:', error);
            });
    }

    /**
     * Updates the all apps selected state
     */
    updateApp() {
        if(this.app.value === "all") {
            this.setState({
                allAppsSelected: true
            });
        } else {
            this.setState({
                allAppsSelected: false
            });
        }
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
                    <title>Alerts | Orbit</title>
                    <meta property="og:title" content={`Alerts | Orbit`}/>
                </Head>
                {this.state.modalOpen &&
                    <Modal title="Create new alert rule" close={() => this.closeModal()}>
                        <div className="form-group">
                            <label htmlFor="contact">Contact</label>
                            <select className="form-control" id="contact" ref={(c) => this.contact = c} defaultValue="">
                                <option value="" disabled>Select a contact</option>
                                {this.props.pageData.contacts.map((contact, key) => (
                                    <option value={contact.id} key={key}>{contact.name} ({contact.service})</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="app">App</label>
                            <select className="form-control" id="app" onChange={() => this.updateApp()} ref={(c) => this.app = c} defaultValue="">
                                <option value="" disabled>Select an app</option>
                                <option value="all">Apply rule to all apps</option>
                                {this.props.pageData.apps.map((app, key) => (
                                    <option value={app.id} key={key}>{app.project} ({app.os.hostname})</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="rule">Rule</label>
                            <select className="form-control" id="rule" ref={(c) => this.rule = c} defaultValue="">
                                <option value="" disabled>Select an alert rule</option>
                                <option value="app-offline">{strings.alertType("app-offline")}</option>
                                <option value="app-online">{strings.alertType("app-online")}</option>
                                <option value="app-discovered" disabled={!this.state.allAppsSelected}>{strings.alertType("app-discovered")}</option>
                            </select>
                        </div>
                        <hr/>
                        <button type="submit" className="btn btn-primary" onClick={() => this.validateForm()}>Save</button>
                    </Modal>
                }
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 className="h2">Alerts</h1>
                    <div className="btn-toolbar mb-2 mb-md-0">
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => this.openModal()}>Add new alert rule</button>
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="table table-striped table-sm">
                        <thead>
                            <tr>
                                <th>Contact</th>
                                <th>App</th>
                                <th>Alert</th>
                                <th/>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.pageData.alerts.map((rule, key) => {
                                const contact = strings.getContactById(this.props.pageData.contacts, rule.contact)[0];
                                const app = rule.app !== "all" ? strings.getAppById(this.props.pageData.apps, rule.app)[0] : 'All apps';

                                return (
                                    <tr key={key}>
                                        <td>{contact.name} ({contact.service})</td>
                                        <td>{typeof app === "string" ? app : `${app.project} (${app.os.hostname})`}</td>
                                        <td>{strings.alertType(rule.alert)}</td>
                                        <td><Trash height="20px" color="#dc3545" onClick={() => this.delete(rule.id)}/></td>
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
