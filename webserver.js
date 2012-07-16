/**
 * Module dependencies.
 */

var config = require('./config.js'),
    express = require('express'),
    compressor = require('node-minify'),
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
		app.use(express.static(__dirname + '/public', { maxAge: 24*60*60*1000 }));
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
			res.render('showProjector', {});
		});

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

		app.put('/motions/:motionid/save',		generateCallback(routes.motions.save) );
		app.post('/motions/:motionid/delete',		generateCallback(routes.motions.delete) );
		app.post('/motions/:motionid/move',		generateCallback(routes.motions.move) );
		app.put('/motions/:motionid/addBallot',		generateCallback(routes.motions.addBallot) );
		app.post('/motions/:motionid/deleteBallot',	generateCallback(routes.motions.deleteBallot) );

		app.put('/elections/:electionid/save',		generateCallback(routes.elections.save) );
		app.post('/elections/:electionid/delete',	generateCallback(routes.elections.delete) );
		app.put('/elections/:electionid/addBallot',	generateCallback(routes.elections.addBallot) );
		app.post('/elections/:electionid/deleteBallot',	generateCallback(routes.elections.deleteBallot) );

		app.put('/ballots/:ballotid/save',	generateCallback(routes.ballots.save) );
		app.put('/ballots/:ballotid/addOption',		generateCallback(routes.ballots.addOption) );
		app.post('/ballots/:ballotid/moveOption',	generateCallback(routes.ballots.moveOption) );
		app.post('/ballots/:ballotid/deleteOption',	generateCallback(routes.ballots.deleteOption) );

		app.put('/options/:optionid/save',	generateCallback(routes.options.save) );

		app.put('/pollsites/:pollsiteid/save',		generateCallback(routes.pollsites.save) );
		app.post('/pollsites/:pollsiteid/delete',	generateCallback(routes.pollsites.delete) );

		global.pollsiteSocket =	io.registerPollsites();
	}

	// Showtime!

	app.start = function() {
		new compressor.minify({
			type: 'no-compress',
			fileIn: [
				"public/libs/jquery-miniColors/jquery.miniColors.css",
				"public/libs/bootstrap/css/bootstrap.min.css",
				"public/libs/bootstrap/css/bootstrap-responsive.min.css",
				"public/stylesheets/admin.css"
			],
			fileOut: "public/min/admin.css"
		});

		new compressor.minify({
			type: 'no-compress',
			fileIn: [
				"public/libs/jquery-1.7.2.min.js",
				"public/libs/jquery-ui-1.8.21.custom.min.js",
				"public/libs/jquery.mjs.nestedSortable.js",
				"public/libs/jquery-miniColors/jquery.miniColors.min.js",
				"public/libs/jquery.cookie.js",
				"public/libs/treeTable.js",
				"public/libs/sortedList.js",
				"public/javascript/admin/selectProjector.js",
				"public/libs/bootstrap/js/bootstrap.min.js",
				"public/apiClient/timerClient.js",
				"public/apiClient/index.js",
				"public/apiClient/projectors.js",
				"public/apiClient/agenda.js",
				"public/apiClient/timers.js",
				"public/apiClient/motionclasses.js",
				"public/apiClient/motions.js",
				"public/apiClient/pollsites.js",
				"public/apiClient/elections.js",
				"public/apiClient/ballots.js",
				"public/apiClient/options.js",
				"public/javascript/admin/index.js",
				"public/javascript/admin/navigation.js",
				"public/javascript/admin/projectors.js",
				"public/javascript/admin/flashmessages.js",
				"public/javascript/admin/agenda.js",
				"public/javascript/admin/timers.js",
				"public/javascript/admin/motions.js",
				"public/javascript/admin/pollsites.js",
				"public/javascript/admin/elections.js",
				"public/javascript/admin/ballots.js"
			],
			fileOut: "public/min/admin.js"
		});

		new compressor.minify({
			type: 'no-compress',
			fileIn: [
				"public/stylesheets/showProjector.css"
			],
			fileOut: "public/min/showProjector.css"
		});

		new compressor.minify({
			type: 'no-compress',
			fileIn: [
				"public/libs/jquery-1.7.2.min.js",
				"public/libs/jquery-ui-1.8.21.custom.min.js",
				"public/libs/jquery.properMenu.js",
				"public/libs/sortedList.js",
				"public/apiClient/index.js",
				"public/apiClient/projectors.js",
				"public/apiClient/agenda.js",
				"public/apiClient/timers.js",
				"public/apiClient/motionclasses.js",
				"public/apiClient/motions.js",
				"public/apiClient/elections.js",
				"public/apiClient/ballots.js",
				"public/apiClient/options.js",
				"public/apiClient/timerClient.js",
				"public/javascript/viewer/index.js",
				"public/javascript/viewer/navigation.js",
				"public/javascript/viewer/viewerdata.js",
				"public/javascript/viewer/currenttime.js",
				"public/javascript/viewer/defaultprojector.js",
				"public/javascript/viewer/projectors.js",
				"public/javascript/viewer/agenda.js",
				"public/javascript/viewer/motions.js",
				"public/javascript/viewer/elections.js",
				"public/javascript/viewer/ballots.js"
			],
			fileOut: "public/min/showProjector.js"
		});

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
