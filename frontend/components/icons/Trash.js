import React from 'react';

/**
 * Export the Trash icon
 *
 * @param color
 * @param height
 * @param onClick
 * @param title
 * @return {*}
 * @constructor
 */
const Trash = ({color, height, onClick, title}) => {
    return (
        <button className="trash-icon" title={title} onClick={onClick}>
            <svg viewBox="0 0 20 20" fill={color} height={height}>
                <path d="M7.5 7.5A.5.5 0 018 8v6a.5.5 0 01-1 0V8a.5.5 0 01.5-.5zm2.5 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0V8a.5.5 0 01.5-.5zm3 .5a.5.5 0 00-1 0v6a.5.5 0 001 0V8z"/>
                <path fillRule="evenodd" d="M16.5 5a1 1 0 01-1 1H15v9a2 2 0 01-2 2H7a2 2 0 01-2-2V6h-.5a1 1 0 01-1-1V4a1 1 0 011-1H8a1 1 0 011-1h2a1 1 0 011 1h3.5a1 1 0 011 1v1zM6.118 6L6 6.059V15a1 1 0 001 1h6a1 1 0 001-1V6.059L13.882 6H6.118zM4.5 5V4h11v1h-11z" clipRule="evenodd"/>
            </svg>
        </button>
    )
};

export default Trash;
