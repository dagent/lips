
/* http service
 *
 * Author: David A. Gent
 * v1.0 complete 8 August 2012
 */


// Hopefully getting much of the http out of the main node-input.js program

var logging = require('./loggerNode.js'),
    Logger_Diag = logging.Logger_Diag;
var fs = require('fs');
var http = require('http');

// ====== HTTP Server creation
function start(httpServerPortNum) {
    var httpServer = http.createServer();
    httpServer.on('request', OnRequest);
    httpServer.on('connection', OnConnection);
    httpServer.on('close', OnClose);
    httpServer.listen(httpServerPortNum);
    httpServer.on('listening', function() {
        Logger_Diag(1, "HTTP Server started on port " + httpServerPortNum);
    });
    return httpServer;
}
// === HTTP Server listening functions at the end


// ===== HTTP functions
//=============================== OnRequest
var serverHTTPres = {};
function OnRequest (req, res) {
    var basedir = __dirname + "/../";
	var conn = req.connection;
    var fileExt = "";
    var socketStr = conn.remoteAddress + ':' + conn.remotePort ;

	Logger_Diag(2, 'req.url: ' + req.url);
	Logger_Diag(2, '\nRequest Rcvd ' + Date());
	Logger_Diag(3, 'HEADERS: ' + JSON.stringify(req.headers));
	Logger_Diag(3, 'FROM: ' + socketStr );

    req.addListener('close', function() {
        Logger_Diag(1, 'HTTP server request connection closed from '
            + socketStr );
        delete serverHTTPres[socketStr];
        });
       
	if (req.url.indexOf('/events') === 0) {
        serverHTTPres[socketStr] = res;

		res.writeHead(200, {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			'Connection': 'keep-alive',
			'Access-Control-Allow-Origin': '*'
		});

		res.write(':\n');

	} else {
        // Redirect default URL
		if (req.url === '/') {
			req.url = '/index.html';
		}

        // Return appropriate mime-type
        var fileName = require('url').parse(req.url).pathname;
        Logger_Diag(2, "Filename " + fileName + " requested.");

        var mimeType = FileNameToMimeType(fileName);
		Logger_Diag(2, "Mime type: " +  strMimeType);
        //Check that file exists and output
        fs.stat(basedir + fileName , function(err, stats) {
            // If not, send 404
            if (err) {
                Logger_Diag(2,"Sending 404.");
                res.writeHead(404, {'Content-Type': 'text/html'});
                res.write('<html>File ' + basedir +fileName +' not found</html>\n');
            // If it does, send the file
            } else {
                Logger_Diag(2,"Sending file " + __dirname + req.url );
                res.writeHead(200, {'Content-Type': mimeType });
                res.write(fs.readFileSync(basedir + req.url));
            }
            res.end();
        })
	}
}


//=============================== OnConnection
function OnConnection(socket){
	Logger_Diag(1, "A client connected to the HTTP server from "
        + socket.remoteAddress +":" + socket.remotePort);
}
//=============================== OnClose
function OnClose (){
	Logger_Diag(1, "The client closed the HTTP connection");
}

//=============================== FileNameToMimeType
function FileNameToMimeType(strFileName) {
	var fileExtRE = /^.*\.(html|js|svg|css|xml)$/;
	var fileExt = fileExtRE.exec(strFileName);
	if (fileExt) {
		fileExt = fileExt[1];
	} else {
		fileExt = "";
	}

	Logger_Diag(3, "File extension: " + fileExt);

	switch( fileExt ) {
		 case 'css':
			strMimeType = 'text/css';
			break;
		case 'xml':
			strMimeType = 'text/xml';
			break;
	   case 'html':
			strMimeType = 'text/html';
			break;
		case 'js':
			strMimeType = 'text/javascript';
			break;
		case 'svg':
			strMimeType = 'image/svg+xml';
			break;
		default:
			strMimeType = 'text/plain';
	}
}

exports.start = start;
exports.serverHTTPres = serverHTTPres;
exports.OnRequest = OnRequest;
exports.OnConnection = OnConnection;
exports.OnClose = OnClose;
