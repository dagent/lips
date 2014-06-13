/* tcp listener for inputs to client (webpage) meters
 *
 * Author: David A. Gent
 * v1.0 complete 8 August 2012
 */

var logging = require('./loggerNode.js'),
    Logger_Diag = logging.Logger_Diag;
var net = require('net');


// ================== tcpOnConnection
var tcpOnConnection = function(socket, myMeter){

    var localAddress = socket.address();
    var localPort = localAddress["port"];
    
    var socketStr = socket.remoteAddress + ':' + socket.remotePort ;
    var myMeterName = myMeter.name;

	socket.setEncoding('utf8');
    socket.write('hello there ' + socketStr + ' ; you are connected to meter ' +
                    myMeterName + '!\r\n');

    Logger_Diag(1, "tcpServer incoming connection on port " + localPort +
                                                " for meter " + myMeterName);
    myMeter.input[socketStr] = socket;

    socket.on('data', function(data){
        Logger_Diag(4, 'tcpServer received on :' + localPort + " " + data);
        var outMsg = { "meter": myMeterName, "height": data};
        var outMsgJSON = JSON.stringify(outMsg);

        // Loop through available outputs and spit out data from this socket instance.  This seems to be the
        // only real way to do this.

        for ( socketKey in myMeter.output  ) {
                myMeter.output[socketKey].sendUTF(outMsgJSON);
                Logger_Diag(3,"Sent data "+ outMsgJSON + " to meter " + myMeterName);
        };
    });

    socket.on('close', function() {
        Logger_Diag(1, "tcpServer connection on port " + localAddress["port"] +
            " from " + socketStr + " closed.");
            delete myMeter.input[socketStr];
    });
};

// ====== TCP Server creation

// Startup the TCP servers based on the meter object
exports.startMeters = function(meterObj) {
    
    for ( aMeter in meterObj.meter ) {

        var startTCP = function(arrMeter) {

            var myMeter = arrMeter;
            var meterName = myMeter.name;
            var meterPort = myMeter.portIn;

            myMeter.tcpServer = net.createServer();
            myMeter.tcpServer.on('connection', function(socket) {
                tcpOnConnection(socket, myMeter);
            });
            myMeter.tcpServer.on('error', function(e){
                Logger_Diag(1,"tcpServer port " + meterPort + " error: " + e.text);
            });
            myMeter.tcpServer.on('listening', function(){
                Logger_Diag(1, "TCP server started on port " + meterPort + 
                        " for meter " + meterName );
            });
            myMeter.tcpServer.listen(meterPort);

        }(meterObj.meter[aMeter]);
    }

}
