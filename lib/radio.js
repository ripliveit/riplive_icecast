/**
 * Modules name
 * @type {String}
 */
exports.name = 'radio_handler';

/**
 * Module definition.
 * @param  {Object} opts module dependency.
 */
exports.attach = function(opts) {
    var self = this;
    var stream = opts.radio.createReadStream('http://50.7.129.122:8283');
    var parser = opts.parser;
    var logger = opts.logger;
    var connections = 0;

    stream.on('connect', function() {
        logger.info('Radio Stream connected.');
    });

    /**
     * Increment the number of connection on the server.
     *
     * @return {undefined}
     */
    this.clientConnect = function() {
        connections += 1;
        logger.info('Client connected. Total clients: ' + connections);
    };

    /**
     * Decremnt the number of connection on the server.
     *
     * @return {undefined}
     */
    this.clientDisconnect = function() {
        connections -= 1;
        logger.info('Client disconnected. Total clients: ' + connections);
    };

    /**
     * Return an error object, used when no actual shoutcast's song
     * can be retrieved from remote REST server.
     * 
     * @return {[type]} [description]
     */
    this.notFound = function() {
        return info = {
            status: 'error',
            message: 'No song found'
        };
    };

    /**
     * Handle the song's parsing from remote shoutcast server.
     * Broadcasts the parsed information with websocket to all connected clients.
     *
     * @param  {Function} socket the socket function injected by engine.io
     * @return {undefined}
     */
    this.handle = function(socket) {
        self.clientConnect();

        /**
         * Handle stream error and close events.
         */
        stream.on('error', function(err) {
            logger.error('Error in Radio Stream connection.');
            logger.error(err);
        });

        stream.on('close', function() {
            logger.info('Radio Stream connection closed.');
        });

        /**
         * When shoutcast's song changes, a 'metadata' event is fired.
         * Parse the received information than broadcasts to all clients.
         *
         * @param  {[type]} title an object received from shoutcast.
         * @return {undefined}
         */
        stream.on('metadata', function(title) {
            parser.parse(title, function(err, info) {
                if (err || info.parsed.artist === 'adv') {
                    logger.error(err);

                    return false
                }

                if (info.count === 0) {
                    info = JSON.stringify(self.notFound());
                }

                socket.send(JSON.stringify(info));
            });
        });

        /**
         * Decrement total connections when a socket close.
         */
        socket.on('close', function() {
            self.clientDisconnect();
        });
    };
};