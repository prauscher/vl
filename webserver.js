/**
 * Module dependencies.
 */

var express = require('express'),
    socket = require('./socket.js');
    routes = require('./routes');

exports.createServer = function (config) {
	var app = express.createServer();

	global.backend = require('./backend/' + config.backend);
	global.io = socket.listen(app);

	// Configuration

	app.configure(function() {
		app.set('views', __dirname + '/views');
		app.set('view engine', 'jade');
		app.set('view options', { layout : false });
		app.use(express.bodyParser());
		app.use(express.methodOverride());
		app.use(express.cookieParser());
		app.use(express.session({ secret: "UsMohsaEkB14iwuterECSv29HEbJ407h" }));
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

	app.get('/slides/:slideid', routes.agenda.showSlide);

	app.addAdminRoutes = function(callback) {
		function generateCallback(route) {
			return function (req, res) {
				callback(req, res, route);
			}
		}

		app.post('/beamer-identify',		generateCallback(routes.beamer.identify) );

		app.put('/agenda/:slideid/save',	generateCallback(routes.agenda.save) );
		app.post('/agenda/:slideid/delete',	generateCallback(routes.agenda.delete) );
		app.post('/agenda/:slideid/move',	generateCallback(routes.agenda.move) );

		app.put('/beamer/:beamerid/save',	generateCallback(routes.beamer.save) );
		app.post('/beamer/:beamerid/delete',	generateCallback(routes.beamer.delete) );
		app.post('/beamer/:beamerid/showtimer',	generateCallback(routes.beamer.showTimer) );
		app.post('/beamer/:beamerid/hidetimer',	generateCallback(routes.beamer.hideTimer) );
		app.post('/beamer/:beamerid/flash',	generateCallback(routes.beamer.flash) );

		app.put('/timers/:timerid/save',	generateCallback(routes.timers.save) );
		app.post('/timers/:timerid/delete',	generateCallback(routes.timers.delete) );
		app.post('/timers/:timerid/start',	generateCallback(routes.timers.start) );
		app.post('/timers/:timerid/pause',	generateCallback(routes.timers.pause) );
		app.post('/timers/:timerid/stop',	generateCallback(routes.timers.stop) );
	}

	return app;
}
