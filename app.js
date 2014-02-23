var engine = require('engine.io');
var radio  = require('radio-stream');
var broadway = require('broadway');
var request  = require('request');
var querystring = require('querystring');

var app = new broadway.App();

/**
 * Load and inject all application modules and dependecies.
 */
app.use(require(__dirname + '/lib/server.js'), { 
	engine : engine
});

app.use(require(__dirname + '/lib/parser.js'), {
	request : request,
	querystring : querystring
});

app.use(require(__dirname + '/lib/radio.js'), { 
	radio : radio,
	parser : app.getParser()
});


app.init(function (err) {
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