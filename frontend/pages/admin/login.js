import React, {Component} from 'react';
import Head from 'next/head';
import Router from 'next/router';
import {connect} from 'unistore/react';

import {actions} from '../../modules/store';
import storage from '../../modules/storage';

import Logo from '../../components/icons/Logo';

class Login extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.username = null;
        this.password = null;

        this.state = {
            invalid: false
        }
    }

    /**
     * Runs then component mounts
     */
    componentDidMount() {
        storage.remove('token');
    }

    /**
     * Handles the login
     */
    login() {
        fetch('/api/user/login', {
            credentials: 'same-origin',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: this.username.value,
                password: this.password.value
            })
        })
            .then((response) => response.json())
            .then((data) => {
                if(data.success) {
                    this.props.updateUser(data.token);
                    this.setState({
                        invalid: false
                    });

                    Router.push("/admin/dashboard");
                } else {
                    this.setState({
                        invalid: true
                    });
                }
            })
            .catch((error) => {
                this.setState({
                    invalid: true
                });

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
            <div className="form-signin text-center">
                <Head>
                    <title>Login | Orbit</title>
                    <meta property="og:title" content={`Login | Orbit`}/>
                </Head>
                <Logo height="75px"/><br/>
                <br/>
                <h1 className="h3 mb-3 font-weight-normal">Orbit</h1>
                <label htmlFor="inputEmail" className="sr-only">Email address</label>
                <input type="email" id="inputEmail" className={`form-control ${this.state.invalid ? 'is-invalid' : ''}`} placeholder="Email address" required autoFocus ref={(c) => this.username = c}/>
                <label htmlFor="inputPassword" className="sr-only">Password</label>
                <input type="password" id="inputPassword" className={`form-control ${this.state.invalid ? 'is-invalid' : ''}`} placeholder="Password" required ref={(c) => this.password = c}/>
                <button className="btn btn-lg btn-primary btn-block" type="submit" onClick={(e) => this.login(e)}>Sign in</button>
            </div>
        );
    }
}

/**
 * Connect the store to the component
 */
export default connect('user', actions)(Login);
