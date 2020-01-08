import createUnistore from 'unistore';
import devtools from 'unistore/devtools';

import storage from './storage';
import jwt from './jwt';

/**
 * Exports the store with the default state
 *
 * @return {any}
 */
const createStore = () => {
    const tokenContents = storage.get('token') ? jwt.decode(storage.get('token')) : false;
    const currentTime = Math.round(new Date().getTime() / 1000);
    const tokenValid = tokenContents ? currentTime < tokenContents.exp : false;

    const initialState = {
        user: {
            loginValid: tokenValid,
            loggedIn: !!storage.get('token'),
            token: storage.get('token') ? storage.get('token') : ''
        }
    };

    return typeof window === "undefined" || process.env.NODE_ENV === 'production' ? createUnistore(initialState) : devtools(createUnistore(initialState));
};

/**
 * All action for mutating the store
 *
 * @return {*}
 */
const actions = () => {
    return {
        updateUser(state, payload) {
            storage.set('token', payload);

            return {
                user: {
                    loginValid: true,
                    loggedIn: true,
                    token: payload
                }
            };
        }
    };
};

export { actions };
export default createStore();
