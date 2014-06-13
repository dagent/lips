/* WebSocket service for data exchange of meter information to
 * information to web-browser.  Call from main via
 *      websocketNode.start(httpServer, meterObj)
 *
 * Author: David A. Gent
 * v1.0 complete 8 August 2012
 */


var logging = require('./loggerNode.js'),
    Logger_Diag = logging.Logger_Diag;

var ws = require("websocket");       // npm installed module for WebSockets
var meterObj;

// ====== Websocket Server creation

exports.start = function(httpServer,aMeterObj) {

    meterObj = aMeterObj;
    var WebSocketServer = ws.server;

    wsServer = new WebSocketServer({
        httpServer: httpServer,
        autoAcceptConnections: false
    });
    wsServer.on('request', function(request) {
        WsServerOnRequest(request); 
    });
}

function originIsAllowed(origin) {
// put logic here to detect whether the specified origin is allowed.
return true;
}

var WsServerOnRequest = function(request) {

    // The meterObj.meter[] hash for what this request instance will connect to.  See the message listener.
    var myMeter = "" ;

    request.on('requestAccepted', function(connection) {
        var socketStr = connection.socket.remoteAddress + ':' + connection.socket.remotePort ;
        Logger_Diag(1,"Websocket " + socketStr +" accepted");
    });

    request.on('error', function(e) {
        Logger_Diag(1, "Websocket error: " + e.message);
    });

    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      Logger_Diag(1, (new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }

    try {
        var connection = request.accept(null, request.origin);
    } catch(e) {
        Logger_Diag(1, "Websocket request not accepted");
    }
    var socketStr = connection.socket.remoteAddress + ':' + connection.socket.remotePort ;
    Logger_Diag(2,'Websocket attempted from ' + socketStr);

    connection.on('error', function(e) {
        Logger_Diag(2, "Websocket error " + e.message );
    });

    // Don't actually do anything until we get a valid message from the client, then we add this socket to the
    // meter object or handoff to a joystick

    connection.on('message', function(message) {
        Logger_Diag(3,"Websocket incoming message received");
        // We are expecting { "meter" : name } or {joystick: }
        try { 
            var msgObj = JSON.parse(message.utf8Data);
        } catch(e) {
            Logger_Diag(1, "Error Parsing JSON; closing connection");
            connection.close;
        }
        for ( aKey in msgObj ) {
            Logger_Diag(3,aKey + " -> " + msgObj[aKey]);
        }
        if ( msgObj["meter"] === undefined ) {
            Logger_Diag(1, "Unknown message type -- closing connection");
            connection.close;
            return;
        }
        // Set myMeter by the name the client sent us
        try {
            myMeter = meterObj.getMeter(msgObj["meter"]);
        } catch(e) {
            Logger_Diag(1, "Error matching meter name; closing connection");
            connection.close;
        }

        // Add this connection to myMeter output sockets
        myMeter.output[socketStr] = connection;
        connection.on('close', function(reasonCode, description) {
            delete myMeter.output[socketStr];
            Logger_Diag(1,'Websocket peer ' + socketStr + ' disconnected.');
        });
    });

};

