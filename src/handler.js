/**
 * request handlers
 */
const _data = require('./data');
const helpers = require('./helpers');
const showdown = require('https://cdn.rawgit.com/showdownjs/showdown/<version tag>/dist/showdown.min.js');

// define handlers
const handlers = {};

/**
 * JSON API handlers
 */

handlers.users = function(data, callback) {
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if(acceptableMethods.includes(data.method.toLowerCase()) > -1) {
        handlers._users[data.method.toLowerCase()](data, callback);
    } else {
        callback(405);
    }
};

//container for all the tokens method
handlers._users = {};

//users - get
//reqiore data : phone
//optional data : none
handlers._users.get = function(data, callback) {
    const userName = typeof(data.queryStringObj.userName) == 'string' && data.queryStringObj.userName.trim().length == 12 ? data.queryStringObj.userName.trim() : false;
    if(userName) {
        const token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
        handlers._tokens.verifyToken(token, userName, function(tokenValid) {
            if(tokenValid) {
                _data.read('users', userName, function(err, data) {
                    if(!err && data) {
                        delete data.hashedPassword;
                        callback(200, data);
                    } else {
                        callback(400);
                    }
                });
            } else {
                callback(403, {'Error': 'missing required token in header or token is invalid'});
            }
        });
    } else {
        callback(400, {'Error': 'missing required field'});
    }
};

//users - post
//required data: firstName, lastName, password, phone, tosAgreement
//optional data: none
handlers._users.post = function(data, callback) {
    const userName = typeof(data.payload.userName) == 'string' && data.payload.userName.trim().length > 0 ? data.payload.userName.trim() : false;
    const firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    const lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    const password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    const tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? data.payload.tosAgreement : true;

    if(userName && firstName && lastName && password && tosAgreement) {
        _data.read('users', userName, function(err, data) {
            if(err) {
                const hashedPassword = helpers.hash(password);
                if(hashedPassword) {
                    const userObj = {
                        userName,
                        firstName,
                        lastName,
                        hashedPassword,
                        tosAgreement
                    };

                    _data.create('users', userName, userObj, function(err) {
                        if(!err) {
                            callback(200);
                        } else {
                            console.log(err);
                            callback(500, {'Error': 'could not create new user'});
                        }
                    });
                } else {
                    callback(500, {'Error': 'could not hash password'});
                }
            } else {
                callback(400, {'Error': 'username already exist'});
            }
        });
    } else {
        callback(400, {'Error': 'missing required field'});
    }
};

//users - put
//required data : phone
//optional data : firstName, lastName, password (at least one must be specified)
handlers._users.put = function(data, callback) {
    const userName = typeof(data.payload.userName) == 'string' && data.payload.userName.trim().length > 0 ? data.payload.userName.trim() : false;
    const firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    const lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    const password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    if(userName) {
        if(firstName && lastName && password) {
            const token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
            handlers._tokens.verifyToken(token, userName, function(tokenValid) {
                if(tokenValid) {
                    _data.read('users', userName, function(err, userObj) {
                        if(!err && userObj) {
                            if(firstName) {
                                userObj.firstName = firstName;
                            }
                            if(lastName) {
                                userObj.lastName = lastName;
                            }
                            if(password) {
                                userData.password = helpers.hash(password);
                            }
                            _data.update('users', userObj, function(err, data) {
                                if(!err) {
                                    callback(200);
                                } else {
                                    console.log(err);
                                    callback(500, {'Error': 'could not update data'});
                                }
                            });
                        } else {
                            callback(400, {'Error': 'specified user does not exist'});
                        }
                    });
                } else {
                    callback(403, {'Error': 'missing token or token in header is invalid'});
                }
            });
        } else {
            callback(400, {'Error': 'missing fields to update'});
        }
    } else {
        callback(400, {'Error': 'missing required fields'});
    }
}

//users - delete
//required fields: phone
handlers._users.delete = function(data, callback) {
    const userName = typeof(body.payload.userName) == 'string' && data.payload.userName.trim().length > 0 ? data.payload.userName.trim() : false;
    if(userName) {
        const token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
        handlers._tokens.verifyToken(token, phone, function(tokenIsValid) {
            if(tokenIsValid) {
                _data.read('users', userName, function(err, userObj) {
                    if(!err && userObj) {
                        _data.delete('users', userName, function(err) {
                            if(!err) {
                                const userCards = typeof(userObj.cards) == 'object' && userObj.cards instanceof Array ? userObj.cards : [];
                                const userNotes = typeof(userObj.notes) == 'object' && userObj.notes instanceof Array ? userObj.notes : [];

                                const cardsToDelete = userCards.length;
                                const notesToDelete = userNotes.length;

                                let cardsDeleted = 0;
                                let notesDeleted = 0;
                                let deletionError = false;

                                if(cardsToDelete > 0 || notesToDelete > 0) {
                                    userCards.forEach((cardId) => {
                                        _data.delete('cards', cardId, function(err) {
                                            if(err) {
                                                deletionError = true;
                                            } else {
                                                cardsDeleted += 1;
                                            }
                                        });
                                    });

                                    userNotes.forEach((noteId) => {
                                        _data.delete('notes', notesId, function(err) {
                                            if(err) {
                                                deletionError = true;
                                            } else {
                                                notesDeleted += 1;
                                            }
                                        });
                                    });

                                    if(cardsToDelete == cardsDeleted && notesDeleted == notesToDelete) {
                                        if(!deletionError) {
                                            callback(200);
                                        } else {
                                            callback(500, {'Error': 'Errors encountered while attempting to delete all of the users cards and notes all cards and notes may not have been deleted from system successfully'});
                                        }
                                    }
                                } else {
                                    callback(200);
                                }
                            } else {
                                callback(500, {'Error': 'could not delete user'});   
                            }
                        });
                    } else {
                        callback(400, {'Error': 'could not find the specified user'});
                    }
                });
            } else {
                callback(403, {'Error': 'missing required token in header or token is invalid'});
            }
        });
    } else {
        callback(400, {'Error': 'missing required fields'});
    }
};

//tokens
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

//notes
handlers.notes = function(data, callback) {
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if(acceptableMethods.includes(data.method.toLowerCase()) > -1) {
        handlers._notes[data.method.toLowerCase()](data, callback);
    } else {
        callback(405);
    }
}

//containers for all notes handler
handlers._notes = {};

//notes - post
//required data - content
//optional data - none
handlers._notes.post = function(data, callback) {
    const content = typeof(data.payload.content) == 'string' && data.payload.content.trim().length > 0 ? data.payload.content.trim() : false;
    const tags = typeof(data.payload.tags) == 'object' && data.payload.tags instanceof Array && data.payload.tags.length > 0 ? data.payload.tags : false;

    if(content && tags) {
        const token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
        _data.read('tokens', token, function(err, tokenData) {
            if(!err && tokenData) {
                const userName = tokenData.userName;
                _data.read('users', userName, function(err, userObj) {
                    if(!err && userObj) {
                        const userNotes = typeof(userData.notes) == 'object' && userObj.notes instanceof Array ? userObj.notes : false;
                        const noteId = helpers.createRandomString(20);
                        
                        const notesObj = {
                            id: noteId,
                            content,
                            userName,
                            dateCreated: new Date(),
                            dateUpdated: new Date(),
                            tags
                        };

                        _data.create('notes', notesObj, function(err) {
                            if(!err) {
                                userObj.notes = userNotes;
                                userObj.notes.push(noteId);

                                _data.update('users', userName, userObj, function(err) {
                                    if(!err) {
                                        callback(200, userObj);
                                    } else {
                                        callback(500, {'Error': 'could not update user with new note'});
                                    }
                                });
                            } else {
                                callback(500, {'Error': 'could not creating new note'});
                            }
                        });
                    } else {
                        callback(403);
                    }
                });
            } else {
                callback(401);
            }
        });
    } else {
        callback(400, {'Error': 'missing required field'});
    }
};

//notes -put
//required data- id
//optionals data - content, tags (one must be given)
handlers._notes.put = function(data, callback) {
    const id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;
    const content = typeof(data.payload.content) == 'string' && data.payload.content.trim().length > 0 ? data.payload.content.trim() : false;
    const tags = typeof(data.payload.tags) == 'object' && data.payload.tags instanceof Array && data.payload.tags.length > 0 ? data.payload.tags : false;

    if(id) {
        if(content || tags) {
            _data.read('notes', id, function(err, notesData) {
                if(!err && notesData) {
                    const token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
                    handlers._tokens.verifyToken(token, notesData.userName, function(tokenIsValid) {
                        if(tokenIsValid) {
                            if(content) {
                                notesData.content = content
                            }
                            if(tags) {
                                notesData.tags = tags;
                            }

                            _data.update('notes', id, notesData, function(err) {
                                if(err) {
                                    callback(200);
                                } else {
                                    callback(500, {'Error': 'could not update the note'});
                                }
                            });
                        } else {
                            callback(403);
                        }
                    });
                } else {
                    callback(400, {'Error': 'note id does not exist'});
                }
            });
        } else {
            callback(400, {'Error': 'missing required field'});
        }
    } else {
        callback(400, {'Error': 'missing required field'});
    }
};

//notes- get
// required data - id
// optional data - none
handlers._notes.get = function(data, callback) {
    const id = typeof(data.queryStringObj.id) == 'string' && data.queryStringObj.id.trim().length == 20 ? data.queryStringObj.id.trim() : false;
    if(id) {
        _data.read('notes', id, function(notesData) {
            if(!err && notesData) {
                const token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

                handlers._tokens.verifyToken(token, notesData.userName, function(tokenIsValid) {
                    if(tokenIsValid) {
                        //return the check data
                        callback(200, notesData);
                    } else {
                        callback(403);
                    }
                });
            } else {
                callback(404);
            }
        });
    } else {
        callback(400, {'Error': 'missing required filed'});
    }
};

//notes - delete
//required data - id
//optional data - none
handlers._notes.delete = function(data, callback) {
    const id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
    if(id) {
        _data.read('notes', id, function(err, notesData) {
            if(!err && notesData) {
                const token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

                handlers._tokens.verifyToken(token, notesData.userName, function(tokenIsValid) {
                    if(tokenIsValid) {
                        _data.delete('notes', id, function(err) {
                            if(!err) {
                                _data.read('users', checkData.userPhone, function(err, userData) {
                                    if(!err && userData) {
                                        const userNotes = typeof(userData.notes) == 'object' && userData.notes instanceof Array ? userData.notes : [];
                                        const notePosition = userNotes.indexOf(id);
                                        if(notePosition > -1) {
                                            userNotes.splice(notePosition, 1);
                                            _data.update('users', notesData.userName, userData, function(err) {
                                                if(!err) {
                                                    callback(200);
                                                } else {
                                                    callback(500, {'Error': 'could not update the user'});
                                                }
                                            });
                                        } else {
                                            callback(500, {'Error': 'could not find the notes in users object so could not remove it'});
                                        }
                                    } else {
                                        callback(400, {'Error': 'could not find the specified user'});
                                    }
                                });
                            } else {
                                callback(500, {'Error': 'could not find the user who created the note, so could not remove the note from the list of note on user object'});
                            }
                        });
                    } else {
                        callback(403);
                    }
                });
            } else {
                callback(400, {'Error': 'specified notes id does not exist'});
            }
        });
    } else {
        callback(400, {'Error': 'missing required field'});
    }
};

//cards
handlers.cards = function(data, callback) {
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if(acceptableMethods.includes(data.method.toLowerCase()) > -1) {
        handlers._cards[data.method.toLowerCase()](data, callback);
    } else {
        callback(405);
    }
}

//container for all the cards
handlers._cards = {};

//cards - post
//required data - question, answer
//optional data - none
handlers._cards.post = function(data, callback) {
    const question = typeof(data.payload.question) == 'string' && data.payload.question.trim().length > 0 ? data.payload.question.trim() : false;
    const answer = typeof(data.payload.answer) == 'string' && data.payload.answer.trim().length > 0 ? dagta.payload.answer.trim() : false;

    if(question && answer) {
        const token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
        _data.read('tokens', token, function(err, tokenData) {
            if(!err && tokenData) {
                const userName = tokenData.userName;
                _data.read('users', userName, function(err, userObj) {
                    if(!err && userObj) {
                        const userCards = typeof(userData.cards) == 'object' && userObj.cards instanceof Array ? userObj.cards : false;
                        const cardId = helpers.createRandomString(20);
                        
                        const cardObj = {
                            id: cardId,
                            question,
                            answer,
                            dateCreated: new Date(),
                            dateUpdated: new Date()
                        };

                        _data.create('cards', cardObj, function(err) {
                            if(!err) {
                                userObj.cards = userCards;
                                userObj.cards.push(cardId);

                                _data.update('users', userName, userObj, function(err) {
                                    if(!err) {
                                        callback(200, userObj);
                                    } else {
                                        callback(500, {'Error': 'could not update user with new card'});
                                    }
                                });
                            } else {
                                callback(500, {'Error': 'could not creating new card'});
                            }
                        });
                    } else {
                        callback(403);
                    }
                });
            } else {
                callback(409);
            }
        });
    } else {
        callback(400, {'Error': 'missing required fields'});
    }
};

//cards -put
//required data- id
//optionals data - answer, question (one must be given)
handlers._cards.put = function(data, callback) {
    const id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;
    const question = typeof(data.payload.question) == 'string' && data.payload.question.trim().length > 0 ? data.payload.question.trim() : false;
    const answer = typeof(data.payload.answer) == 'object' && data.payload.answer instanceof Array && data.payload.answer.length > 0 ? data.payload.answer : false;

    if(id) {
        if(question || answer) {
            _data.read('cards', id, function(err, cardsData) {
                if(!err && cardsData) {
                    const token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
                    handlers._tokens.verifyToken(token, cardsData.userName, function(tokenIsValid) {
                        if(tokenIsValid) {
                            if(question) {
                                cardsData.question = question
                            }
                            if(answer) {
                                cardsData.answer = answer;
                            }

                            _data.update('cards', id, cardsData, function(err) {
                                if(err) {
                                    callback(200);
                                } else {
                                    callback(500, {'Error': 'could not update the card'});
                                }
                            });
                        } else {
                            callback(403);
                        }
                    });
                } else {
                    callback(400, {'Error': 'card id does not exist'});
                }
            });
        } else {
            callback(400, {'Error': 'missing required field'});
        }
    } else {
        callback(400, {'Error': 'missing required field'});
    }
};

//cards- get
// required data - id
// optional data - none
handlers._cards.get = function(data, callback) {
    const id = typeof(data.queryStringObj.id) == 'string' && data.queryStringObj.id.trim().length == 20 ? data.queryStringObj.id.trim() : false;
    if(id) {
        _data.read('cards', id, function(cardsData) {
            if(!err && cardsData) {
                const token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

                handlers._tokens.verifyToken(token, cardsData.userName, function(tokenIsValid) {
                    if(tokenIsValid) {
                        callback(200, cardsData);
                    } else {
                        callback(403);
                    }
                });
            } else {
                callback(404);
            }
        });
    } else {
        callback(400, {'Error': 'missing required filed'});
    }
};

//cards - delete
//required data - id
//optional data - none
handlers._cards.delete = function(data, callback) {
    const id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
    if(id) {
        _data.read('cards', id, function(err, cardsData) {
            if(!err && cardsData) {
                const token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

                handlers._tokens.verifyToken(token, cardsData.userName, function(tokenIsValid) {
                    if(tokenIsValid) {
                        _data.delete('cards', id, function(err) {
                            if(!err) {
                                _data.read('users', checkData.userPhone, function(err, userData) {
                                    if(!err && userData) {
                                        const usercards = typeof(userData.cards) == 'object' && userData.cards instanceof Array ? userData.cards : [];
                                        const cardPosition = usercards.indexOf(id);
                                        if(cardPosition > -1) {
                                            usercards.splice(cardPosition, 1);
                                            _data.update('users', cardsData.userName, userData, function(err) {
                                                if(!err) {
                                                    callback(200);
                                                } else {
                                                    callback(500, {'Error': 'could not update the user'});
                                                }
                                            });
                                        } else {
                                            callback(500, {'Error': 'could not find the cards in users object so could not remove it'});
                                        }
                                    } else {
                                        callback(400, {'Error': 'could not find the specified user'});
                                    }
                                });
                            } else {
                                callback(500, {'Error': 'could not find the user who created the card, so could not remove the card from the list of card on user object'});
                            }
                        });
                    } else {
                        callback(403);
                    }
                });
            } else {
                callback(400, {'Error': 'specified cards id does not exist'});
            }
        });
    } else {
        callback(400, {'Error': 'missing required field'});
    }
};

//not found
handlers.notFound = function(data, cb) {
    cb(404, {'Error': 'path not found'});
};

module.exports = handlers;