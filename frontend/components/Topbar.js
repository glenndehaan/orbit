import React, {Component} from 'react';
import Link from 'next/link';
import Router from 'next/router';

import Logo from './icons/Logo';
import List from './icons/List';

export default class Topbar extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.mobileMenuOpen = false;
    }

    /**
     * Toggles the mobile menu
     */
    toggleMenu() {
        if(this.mobileMenuOpen) {
            document.body.classList.remove("mobile-menu-open");
            this.mobileMenuOpen = false;
        } else {
            document.body.classList.add("mobile-menu-open");
            this.mobileMenuOpen = true;
        }
    }

    /**
     * Runs then component mounts
     */
    componentDidMount() {
        Router.events.on('routeChangeComplete', () => this.onRouteChangeComplete());
    }

    /**
     * Runs then component unmounts
     */
    componentWillUnmount() {
        Router.events.off('routeChangeComplete', () => this.onRouteChangeComplete());
    }

    /**
     * Hides the mobile menu if it is still active
     */
    onRouteChangeComplete() {
        document.body.classList.remove("mobile-menu-open");
        this.mobileMenuOpen = false;
    }

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
                        <span className="nav-link-welcome">Welcome: admin,</span>
                        <a className="nav-link nav-link-nospacing" href="/admin/login">Sign out</a>
                    </li>
                </ul>
                <List color="#fff" height="25px" onClick={() => this.toggleMenu()} title="Open/Close Menu"/>
            </nav>
        );
    }
}
