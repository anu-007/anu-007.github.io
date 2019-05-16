/**
 * library for storage and retrival of data
 */
const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');

//container for data librry
const lib = {};

//base directory for data folder
lib.baseDir = path.join(__dirname, '/../.data/');

//create a document
lib.create = function(dir, file, data, callback) {
    //open a file for writing
    fs.open(lib.baseDir+dir+'/'+file+'.json', 'wx', function(err, fileDescriptor) {
        if(!err && fileDescriptor) {
            //stringify the data
            const str = JSON.stringify(data);

            //write content to file
            fs.write(fileDescriptor, str, function(err) {
                if(!err) {
                    fs.close(fileDescriptor, function(err) {
                        if(!err) {
                            callback(false);
                        } else {
                            callback('error inclosing file');
                        }
                    })
                } else {
                    callback('error in writing data to new file');
                }
            });
        } else {
            callback('could not create a new file it may already esist');
        }
    });
};

//read a document
lib.read = function(dir, file, callback) {
    fs.readFile(lib.baseDir+dir+'/'+file+'.json', 'utf8', function(err, data) {
        if(!err && data) {
            const parsedData = helpers.parseJsonToObject(data);
            callback(false, parsedData);
        } else {
            callback(err, data);
        }
    });
};

//updata a file
lib.update = function(dir, file, data, callback) {
    fs.open(lib.baseDir+dir+'/'+file+'.json', 'r+', function(err, fileDescriptor) {
        if(!err && fileDescriptor) {
            const stringData = JSON.stringify(data);
            //truncate the content of file
            fs.truncate(fileDescriptor, function(err) {
                if(!err) {
                    //write to file and close it
                    fs.writeFile(fileDescriptor, stringData, function(err) {
                        if(!err) {
                            fs.close(fileDescriptor, function(err) {
                                if(!err) {
                                    callback(false);
                                } else {
                                    callback('error closing file');
                                }
                            });
                        } else {
                            callback('error writing to existing file');
                        }
                    });
                } else {
                    callback('error truncating file');
                }
            });
        } else {
            callback('could not open the file for editing');
        }
    });
};

//delete a file
lib.delete = function(dir, file, callback) {
    //unlink the file
    fs.unlink(lib.baseDir+dir+'/'+file+'.json', function(err) {
        if(!err) {
            callback(false);
        } else {
            callback(err);
        }
    });
};

//exporting lib
module.exports = lib;