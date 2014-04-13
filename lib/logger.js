/**
 * Modules name.
 *
 * @type {String}
 */
exports.name = 'logger';

/**
 * Logger module.
 * Used to log informations and errors across others app's modules.
 *
 * @param  {Object} opts module dependency.
 */
exports.attach = function(opts) {
    var self = this;
    var bunyan = opts.bunyan;

    var logger = bunyan.createLogger({
        name: 'shoutcast',
        streams: [{
            type: 'rotating-file',
            path: __dirname + '/../logs/logfile.log',
            period: '1d',
            count: 7
        }, {
            stream: process.stderr,
            level: 'error'
        }]
    });

    /**
     * Return the logger.
     *
     * @return {Function}
     */
    self.getLogger = function() {
        return logger;
    };
};
