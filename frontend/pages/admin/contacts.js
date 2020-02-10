import React, {Component} from 'react';
import Head from 'next/head';
import Router from 'next/router';
import fetch from 'isomorphic-unfetch';

import Trash from '../../components/icons/Trash';
import Modal from '../../components/Modal';

export default class Contacts extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.state = {
            modalOpen: false,
            type: ''
        };

        this.contactName = null;
        this.serviceType = null;

        this.email = {
            to: null
        };

        this.pushover = {
            destinationKey: null,
            applicationApiKey: null
        };

        this.slack = {
            url: null
        };
    }

    /**
     * Opens the modal
     */
    openModal() {
        this.setState({
            modalOpen: true,
            type: ''
        });
    }

    /**
     * Closes the modal
     */
    closeModal() {
        this.setState({
            modalOpen: false,
            type: ''
        });
    }

    /**
     * Updates the service type from the dropdown
     */
    updateType() {
        this.setState({
            type: this.serviceType.value
        });
    }

    /**
     * Checks if the fields are filled in
     */
    validateForm() {
        let firstValid = true;
        this.contactName.classList.remove("is-invalid");
        this.serviceType.classList.remove("is-invalid");

        if(this.contactName.value === "") {
            this.contactName.classList.add("is-invalid");
            firstValid = false;
        }

        if(this.serviceType.value === "") {
            this.serviceType.classList.add("is-invalid");
            firstValid = false;
        }

        // Check initial fields
        if(!firstValid) {
            return;
        }

        // Get service fields
        let secondValid = true;
        const fields = Object.keys(this[this.state.type]);
        for(let item = 0; item < fields.length; item++) {
            const field = this[this.state.type][fields[item]];
            field.classList.remove("is-invalid");

            if(field.value === "") {
                field.classList.add("is-invalid");
                secondValid = false;
            }
        }

        // Check service fields
        if(!secondValid) {
            return;
        }

        // Send form
        this.submit();
    }

    /**
     * Adds a new contact
     */
    submit() {
        const body = {
            name: this.contactName.value,
            service: this.serviceType.value,
            information: {}
        };

        const fields = Object.keys(this[this.state.type]);
        for(let item = 0; item < fields.length; item++) {
            const name = fields[item];
            const field = this[this.state.type][name];

            body.information[name] = field.value;
        }

        fetch(`${this.props.application.host}/api/contact`, {
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
                    Router.push('/admin/contacts');
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
        fetch(`${this.props.application.host}/api/contact?id=${id}`, {
            credentials: 'same-origin',
            method: 'DELETE',
            headers: {
                'token': this.props.application.user.token,
                'Content-Type': 'application/json'
            }
        })
            .then((response) => response.json())
            .then(() => {
                Router.push('/admin/contacts');
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
        return (
            <main className="col-md-10 ml-sm-auto px-4">
                <Head>
                    <title>Contacts | Orbit</title>
                    <meta property="og:title" content={`Contacts | Orbit`}/>
                </Head>
                {this.state.modalOpen &&
                    <Modal title="Create new contact" close={() => this.closeModal()}>
                        <div className="form-group">
                            <label htmlFor="name">Contact Name</label>
                            <input type="text" className="form-control" id="name" ref={(c) => this.contactName = c}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="type">Service Type</label>
                            <select className="form-control" id="type" onChange={() => this.updateType()} ref={(c) => this.serviceType = c} defaultValue="">
                                <option value="" disabled>Select a service type</option>
                                <option value="email">Email</option>
                                <option value="pushover">Pushover</option>
                                <option value="slack">Slack</option>
                            </select>
                        </div>
                        <hr/>
                        {this.state.type === "email" &&
                            <>
                                <h5>Email Service Options</h5>
                                <div className="form-group">
                                    <label htmlFor="email-to">To</label>
                                    <input type="text" className="form-control" id="email-to" ref={(c) => this.email.to = c}/>
                                </div>
                            </>
                        }
                        {this.state.type === "pushover" &&
                            <>
                                <h5>Pushover Service Options</h5>
                                <div className="form-group">
                                    <label htmlFor="pushover-destination-key">Destination key</label>
                                    <input type="text" className="form-control" id="pushover-destination-key" ref={(c) => this.pushover.destinationKey = c}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="pushover-application-api-key">Application API token</label>
                                    <input type="text" className="form-control" id="pushover-application-api-key" ref={(c) => this.pushover.applicationApiKey = c}/>
                                </div>
                            </>
                        }
                        {this.state.type === "slack" &&
                            <>
                                <h5>Slack Service Options</h5>
                                <div className="form-group">
                                    <label htmlFor="slack-webhook-url">Webhook URL</label>
                                    <input type="text" className="form-control" id="slack-webhook-url" ref={(c) => this.slack.url = c}/>
                                </div>
                            </>
                        }
                        <hr/>
                        <button type="submit" className="btn btn-primary" onClick={() => this.validateForm()}>Save</button>
                    </Modal>
                }
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 className="h2">Contacts</h1>
                    <div className="btn-toolbar mb-2 mb-md-0">
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => this.openModal()}>Add contact</button>
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="table table-striped table-sm">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Service</th>
                                <th/>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.pageData.contacts.map((contact, key) => (
                                <tr key={key}>
                                    <td>{contact.name}</td>
                                    <td>{contact.service}</td>
                                    <td><Trash height="20px" color="#dc3545" onClick={() => this.delete(contact.id)}/></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        );
    }
}
