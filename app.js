var http = require('http');
var Iconv = require('iconv').Iconv;
var engine = require('engine.io');
var radio = require('radio-stream');
var broadway = require('broadway');
var request = require('request');
var querystring = require('querystring');
var bunyan = require('bunyan');

var app = new broadway.App();

/**
 * Load and inject all application modules and dependecies.
 */
app.use(require(__dirname + '/lib/logger.js'), {
    bunyan: bunyan
});

app.use(require(__dirname + '/lib/server.js'), {
    logger: app.getLogger(),
    http: http,
    engine: engine
});

app.use(require(__dirname + '/lib/parser.js'), {
    logger: app.getLogger(),
    request: request,
    querystring: querystring
});

app.use(require(__dirname + '/lib/radio.js'), {
    logger: app.getLogger(),
    Iconv: Iconv,
    radio: radio,
    parser: app.getParser()
});

app.setMaxListeners(0);

app.init(function(err) {
    if (err) {
        console.log(err);
    }
});

app.on('error', function(err) {
    console.log(err);
});

/**
 * Start the real time server.
 */
app.serve(8082, app.handle);
