import React, {Component} from 'react';

export default class Modal extends Component {
    /**
     * Runs then component mounts
     */
    componentDidMount() {
        document.body.addEventListener('keyup', this.keypress);
    }

    /**
     * Runs then components unmounts
     */
    componentWillUnmount() {
        document.body.removeEventListener('keyup', this.keypress);
    }

    /**
     * Handles a keypress
     *
     * @param e
     */
    keypress = (e) => {
        if (this.props.close) {
            if (e.key === "Escape") {
                this.props.close();
            }
        }
    };

    /**
     * React render function
     *
     * @returns {*}
     */
    render() {
        return (
            <div className="modal fade show" style={{display: 'block'}}>
                <div id="overlay" onClick={this.props.close || null}/>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{this.props.title}</h5>
                            <button type="button" className="close" onClick={this.props.close || null}>
                                <span>&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
