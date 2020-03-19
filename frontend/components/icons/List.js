import React from 'react';

/**
 * Export the List icon
 *
 * @param color
 * @param height
 * @param title
 * @param onClick
 * @return {*}
 * @constructor
 */
const List = ({color, height, title, onClick}) => {
    return (
        <button className="list-icon" title={title} onClick={onClick}>
            <svg viewBox="0 0 16 16" height={height} fill={color}>
                <path fillRule="evenodd" d="M2.5 11.5A.5.5 0 013 11h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5zm0-4A.5.5 0 013 7h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5zm0-4A.5.5 0 013 3h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5z" clipRule="evenodd"/>
            </svg>
        </button>
    )
};

export default List;
