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
		app.get('/projector', function(req, res) {
			backend.projectors.getDefault(function(defaultprojector) {
				if (defaultprojector) {
					res.redirect('/projectors/' + defaultprojector);
				} else {
					// cause an errorpromt "Projector unconfigured"
					res.redirect('/projectors/undefined');
				}
			});
		});

		app.get('/projectors/:projectorid', routes.projectors.showProjector);

		app.get('/slides/:slideid', routes.agenda.showSlide);

		app.get('/motions/:motionid', routes.motions.showMotion);

		app.get('/elections/:electionid', routes.elections.showElection);

		app.get('/ballots/:ballotid', routes.ballots.showBallot);

		global.projectorSocket	= io.registerProjector();
		global.timerSocket	= io.registerTimers();
		global.agendaSocket	= io.registerAgenda();
		global.motionSocket	= io.registerMotions();
		global.electionSocket	= io.registerElections();
		global.ballotSocket	= io.registerBallots();
	}

	// callback is temporary out of usage. will fix this later
	app.addAdmin = function(callback) {
		function generateCallback(route) {
			return route;
		}

		app.get('/admin', generateCallback(function (req, res) {
			res.render('admin');
		}));

		app.post('/identify-projectors',	generateCallback(routes.projectors.identify) );

		app.put('/agenda/:slideid/save',	generateCallback(routes.agenda.save) );
		app.post('/agenda/:slideid/delete',	generateCallback(routes.agenda.delete) );
		app.post('/agenda/:slideid/move',	generateCallback(routes.agenda.move) );

		app.put('/projectors',			generateCallback(routes.projectors.setDefault) );
		app.put('/projectors/:projectorid/save',	generateCallback(routes.projectors.save) );
		app.post('/projectors/:projectorid/delete',	generateCallback(routes.projectors.delete) );
		app.post('/projectors/:projectorid/showtimer',	generateCallback(routes.projectors.showTimer) );
		app.post('/projectors/:projectorid/hidetimer',	generateCallback(routes.projectors.hideTimer) );
		app.post('/projectors/:projectorid/flash',	generateCallback(routes.projectors.flash) );

		app.put('/timers/:timerid/save',	generateCallback(routes.timers.save) );
		app.post('/timers/:timerid/delete',	generateCallback(routes.timers.delete) );
		app.post('/timers/:timerid/start',	generateCallback(routes.timers.start) );
		app.post('/timers/:timerid/pause',	generateCallback(routes.timers.pause) );
		app.post('/timers/:timerid/stop',	generateCallback(routes.timers.stop) );

		app.put('/motionclasses/:motionclassid/save',		generateCallback(routes.motionclasses.save) );
		app.post('/motionclasses/:motionclassid/delete',	generateCallback(routes.motionclasses.delete) );
		app.post('/motionclasses/:motionclassid/move',		generateCallback(routes.motionclasses.move) );

		app.put('/motions/:motionid/save',	generateCallback(routes.motions.save) );
		app.post('/motions/:motionid/delete',	generateCallback(routes.motions.delete) );
		app.post('/motions/:motionid/move',	generateCallback(routes.motions.move) );

		app.put('/pollsites/:pollsiteid/save',		generateCallback(routes.pollsites.save) );
		app.post('/pollsites/:pollsiteid/delete',	generateCallback(routes.pollsites.delete) );

		app.put('/elections/:electionid/save',		generateCallback(routes.elections.save) );
		app.post('/elections/:electionid/delete',	generateCallback(routes.elections.delete) );

		app.put('/ballots/:ballotid/save',	generateCallback(routes.ballots.save) );
		app.post('/ballots/:ballotid/delete',	generateCallback(routes.ballots.delete) );

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
