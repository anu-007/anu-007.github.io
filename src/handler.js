/**
 * request handlers
 */
const _data = require('./data');
const helpers = require('./helpers');

// define handlers
const handlers = {};

/**
 * JSON API handlers
 */

handlers.token = function(data, callback) {
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if(acceptableMethods.indexOf(data.method.toLowerCase()) > -1) {
        handlers._tokens[data.method.toLowerCase()](data,callback);
    } else {
        callback(405);
    }
};

//container for all the tokens method
handlers._tokens = {};

//tokens - post
//required data - phone, password
//optional data - none
handlers._tokens.post = function(data, callback) {
    const userName = typeof(data.payload.userName) === 'string' && data.payload.userName.trim().length > 0 ? data.payload.userName.trim() : false;
    const password = typeof(data.payload.password) === 'string' && data.payload.password.trim().length >= 10 ? data.payload.password : false;
    if(userName && password) {
        _data.read('users', userName, function(err, userData) {
            if(!err && userData) {
                const hashedPassword = helpers.hash(password);
                if(hashedPassword == userData.password) {
                    const tokenId = helpers.createRandomString(20);
                    const expires = Date.now() + 1000*60*60;
                    const tokenObject = {
                        'userName': userName,
                        'id': tokenId,
                        'expiry': expires
                    };

                    _data.create('tokens', tokenId, tokenObject, function(err) {
                        if(!err) {
                            callback(200, tokenObject);
                        } else {
                            console.log(err);
                            callback(500, {'Error': 'could not create the new token'});
                        }
                    });
                } else {
                    callback(400, {'Error': 'password did not match'});
                }
            } else {
                callback(400, {'Error': 'could not find the specified user'});
            }
        });
    } else {
        callback(400, {'Error': 'missing required field'});
    }
};

// tokens -get
//required data: id
//optional data: none
handlers._tokens.get = function(data, callback) {
    const id = typeof(data.queryStringObj.id) == 'string' && data.queryStringObj.id.trim().length == 20 ? data.queryStringObj.id.trim() : false;
    if(id) {
        _data.read('tokens', id, function(err, tokenData) {
            if(!err && tokenData) {
                callback(200, tokenData);
            } else {
                callback(404);
            }
        })
    } else {
        callback(400, {'Error': 'missing required field'});
    }
};

// tokens -put
//required data: id, extend
//optional data: none
handlers._tokens.put = function(err, callback) {
    const id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;
    const extend = typeof(data.payload.extend) == 'boolean' && data.payload.extend == true ? true : false;
    if(id && extend) {
        _data.read('tokens', id, function(err, tokenData) {
            if(!err && tokenData) {
                if(tokenData.expires > Date.now()) {
                    tokenData.expires = Date.now() + 1000*60*60;
                    _data.update('tokens', id, tokenData, function(err) {
                        if(!err) {
                            callback(200);
                        } else {
                            callback(500, {'Error': 'error extending expiry date'});
                        }
                    });
                } else {
                    callback(400, {'Error': 'token already expired and cannot extended'});
                }
            } else {
                callback(404, {'Error': 'specified token does not exist'});
            }
        });
    } else {
        callback(400, {'Error': 'missing required fields'});
    }
};

// tokens -delete
//required data: id
//optional data: none
handlers._tokens.delete = function(err, callback) {
    const id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
    if(id) {
        _data.read('tokens', id, function(err, tokenData) {
            if(!err && tokenData) {
                _data.delete('tokens', id, function(err) {
                    if(err) {
                        callback(200);
                    } else {
                        callback(500, {'Error': 'could not delete token'});
                    }
                });
            } else {
                callback(404, {'Error': 'could not find the specifid token'});
            }
        });
    } else {
        callback(400, {'Error': 'missing required fields'});
    }
};

//verify if a given token id is currently valid for a given user
handlers._tokens.verifyToken = function(id, userName, callback) {
    _data.read('tokes', id, function(err, tokenData) {
        if(!err && tokenData) {
            if(tokenData.userName == userName && tokenData.expires > Date.now()) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    });
}

handlers.notFound = function(data, cb) {
    cb(404, {'Error': 'path not found'});
};

module.exports = handlers;