/**
 * Modules name
 * @type {String}
 */
exports.name = 'server';

/**
 * Module definition.
 * @param  {Object} opts module dependency.
 */
exports.attach = function(opts) {
    var self = this;
    
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
    	}

    	var server = opts.engine.listen(port);
    	server.on('connection', handler);
    };
};