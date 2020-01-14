import React, {Component} from 'react';
import Head from 'next/head';
import Logo from "../components/icons/Logo";

export default class Home extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.state = {
            browser: '',
            resolution: '',
            pixelRatio: '',
            webgl: ''
        }
    }

    /**
     * Runs then component mounts
     */
    componentDidMount() {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        let webgl = '';

        if (gl && gl instanceof WebGLRenderingContext) {
            webgl = "Your browser supports WebGL.";
        } else {
            webgl = "Failed to get WebGL context. Your browser or device may not support WebGL.";
        }

        this.setState({
            browser: navigator.userAgent,
            resolution: window.screen.width * window.devicePixelRatio + "x" + window.screen.height * window.devicePixelRatio,
            pixelRatio: window.devicePixelRatio,
            webgl
        })
    }

    /**
     * React render function
     *
     * @returns {*}
     */
    render() {
        return (
            <div className="home-container text-center">
                <Head>
                    <title>Home | Orbit</title>
                    <meta property="og:title" content={`Home | Orbit`}/>
                </Head>
                <Logo height="75px"/><br/>
                <br/>
                <h1 className="h2">Your Device</h1>
                <strong>IP Address:</strong> {this.props.application.ip === '' ? <span><strong>Unknown!</strong> Please contact your network administrator </span> : this.props.application.ip}<br/><br/>
                <strong>Browser</strong>: {this.state.browser}<noscript>Javascript needs to be enabled to perform this test!</noscript><br/><br/>
                <strong>Resolution</strong>: <span>{this.state.resolution}<noscript>Javascript needs to be enabled to perform this test!</noscript></span><br/><br/>
                <strong>Device Pixel Ratio</strong>: <span>{this.state.pixelRatio}<noscript>Javascript needs to be enabled to perform this test!</noscript></span><br/><br/>
                <strong>WebGL Support</strong>: <span>{this.state.webgl}<noscript>Javascript needs to be enabled to perform this test!</noscript></span>
            </div>
        );
    }
}
