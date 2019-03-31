/**
 * primary file for server
 * 
 */

 const server = require('./src/server');

 //container for app
 const app = {};

 app.init = function() {
    //starting server
    server.init();
 }

 app.init();

 //export app
 module.exports = app;