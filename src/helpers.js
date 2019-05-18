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

// creates a sha256 hash of the password
helpers.hash = function(str) {
    if(typeof(str) == 'string' && str.length > 0) {
        const hash = crypto.createHmac('sha256',config.hashingSecret).update(str).digest('hex');
        return hash;
    } else {
        return false
    }
};

//create a string of random alphanumeric characters, of a given length
helpers.createRandomString = function(strLength) {
    strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
    if(strLength) {
        // define all the posssible characters that can go in the string
        const possibleCharacter = 'abcdefghijklmnopqrstuvwxyz';

        //start the final string
        let str = '';
        for(i = 1; i <= strLength; i++) {
            //get a random character from the possibleCharacters string
            const randomCharacter = possibleCharacter.charAt(Math.floor(Math.random()*possibleCharacter.length)); 
            //append this character to final string
            str += randomCharacter;
        }
        return str;
    } else {
        return false;
    }
};

module.exports = helpers;