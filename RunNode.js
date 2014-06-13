#! /usr/local/bin/node

/* Node.js implementation to input data on 2 listening tcp ports and
 * output to 2 websockets.  Websockets coexist with the HTTP server.
 * Multiple tcp sockets supported.  The websockets listen for a data
 * message from the client before serving the appropriate data from a
 * tcp port.
 * 
 * Author: David A. Gent
 * June 2014
 */


// Functional hand-written modules found in jsnode/
var httpService = require('./jsnode/httpNode.js');
var logging = require('./jsnode/loggerNode.js'),
    Logger_Diag = logging.Logger_Diag;
var tcpService = require('./jsnode/tcpNode.js');
var wsService = require('./jsnode/websocketNode.js');
var meterObj = require('./jsnode/meterNode.js')["meters"];

// npm installed module for option parsing
var optimist = require('optimist'); 

// Defaults
var httpServerPortNum = 8081;
var tcpPortNum = 7331; // Starting port for listeners

// Handle Arguments
var argv = optimist
    .usage('\nUsage: $0 [--port=#] [--loglevel=#] [--tcpport=%]\n\n' +
            '\tDefaults: loglevel=' + logging.diagLoggingLevel +
            ' port=' + httpServerPortNum +
            ' tcpport=' + tcpPortNum)
    .argv;
var intRegex = /^\d+$/;
if ( intRegex.test(argv.port) ) {
    console.error("Option port set")
    httpServerPortNum = argv.port;
}
if ( intRegex.test(argv.tcpport) ) {
    console.error("Option tcpport set")
    tcpPortNum = argv.tcpport;
    meterObj.setPort("left", tcpPortNum);
    meterObj.setPort("right", tcpPortNum + 1);
}
if ( intRegex.test(argv.loglevel) ) {
    logging.diagLoggingLevel = argv.loglevel;
    console.error("loglevel set to " + argv.loglevel);
}
if (argv.help) {
    optimist.showHelp();
    process.exit();
}

// Start the http server
var httpServer = httpService.start(httpServerPortNum),
    serverHTTPres = httpServer.serverHTTPres;

// add a Websocket to the HTTP server
wsService.start(httpServer,meterObj);

// Start the TCP sockets for the left/right meter inputs
tcpService.startMeters(meterObj);


