/**
 * helpers and utility
 */

//containers for helpers
const helpers = {};

//parse json to obj without throwing error
helpers.parseJsonToObject = function(str) {
    try {
        const obj = JSON.parse(str);
        return obj;
    } catch(err) {
        return {};
    }
};

module.exports = helpers;