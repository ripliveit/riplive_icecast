/**
 * Modules name.
 *
 * @type {String}
 */
exports.name = 'parser';

/**
 * Module initializazion.
 * Set the remote REST server from which song's information are retrieved.
 */
exports.init = function() {
    this.remote = process.env.NODE_ENV === 'production' 
    ? 'http://37.139.13.232/api/search?post_type=songs&count=1&'
    //? 'http://riplive.it/api/search?post_type=songs&count=1&' 
    : 'http://localhost:3000/api/search?post_type=songs&count=1&';
};

/**
 * Module definition.
 * @param  {Object} opts module dependency.
 */
exports.attach = function(opts) {
    var self = this;
    var request = opts.request;
    var querystring = opts.querystring;
    var logger = opts.logger;

    /**
     * Parse metadata from shoutcast server.
     * Parsed metadata has this form: 'StreamTitle=Artist - Song','StreamUrl=http://www.riplive.it'.
     *
     * When song's title is computed than perform a request to the remote REST server, to retrieve song's info.
     * Return an Object with all retrieved information.
     *
     * @param  {String}   string Shoutcast metadata.
     * @param  {Function} cb     Callback fired when error or results are available.
     * @return {undefined}
     */
    this.parse = function(string, cb) {
        var string = string.replace(/'/g, '').split(';');
        var parsed = querystring.parse(string[0]);
        var song = parsed.StreamTitle.split('-').map(function(item) {
            return item.trim();
        });

        console.log(song);

        if (song[0] === 'adv') {
            return cb(null, {
                type  : 'adv',
                title : song[1],
                artist : 'Riplive.it',
                count : 1  
            });
        }

        if (song[0] === 'programs') {
            return cb(null, {
                type : 'programs',
                title  : song[1],
                artist : 'Riplive.it',
                count  : 1  
            });
        }
        
        // If there's no song's title return error,
        // otherwise replace all featuring from the title.
        if (!song[1]) {
            return cb(new Error('Not found. Parsed: ' + song), null);
        } 

        song[1] = song[1].replace(/[\(]?(ft|feat)(.)*$/ig, '');

        var uri = self.remote + querystring.stringify({
            search: song[1]
        });

        request(uri, function(err, res, body) {
            if (err) {
                return cb(err, null);
            }

            var obj = JSON.parse(body);

            obj.type = 'song';
            obj.artist = song[0];
            obj.title  = song[1];

            var parsed = {
                artist: song[0],
                song: song[1]
            };

            logger.info(parsed);

            return cb(null, obj);
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
