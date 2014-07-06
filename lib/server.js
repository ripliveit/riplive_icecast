/**
 * Modules name.
 *
 * @type {String}
 */
exports.name = 'server';

/**
 * Module definition.
 *
 * @param  {Object} opts module dependency.
 */
exports.attach = function(opts) {
    var self   = this;
    var logger = opts.logger;
    var http   = opts.http;

    /**
     * Start an engine.io server.
     *
     * @param  {Int} port Listening port.
     * @param  {FUnction} handler Function used to handle all clients connections.
     * @return {undefined}
     */
    this.serve = function(port, handler) {
        if (!port || typeof port === 'undefined') {
            self.emit('error', 'Server port number is required');
            logger.error('Server port number is required');
        }

        var server = http.createServer();
        var io     = opts.socketIo(server);
        server.listen(port);

        io.on('connection', handler);
    };
};
