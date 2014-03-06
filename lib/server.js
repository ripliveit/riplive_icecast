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
    var self = this;
    var logger = opts.logger;
    
    /**
     * Start an engine.io server.
     * 
     * @param  {Int} port Listening port.   
     * @param  {FUnction} handler Function used to handle all clients connections.
     * @return {undefined}         
     */
/*    this.serve = function(port, handler) {
    	if (!port || typeof port === 'undefined') {
    		self.emit('error', 'Server port number is required');
            logger.error('Server port number is required');
    	}

    	var server = opts.engine.listen(port);
    	server.on('connection', handler);
    };*/

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

        var httpServer = opts.http.createServer().listen(port);

        httpServer.on('upgrade', function(req, socket, head) {
            server.handleUpgrade(req, socket, head);
        });

        httpServer.on('request', function(req, res) {
            server.handleRequest(req, res);
        });

        var server = new opts.engine.Server({
            pingTimeout: 10000,
            pingInterval: 2000
        });

        server.on('connection', handler);
    };
};