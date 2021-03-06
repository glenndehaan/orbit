import React, {Component} from 'react';
import Link from 'next/link';
import {withRouter} from 'next/router';

class Sidenav extends Component {
    /**
     * React render function
     *
     * @returns {*}
     */
    render() {
        return (
            <nav className="col-md-2 d-none d-md-block bg-light sidebar">
                <div className="sidebar-sticky">
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <Link href="/admin/dashboard">
                                <a className={`nav-link ${this.props.router.pathname === '/admin/dashboard' ? 'active' : ''}`}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather">
                                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                                        <polyline points="9 22 9 12 15 12 15 22"/>
                                    </svg>
                                    Dashboard
                                </a>
                            </Link>
                        </li>
                        <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
                            <span>Monitoring</span>
                        </h6>
                        <li className="nav-item">
                            <Link href="/admin/apps">
                                <a className={`nav-link ${this.props.router.pathname === '/admin/apps' ? 'active' : ''}`}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather">
                                        <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                                        <polyline points="2 17 12 22 22 17"/>
                                        <polyline points="2 12 12 17 22 12"/>
                                    </svg>
                                    Apps
                                </a>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/admin/servers">
                                <a className={`nav-link ${this.props.router.pathname === '/admin/servers' ? 'active' : ''}`}>
                                    <svg className="feather" width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M7.75 15.5c.167-.333.25-.833.25-1.5h4c0 .667.083 1.167.25 1.5H13a.5.5 0 010 1H7a.5.5 0 010-1h.75z"/>
                                        <path fillRule="evenodd" d="M15.991 5H4c-.325 0-.502.078-.602.145a.758.758 0 00-.254.302A1.46 1.46 0 003 6.01V12c0 .325.078.502.145.602.07.105.17.188.302.254a1.464 1.464 0 00.538.143L4.01 13H16c.325 0 .502-.078.602-.145a.758.758 0 00.254-.302 1.464 1.464 0 00.143-.538L17 11.99V6c0-.325-.078-.502-.145-.602a.757.757 0 00-.302-.254A1.46 1.46 0 0015.99 5zM16 4H4C2 4 2 6 2 6v6c0 2 2 2 2 2h12c2 0 2-2 2-2V6c0-2-2-2-2-2z" clipRule="evenodd"/>
                                    </svg>
                                    Servers
                                </a>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/admin/ips">
                                <a className={`nav-link ${this.props.router.pathname === '/admin/ips' ? 'active' : ''}`}>
                                    <svg className="feather" width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16 4H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1V5a1 1 0 00-1-1zM4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4z" clipRule="evenodd"/>
                                        <path fillRule="evenodd" d="M8 11a.5.5 0 01.5-.5h3a.5.5 0 010 1h-3A.5.5 0 018 11zM5.146 6.146a.5.5 0 01.708 0l2 2a.5.5 0 010 .708l-2 2a.5.5 0 01-.708-.708L6.793 8.5 5.146 6.854a.5.5 0 010-.708z" clipRule="evenodd"/>
                                    </svg>
                                    IP&apos;s
                                </a>
                            </Link>
                        </li>
                        <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
                            <span>Alerting</span>
                        </h6>
                        <li className="nav-item">
                            <Link href="/admin/contacts">
                                <a className={`nav-link ${this.props.router.pathname === '/admin/contacts' ? 'active' : ''}`}>
                                    <svg className="feather" width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M15 16s1 0 1-1-1-4-6-4-6 3-6 4 1 1 1 1h10zm-9.995-.944v-.002zM5.022 15h9.956a.274.274 0 00.014-.002l.008-.002c-.001-.246-.154-.986-.832-1.664C13.516 12.68 12.289 12 10 12c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664a1.05 1.05 0 00.022.004zm9.974.056v-.002zM10 9a2 2 0 100-4 2 2 0 000 4zm3-2a3 3 0 11-6 0 3 3 0 016 0z" clipRule="evenodd"/>
                                    </svg>
                                    Contacts
                                </a>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/admin/alerts">
                                <a className={`nav-link ${this.props.router.pathname === '/admin/alerts' ? 'active' : ''}`}>
                                    <svg className="feather" width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 17a7 7 0 100-14 7 7 0 000 14zm0 1a8 8 0 100-16 8 8 0 000 16z" clipRule="evenodd"/>
                                        <path d="M9.002 13a1 1 0 112 0 1 1 0 01-2 0zM9.1 6.995a.905.905 0 111.8 0l-.35 3.507a.553.553 0 01-1.1 0L9.1 6.995z"/>
                                    </svg>
                                    Alerts
                                </a>
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
}

/**
 * Export the Sidenav
 */
export default withRouter(Sidenav);
