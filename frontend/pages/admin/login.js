import React, {Component} from 'react';
import Head from 'next/head';
import Router from 'next/router';

import '../../scss/pages/login.scss';

export default class Login extends Component {
    /**
     * Handles the login
     */
    login(e) {
        e.preventDefault();
        Router.push("/admin/dashboard");
    }

    /**
     * React render function
     *
     * @returns {*}
     */
    render() {
        return (
            <form className="form-signin text-center">
                <Head>
                    <title>Login | Orbit</title>
                    <meta property="og:title" content={`Login | Orbit`}/>
                </Head>
                <img className="mb-4" src="/images/icon.png" alt="Orbit Logo" width="72" height="72"/>
                <h1 className="h3 mb-3 font-weight-normal">Orbit</h1>
                <label htmlFor="inputEmail" className="sr-only">Email address</label>
                <input type="email" id="inputEmail" className="form-control" placeholder="Email address" required="" autoFocus=""/>
                <label htmlFor="inputPassword" className="sr-only">Password</label>
                <input type="password" id="inputPassword" className="form-control" placeholder="Password" required=""/>
                <button className="btn btn-lg btn-primary btn-block" type="submit" onClick={(e) => this.login(e)}>Sign in</button>
            </form>
        );
    }
}
