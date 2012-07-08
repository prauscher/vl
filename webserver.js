/**
 * Module dependencies.
 */

var config = require('./config.js'),
    express = require('express'),
    socket = require('./socket.js');

exports.createServer = function () {
	var app = express.createServer();

	global.backend = require('./backend');
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

	var routes = require('./routes');

	app.setStart = function(path) {
		app.get('/', function(req,res) {
			res.redirect(path);
		});
	}

	app.addViewer = function () {
		app.get('/beamer', function(req, res) {
			backend.beamer.getDefault(function(defaultbeamer) {
				if (defaultbeamer) {
					res.redirect('/beamer/' + defaultbeamer);
				} else {
					res.redirect('/beamer/undefined');
				}
			});
		});

		app.get('/beamer/:beamerid', routes.beamer.showBeamer);

		app.get('/slides/:slideid', routes.agenda.showSlide);

		app.get('/applications/:applicationid', routes.applications.showApplication);

		global.beamerSocket =		io.registerBeamer();
		global.timerSocket =		io.registerTimers();
		global.agendaSocket =		io.registerAgenda();
		global.applicationSocket =	io.registerApplications();
	}

	// callback is temporary out of usage. will fix this later
	app.addAdmin = function(callback) {
		function generateCallback(route) {
			return route;
		}

		app.get('/admin', generateCallback(function (req, res) {
			res.render('admin');
		}));

		app.post('/beamer-identify',		generateCallback(routes.beamer.identify) );

		app.put('/agenda/:slideid/save',	generateCallback(routes.agenda.save) );
		app.post('/agenda/:slideid/delete',	generateCallback(routes.agenda.delete) );
		app.post('/agenda/:slideid/move',	generateCallback(routes.agenda.move) );

		app.put('/beamer',			generateCallback(routes.beamer.setDefault) );
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

		app.put('/appcategorys/:appcategoryid/save',	generateCallback(routes.appcategorys.save) );
		app.post('/appcategorys/:appcategoryid/delete',	generateCallback(routes.appcategorys.delete) );
		app.post('/appcategorys/:appcategoryid/move',	generateCallback(routes.appcategorys.move) );

		app.put('/applications/:applicationid/save',	generateCallback(routes.applications.save) );
		app.post('/applications/:applicationid/delete',	generateCallback(routes.applications.delete) );
		app.post('/applications/:applicationid/move',	generateCallback(routes.applications.move) );

		app.put('/pollsites/:pollsiteid/save',		generateCallback(routes.pollsites.save) );
		app.post('/pollsites/:pollsiteid/delete',	generateCallback(routes.pollsites.delete) );

		global.pollsiteSocket =	io.registerPollsites();
	}

	// Showtime!

	app.start = function() {
		app.listen(config.port, config.host, function() {
			if (process.getuid() == 0) {
				process.setgid(config.setgid);
				process.setuid(config.setuid);
			}
		});
		console.log("Express server listening on http://%s:%d/ in mode %s", config.host || "localhost", config.port, app.settings.env);
	}

	return app;
}
