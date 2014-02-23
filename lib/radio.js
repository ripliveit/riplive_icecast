/**
 * Modules name
 * @type {String}
 */
exports.name = 'radio_handler';

/**
 * Module definition.
 * @param  {Object} opts module dependency.
 */
exports.attach = function(opt) {
    var self = this;
    var parser = opt.parser;

    /**
     * Handle the song's parsing from remote shoutcast server.
     * Broadcasts the parsed information with websocket to all connected clients.
     * 
     * @param  {Function} socket the socket function injected by engine.io
     * @return {undefined}      
     */
    this.handle = function(socket) {
        var stream = opt.radio.createReadStream('http://50.7.129.122:8283');

        stream.on("connect", function() {
            console.log("Radio Stream connected!");
            console.log(stream.headers);
        });

        /**
         * When shoutcast's song changes, a 'metadata' event is fired.
         * Parse the received information than broadcasts to all clients.
         * 
         * @param  {[type]} title an object received from shoutcast.
         * @return {undefined}      
         */
        stream.on("metadata", function(title) {
        	parser.parse(title, function(err, info) {
                if (err || info.parsed.artist === 'adv') {
                    console.log(err);
                        
                    info = {
                        status : err,
                        message : 'No song found'
                    }

                    JSON.stringify(info);
                }

                socket.send(JSON.stringify(info));
            });
        });
    };
};