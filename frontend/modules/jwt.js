/**
 * Decodes a JsonWebToken without secret
 *
 * @param token
 * @return {any}
 */
const decode = (token) => {
    return JSON.parse(new Buffer(token.split('.')[1], 'base64').toString());
};

export default {decode};
