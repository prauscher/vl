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
		this.use(express.session({ secret: 'dsfwe113r2r32f43', key: 'express.sid' }));
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

	this.securityManager = {
		checks : [],

		performChecks : function (sessionID, permission, callback) {
			var self = this;
			function performChecks(i) {
				if (self.checks[i]) {
					self.checks[i].isAllowed(sessionID, permission, function (isAllowed) {
						if (isAllowed) {
							performChecks(i+1);
						} else {
							callback(false, self.checks[i]);
						}
					});
				} else {
					callback(true);
				}
			}
			performChecks(0);
		},

		generateCheck : function (permission, route) {
			var self = this;
			return function (req, res) {
				self.performChecks(req.sessionID, permission, function (isAllowed, breaker) {
					if (isAllowed) {
						route(req, res);
					} else {
						breaker.forbidden(req, res);
					}
				});
			}
		},

		addCheck : function (options) {
			this.checks.push(options);
		}
	};

	this.get('/', function(req,res) {
		res.redirect(options.start);
	});

	require('./modules')({
		get : function (path, permission, route) {
			self.get(path, self.securityManager.generateCheck(permission, route));
		},
		post : function (path, permission, route) {
			self.post(path, self.securityManager.generateCheck(permission, route));
		},
		put : function (path, permission, route) {
			self.put(path, self.securityManager.generateCheck(permission, route));
		},
		addSecurityCheck : function (options) {
			self.securityManager.addCheck(options);
		},
		addSocket : function (path, permission, addCallbacks) {
			return io.of(path)
				.authorization(function (handshake, callback) {
					// VooDoo by http://www.danielbaulig.de/socket-ioexpress/
					var sessionID = require('cookie').parse(handshake.headers.cookie)['express.sid'];
					self.securityManager.performChecks(sessionID, permission, function (authorized) {
						callback(null, authorized);
					});
				})
				.on("connection", addCallbacks);
		}
	});
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
			"public/javascript/showProjector/index.js",
			"public/javascript/showProjector/navigation.js",
			"public/javascript/showProjector/viewerdata.js",
			"public/javascript/showProjector/currenttime.js",
			"public/javascript/showProjector/defaultprojector.js",
			"public/javascript/showProjector/projectors.js",
			"public/javascript/showProjector/agenda.js",
			"public/javascript/showProjector/motions.js",
			"public/javascript/showProjector/elections.js",
			"public/javascript/showProjector/ballots.js"
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
