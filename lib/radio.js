/**
 * Modules name.
 * 
 * @type {String}
 */
exports.name = 'radio_handler';

/**
 * Module definition.
 * 
 * @param  {Object} opts module dependency.
 */
exports.attach = function(opts) {
    var self = this;
    var parser = opts.parser;
    var logger = opts.logger;
    var connections = 0;
    //var stream = opts.radio.createReadStream('http://50.7.129.122:8283');
    var stream = opts.radio.createReadStream('http://192.240.97.68:8002/stream');
    var song;

    /**
     * Handle all stream's connection events.
     */
    stream.on('connect', function() {
        logger.info('Radio Stream connected.');
    });

    stream.on('error', function(err) {
        logger.error('Error in Radio Stream connection.');
        logger.error(err);
    });

    stream.on('close', function() {
        logger.info('Radio Stream connection closed.');
    });

    /**
     * When shoutcast's song changes, a 'metadata' event is fired.
     * Parse the received information than emit an event listened inside the websocket'server handler.
     *
     * @param  {Function} cb the metadata handler.
     * @return {undefined}
     */
    stream.on('metadata', function(title) {
        parser.parse(title, function(err, info) {
            if (err) {
                logger.info(err);
                console.log(err);

                self.emit('song', JSON.stringify(self.remoteError()));

                return false;
            }

            if (info.count === 0) {
                info = JSON.stringify(self.notFound());
            }

            song = JSON.stringify(info);
            self.emit('song', song);
        });
    });

    /**
     * Increment the number of connection on the server.
     *
     * @return {undefined}
     */
    this.clientConnect = function(socket) {
        connections += 1;
        socket.send(song);
        logger.info('Client connected. Total clients: ' + connections);
    };

    /**
     * Decrement the number of connection on the server.
     *
     * @return {undefined}
     */
    this.clientDisconnect = function() {
        connections -= 1;
        logger.info('Client disconnected. Total clients: ' + connections);
    };

    /**
     * Return a more readable error in case of connection errors.
     * 
     * @return {Object}
     */
    this.remoteError = function() {
        return info = {
            status: 'error',
            message: 'Error in remote REST server response'
        };
    };

    /**
     * Return an error object, used when no actual shoutcast's song
     * can be retrieved from remote REST server.
     *
     * @return {Object}
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
        self.clientConnect(socket);

        var cb = function(song) {
            socket.send(song);
        };
        
        self.on('song', cb);

        /**
         * Decrement total connections when a socket close and
         * remove an event handler from the app. (self).
         */
        socket.on('close', function() {
            self.removeListener('song', cb);
            self.clientDisconnect();
        });
    };
};