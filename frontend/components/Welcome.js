import React, {Component} from 'react';

import Logo from './icons/Logo';

export default class Welcome extends Component {
    /**
     * React render function
     *
     * @returns {*}
     */
    render() {
        return (
            <div>
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 className="h2">Welcome</h1>
                </div>
                <div className="text-center">
                    <h6>Welcome to:</h6><br/>
                    <Logo color="black" height="75px"/><br/><br/>
                    <strong>Orbit</strong><br/><br/>
                    It seems this is the first time you are launching Orbit.<br/>
                    Or we still didn&apos;t receive any data from a client.<br/>
                    To get started pick an Orbit client of your choice and implement this inside your own application. (<a href="https://github.com/glenndehaan/orbit#orbit-clients" target="_blank" rel="noopener noreferrer">Orbit Clients</a>)<br/>
                    Use the url/token below as connection details inside the Orbit client:<br/><br/>
                    <code>
                        URL: {this.props.host}<br/>
                        Token: {this.props.token}
                    </code>
                </div>
            </div>
        );
    }
}
