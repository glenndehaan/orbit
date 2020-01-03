import React, {Component} from 'react';
import Link from 'next/link';

export default class Topbar extends Component {
    /**
     * React render function
     *
     * @returns {*}
     */
    render() {
        return (
            <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                <Link href="/admin/login">
                    <a className="navbar-brand col-sm-3 col-md-2 mr-0">
                        {/*<img src="/images/icon.png" alt="Orbit Logo" width="40" height="40"/>*/}
                        Orbit
                    </a>
                </Link>
                <ul className="navbar-nav px-3">
                    <li className="nav-item text-nowrap">
                        <Link href="/admin/login">
                            <a className="nav-link">Sign out</a>
                        </Link>
                    </li>
                </ul>
            </nav>
        );
    }
}
