/**
 * Module dependencies.
 */

var express = require('express'),
    backend = require('./backend');
    socket = require('./socket.js');
    routes = require('./routes');

var app = module.exports = express.createServer();

global.backend = backend;
global.io = socket.listen(app);

// Configuration

app.configure(function() {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.set('view options', { layout : false });
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
	app.use(express.errorHandler());
});

// Routes

app.get('/beamer', routes.beamer.showDefaultBeamer);
app.get('/beamer/:beamerid', routes.beamer.showBeamer);

