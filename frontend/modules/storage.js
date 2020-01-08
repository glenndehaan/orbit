/**
 * Get an item in the storage
 *
 * @param {string} key
 * @return {null|{}}
 */
const get = (key) => {
    if(typeof localStorage === "undefined") return null;
    const state = localStorage.getItem(key);
    if (state === null) return null;
    return JSON.parse(state);
};

/**
 * Set an item in the storage
 *
 * @param {string} key
 * @param {*} state
 */
const set = (key, state) => {
    if(typeof localStorage === "undefined") return null;
    localStorage.setItem(key, JSON.stringify(state));
};

/**
 * Remove an item from the storage
 *
 * @param {string} key
 */
const remove = (key) => {
    if(typeof localStorage === "undefined") return null;
    localStorage.removeItem(key);
};

export default { get, set, remove };
