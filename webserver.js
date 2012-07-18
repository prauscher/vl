// vim:noet:sw=8:

var express = require('express'),
    compressor = require('node-minify'),
    socket = require('./socket.js');

module.exports = function (options) {
	var self = this;
	this.app = express.createServer();

	global.backend = require('./backend');
	global.io = socket.listen(this.app);

	// Configuration

	this.app.configure(function() {
		this.set('views', __dirname + '/views');
		this.set('view engine', 'jade');
		this.set('view options', { layout : false });
		this.use(express.bodyParser());
		this.use(express.methodOverride());
		this.use(express.cookieParser());
		this.use(express.session({ secret: "UsMohsaEkB14iwuterECSv29HEbJ407h" }));
		this.use(this.router);
		this.use(express.static(__dirname + '/public', { maxAge: 24*60*60*1000 }));
	});

	this.app.configure('development', function(){
		this.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	});

	this.app.configure('production', function(){
		this.use(express.errorHandler());
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

	this.get('/', function(req,res) {
		res.redirect(options.start);
	});

	require('./routes')({
		get : function (path, permission, route) {
			self.get(path, generateRouteCallback(permission, route));
		},
		post : function (path, permission, route) {
			self.post(path, generateRouteCallback(permission, route));
		},
		put : function (path, permission, route) {
			self.put(path, generateRouteCallback(permission, route));
		}
	});

	function addSocket(path, permission, addCallbacks) {
		var authorized = false;

		self.post('/authSocket' + path,	generateRouteCallback(permission, function (req, res) {
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
}

module.exports.prototype.get = function () {
	this.app.get.apply(this.app, arguments);
}

module.exports.prototype.post = function () {
	this.app.post.apply(this.app, arguments);
}

module.exports.prototype.put = function () {
	this.app.put.apply(this.app, arguments);
}

module.exports.prototype.listen = function (config) {
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

	this.app.listen(config.port, config.host, function() {
		if (process.getuid() == 0) {
			process.setgid(config.setgid);
			process.setuid(config.setuid);
		}
	});
	console.log("Express server listening on http://%s:%d/ in mode %s", config.host || "localhost", config.port, this.app.settings.env);
}
