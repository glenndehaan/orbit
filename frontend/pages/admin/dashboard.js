import React, {Component} from 'react';
import Head from 'next/head';
import Link from 'next/link';
// import Chartist from 'chartist';

import strings from '../../utils/strings';

import Welcome from '../../components/Welcome';

export default class Dashboard extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.onlineOfflineChart = null;
    }

    /**
     * Runs then component mounts
     */
    componentDidMount() {
        // this.getDashboardData(() => {
        //     // const data = {
        //     //     series: [this.state.data.totalOnline, this.state.data.totalOffline]
        //     // };
        //     //
        //     // new Chartist.Pie(this.onlineOfflineChart, data, {
        //     //     labelInterpolationFnc: function(value) {
        //     //         return Math.round(value / data.series.reduce(strings.sum) * 100) + '%';
        //     //     }
        //     // });
        // });
    }

    /**
     * React render function
     *
     * @returns {*}
     */
    render() {
        // Check if app is clean installed
        if(this.props.pageData.totalApps < 1) {
            return (
                <main className="col-md-10 ml-sm-auto px-4">
                    <Head>
                        <title>Dashboard | Orbit</title>
                        <meta property="og:title" content={`Dashboard | Orbit`}/>
                    </Head>
                    <Welcome host={this.props.application.host} token={this.props.token}/>
                </main>
            )
        }

        return (
            <main className="col-md-10 ml-sm-auto px-4">
                <Head>
                    <title>Dashboard | Orbit</title>
                    <meta property="og:title" content={`Dashboard | Orbit`}/>
                </Head>
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 className="h2">Dashboard</h1>
                </div>
                <div className="row">
                    <div className="col-sm">
                        <div className="card">
                            <div className="card-body text-center">
                                {this.props.pageData.totalApps} discovered app(s)
                            </div>
                        </div>
                    </div>
                    <div className="col-sm">
                        <div className="card">
                            <div className="card-body text-center">
                                {this.props.pageData.totalServers} discovered server(s)
                            </div>
                        </div>
                    </div>
                    <div className="col-sm">
                        <div className="card">
                            <div className="card-body text-center">
                                {this.props.pageData.totalOnline} app(s) online / {this.props.pageData.totalOffline} app(s) offline
                                <div ref={(c) => this.onlineOfflineChart = c}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm">
                        <h4>Recent Discovered/Recovered Apps</h4>
                        <div className="table-responsive">
                            <table className="table table-striped table-sm">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Server</th>
                                        <th>IP</th>
                                        <th>Last Seen</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.props.pageData.topDiscovered.map((app, key) => (
                                        <tr key={key}>
                                            <td>{app.project}</td>
                                            <td>{app.os.hostname}</td>
                                            <td>{app.public.ip} ({app.public.country_code})</td>
                                            <td>{strings.timeSince(Math.round(app.updated)).text}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Link href="/admin/apps">
                            <a>More</a>
                        </Link>
                    </div>
                    <div className="col-sm">
                        <div className="col-sm">
                            <h4>Offline Apps</h4>
                            <div className="table-responsive">
                                <table className="table table-striped table-sm">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Server</th>
                                            <th>IP</th>
                                            <th>Last Seen</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.props.pageData.topOffline.map((app, key) => (
                                            <tr key={key}>
                                                <td>{app.project}</td>
                                                <td>{app.os.hostname}</td>
                                                <td>{app.public.ip} ({app.public.country_code})</td>
                                                <td>{strings.timeSince(Math.round(app.updated)).text}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <Link href="/admin/apps">
                                <a>More</a>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm">
                        <h4>Recent Discovered IP&apos;s</h4>
                        <div className="table-responsive">
                            <table className="table table-striped table-sm">
                                <thead>
                                    <tr>
                                        <th>IP</th>
                                        <th>Country Code</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.props.pageData.topDiscoveredIps.map((app, key) => (
                                        <tr key={key}>
                                            <td>{app.public.ip} ({app.os.hostname})</td>
                                            <td>{app.public.country_code}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Link href="/admin/ips">
                            <a>More</a>
                        </Link>
                    </div>
                </div>
            </main>
        );
    }
}
