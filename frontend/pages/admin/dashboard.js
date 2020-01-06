import React, {Component} from 'react';
import Head from 'next/head';
import Chartist from 'chartist';

export default class Dashboard extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.onlineOfflineChart = null;
    }

    componentDidMount() {
        const data = {
            series: [5, 3, 4]
        };

        const sum = function(a, b) { return a + b };

        new Chartist.Pie(this.onlineOfflineChart, data, {
            labelInterpolationFnc: function(value) {
                return Math.round(value / data.series.reduce(sum) * 100) + '%';
            }
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
                    <title>Dashboard | Orbit</title>
                    <meta property="og:title" content={`Dashboard | Orbit`}/>
                </Head>
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 className="h2">Dashboard</h1>
                    <div className="btn-toolbar mb-2 mb-md-0">
                        <div className="btn-group mr-2">
                            <button type="button" className="btn btn-sm btn-outline-secondary">Share</button>
                            <button type="button" className="btn btn-sm btn-outline-secondary">Export</button>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm">
                        <div className="card">
                            <div className="card-body text-center">
                                10 discovered apps
                            </div>
                        </div>
                    </div>
                    <div className="col-sm">
                        <div className="card">
                            <div className="card-body text-center">
                                2 discovered servers
                            </div>
                        </div>
                    </div>
                    <div className="col-sm">
                        <div className="card">
                            <div className="card-body text-center">
                                5 apps online / 5 apps offline
                                <div ref={(c) => this.onlineOfflineChart = c}/>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }
}
