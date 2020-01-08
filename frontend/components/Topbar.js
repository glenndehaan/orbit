import React, {Component} from 'react';
import Link from 'next/link';

import Logo from './icons/Logo';

export default class Topbar extends Component {
    /**
     * React render function
     *
     * @returns {*}
     */
    render() {
        return (
            <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow text-center">
                <Link href="/admin/dashboard">
                    <a className="navbar-brand col-sm-3 col-md-2 mr-0">
                        <Logo color="white" height="40px"/>
                        <span className="navbar-head">Orbit</span>
                    </a>
                </Link>
                <ul className="navbar-nav px-3">
                    <li className="nav-item text-nowrap">
                        <a className="nav-link" href="/admin/login">Sign out</a>
                    </li>
                </ul>
            </nav>
        );
    }
}
