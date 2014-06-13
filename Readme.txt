
Lips that move on a browser, controlled via websockets using node.js, synced
with espeak phonemes, mapped to visemes.  A mouth full.

*****   Why?

Over at MaddogGarage, we do some funky stuff.  The goal of this project is to
creat some giant mechanical lips, and then do some TTS (text-to-speech)
shenanigans to have them "say" something.  Arduino/RaspberryPi/HTML5 and all
sorts backend (Perl/Bash/node.js...) goodness on the electro side, for which I
am responsible.  Mechanical side promises to be fun, too.

This is a test bed so that the insane phoneme-to-viseme mapping could get done
and the HTML5 text input has something to talk to.  It is not an end project
to itself.

*****   Installation requirements:

Node.js 

Node.js modules (installed via npm):
    * optimist (https://github.com/substack/node-optimist)
    * websocket (https://github.com/Worlize/WebSocket-Node)
After installing node, one should be able to install the above modules by
    npm install optimist websocket

speak/espeak:
    * I've managed to make all this work on Ubuntu and MacOS

An HTML5 client which can do websockets. 

*****   Execution (default)

1) Launch RunNode.js -- or use the util/daemon script
2) Point web-browser to http://127.0.0.1:8081
3) Run the talk script to input text to espeak and the browser lips


*****   Files etc

Much of the node.js stuff is code reused from a bi-directional meter project,
and the lip movement is controlled by the "left" meter.

RunNode.js -- a Node.js script which provides
    * Basic web server (default port 8081)
    * WebSocket server for lip (via above web-server)
    * TCP socket ingestor (port 7331 "left" & 7332 "right" )

    - The Websocket esentially forwards data from the TCP sockets to the
      meters.  This is handled when the client initiates the connection and
      requests (via json) a data type (meter: left or right), followed by the
      websocket streaming (via json) data from the corresponding TCP socket.

    * jsnode/ contains sub service modules

index.html -- Webpage
    * css/
    * jsext/ for javascript

util/ -- Some scripts for testing, launching, data feeds

*****   Contribs

fvlogger, for JS debugging/logging, from
    http://www.alistapart.com/articles/jslogging/

*****   To Do

-- Refactor to use SocketIO.



----------------
Author: David A. Gent
Date: June 2014

