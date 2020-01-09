import React, {Component} from 'react';

export default class Modal extends Component {
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
