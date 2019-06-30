/**
 * primary file for server
 * 
 */
 const http = require('http');
 const url = require('url');
 const { StringDecoder } = require('string_decoder');
 const config = require('../config/default');
 const handlers = require('./handler');
 const helpers = require('./helpers');

 //container for server
 const server = {};

 //http server
 server.httpServer = http.createServer(function(req, res){
     server.unifiedServer(req, res);
 });

 server.unifiedServer = function(req, res) {
    //get parsed url
    const parsedUrl = url.parse(req.url, true);

    //get the path
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g,'');

    //get querystring object
    const queryStringObject = parsedUrl.query;

    //get the method
    const method = req.method;

    //get headers
    const headers = req.headers;

    //getting payload (if any)
    const decoder = new StringDecoder('utf-8');
    let buffer = '';

    req.on('data', (data) => {
        buffer += decoder.write(data);
    });

    req.on('end', _=> {
        buffer += decoder.end();
        //choose the handler this request to go to, if not found use not found handler
        const chooseHandler = typeof(server.router[trimmedPath]) != 'undefined' ? server.router[trimmedPath] : handlers.notFound;

        const data = {
            trimmedPath,
            queryStringObject,
            method,
            headers,
            payload: helpers.parseJsonToObject(buffer)
        };

        //route the request to the handler specified in the router
        try {
            chooseHandler(data, function(status, payload, contentType) {
                res.writeHead(status);
                res.end(JSON.stringify(payload));
            });
        } catch(err) {
            // debug(err);
            res.end(JSON.stringify(err));
        }
    });
 };

 //defining the request router
 server.router = {
    '': handlers.index,
    'session/create': handlers.createSession,
    'session/delete': handlers.deleteSession,
    'api/users': handlers.users,
    'api/tokens': handlers.tokens,
    'api/notes': handlers.notes,
    'api/cards': handlers.cards
 };

 //initiate a server instance
 server.init = function() {
    //start the http server
    server.httpServer.listen(config.httpPort, _=> {
        console.log('\x1b[36m%s\x1b[0m', `server is up on port ${config.httpPort} in ${config.envName} mode`);
    });
 };

 //export server
 module.exports = server;