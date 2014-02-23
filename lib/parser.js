/**
 * Modules name
 * @type {String}
 */
exports.name = 'parser';

/**
 * Module initializazion.
 * Set the remote REST server from which song's information are retrieved.
 */
exports.init = function() {
    this.remote = process.NODE_ENV === 'production' 
    ? 'http://37.139.13.232/api/search?post_type=songs&count=1&'
    //? 'http://riplive.it/api/search?post_type=songs&count=1&' 
    : 'http://localhost:3000/api/search?post_type=songs&count=1&';
};

/**
 * Module definition.
 * @param  {Object} opts module dependency.
 */
exports.attach = function(opt) {
    var self = this;
    var request = opt.request;
    var querystring = opt.querystring;
    
    /**
     * Parse metadata from shoutcast server.
     * Than perform a request to remote REST server to retrieve song's info.
     * Return an Object with all retrieved information.
     * 
     * @param  {String}   string Shoutcast metadata.
     * @param  {Function} cb     Callback fired when error or results are available.
     * @return {undefined}
     */
    this.parse = function(string, cb) {
        var string = string.replace(/'/g, '').split(';');
        var parsed = querystring.parse(string[0]);
        var song = parsed.StreamTitle.split('-');
        var uri  = self.remote + querystring.stringify({ search :  song[1]});

        request(uri, function(err, res, body) {
            if (err) {
                return cb(err, null);
            }

            var obj = JSON.parse(body);

            obj.parsed = {
                artist : song[0],
                song   : song[1]
            };

            console.log(obj.parsed);
            
            cb(null, obj);
        });
    };

    /**
     * Return this module.
     * @return {Object}
     */
    this.getParser = function() {
        return self;
    };
};