// vim:noet:sw=8:

var config = require('./config.js'),
    express = require('express'),
    compressor = require('node-minify'),
    socket = require('./socket.js');

module.exports = function (options) {
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

	function generateRouteCallback(permission, route) {
		return function (req, res) {
			if (options.isAllowed(permission, req)) {
				route(req, res);
			} else {
				options.forbidden(req, res);
			}
		}
	}

	var routes = require('./routes');

	app.get('/', function(req,res) {
		res.redirect(options.start);
	});

	app.get('/projector', generateRouteCallback("showProjector", function(req, res) {
		res.render('showProjector', {});
	}));

	app.get('/admin', generateRouteCallback("admin", function (req, res) {
		res.render('admin');
	}));

	app.post('/identify-projectors',			generateRouteCallback("projectors:identify",	routes.projectors.identify) );

	app.put('/agenda/:slideid/save',			generateRouteCallback("agenda:save",		routes.agenda.save) );
	app.post('/agenda/:slideid/delete',			generateRouteCallback("agenda:delete",		routes.agenda.delete) );
	app.post('/agenda/:slideid/move',			generateRouteCallback("agenda:move",		routes.agenda.move) );

	app.put('/projectors',					generateRouteCallback("projectors:setdefault",	routes.projectors.setDefault) );
	app.put('/projectors/:projectorid/save',		generateRouteCallback("projectors:save",	routes.projectors.save) );
	app.post('/projectors/:projectorid/delete',		generateRouteCallback("projectors:delete",	routes.projectors.delete) );
	app.post('/projectors/:projectorid/showtimer',		generateRouteCallback("projectors:timers",	routes.projectors.showTimer) );
	app.post('/projectors/:projectorid/hidetimer',		generateRouteCallback("projectors:timers",	routes.projectors.hideTimer) );
	app.post('/projectors/:projectorid/flash',		generateRouteCallback("projectors:flash",	routes.projectors.flash) );

	app.put('/timers/:timerid/save',			generateRouteCallback("timers:save",		routes.timers.save) );
	app.post('/timers/:timerid/delete',			generateRouteCallback("timers:delete",		routes.timers.delete) );
	app.post('/timers/:timerid/start',			generateRouteCallback("timers:run",		routes.timers.start) );
	app.post('/timers/:timerid/pause',			generateRouteCallback("timers:run",		routes.timers.pause) );
	app.post('/timers/:timerid/stop',			generateRouteCallback("timers:run",		routes.timers.stop) );

	app.put('/motionclasses/:motionclassid/save',		generateRouteCallback("motionclasses:save",	routes.motionclasses.save) );
	app.post('/motionclasses/:motionclassid/delete',	generateRouteCallback("motionclasses:delete",	routes.motionclasses.delete) );
	app.post('/motionclasses/:motionclassid/move',		generateRouteCallback("motionclasses:move",	routes.motionclasses.move) );

	app.put('/motions/:motionid/save',			generateRouteCallback("motions:save",		routes.motions.save) );
	app.post('/motions/:motionid/delete',			generateRouteCallback("motions:delete",		routes.motions.delete) );
	app.post('/motions/:motionid/move',			generateRouteCallback("motions:move",		routes.motions.move) );
	app.put('/motions/:motionid/addBallot',			generateRouteCallback("motions:ballots",	routes.motions.addBallot) );
	app.post('/motions/:motionid/deleteBallot',		generateRouteCallback("motions:ballots",	routes.motions.deleteBallot) );

	app.put('/elections/:electionid/save',			generateRouteCallback("elections:save",		routes.elections.save) );
	app.post('/elections/:electionid/delete',		generateRouteCallback("elections:delete",	routes.elections.delete) );
	app.put('/elections/:electionid/addBallot',		generateRouteCallback("elections:ballots",	routes.elections.addBallot) );
	app.post('/elections/:electionid/deleteBallot',		generateRouteCallback("elections:ballots",	routes.elections.deleteBallot) );

	app.put('/ballots/:ballotid/save',			generateRouteCallback("ballots:save",		routes.ballots.save) );
	app.put('/ballots/:ballotid/addOption',			generateRouteCallback("ballots:options",	routes.ballots.addOption) );
	app.post('/ballots/:ballotid/moveOption',		generateRouteCallback("ballots:options",	routes.ballots.moveOption) );
	app.post('/ballots/:ballotid/deleteOption',		generateRouteCallback("ballots:options",	routes.ballots.deleteOption) );

	app.put('/options/:optionid/save',			generateRouteCallback("ballots:options",	routes.options.save) );

	app.put('/pollsites/:pollsiteid/save',			generateRouteCallback("pollsite:save",		routes.pollsites.save) );
	app.post('/pollsites/:pollsiteid/delete',		generateRouteCallback("pollsite:delete",	routes.pollsites.delete) );

	function addSocket(path, permission, addCallbacks) {
		var authorized = false;

		app.post('/authSocket' + path,	generateRouteCallback(permission, function (req, res) {
			authorized = true;
			res.send(200);
		}) );

		return io.of(path)
			.authorization(function (handshake, callback) {
				callback(null, authorized);
			})
			.on("connection", addCallbacks);
	}

	global.projectorSocket	= addSocket("/projectors",	"projectors",	socket.projectors);
	global.timerSocket	= addSocket("/timers",		"timers",	socket.timers);
	global.agendaSocket	= addSocket("/agenda",		"agenda",	socket.agenda);
	global.motionSocket	= addSocket("/motions",		"motions",	socket.motions);
	global.electionSocket	= addSocket("/elections",	"elections",	socket.elections);
	global.ballotSocket	= addSocket("/ballots",		"ballots",	socket.ballots);
	global.pollsiteSocket	= addSocket("/pollsites",	"pollsites",	socket.pollsites);

	// Showtime!

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
			"public/libs/viewerOptions.js",
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
			"public/libs/viewerOptions.js",
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
