// vim:noet:sw=8:

var ProjectorsModule	= require('./projectors'),
    AgendaModule	= require('./agenda'),
    TimersModule	= require('./timers'),
    MotionsModule	= require('./motions'),
    PollsitesModule	= require('./pollsites'),
    ElectionsModule	= require('./elections'),
    BallotsModule	= require('./ballots');

module.exports = function (webserver) {
	var options = {
		get : function (path, permission, route) {
			webserver.get(path, webserver.securityManager.generateCheck(permission, route));
		},
		post : function (path, permission, route) {
			webserver.post(path, webserver.securityManager.generateCheck(permission, route));
		},
		put : function (path, permission, route) {
			webserver.put(path, webserver.securityManager.generateCheck(permission, route));
		},
		addSecurityCheck : function (options) {
			webserver.securityManager.addCheck(options);
		},
		addSocket : function (path, permission, addCallbacks) {
			return webserver.io.of(path)
				.authorization(function (handshake, callback) {
					// VooDoo by http://www.danielbaulig.de/socket-ioexpress/
					var sessionID = require('cookie').parse(handshake.headers.cookie)['express.sid'];
					webserver.securityManager.performChecks(sessionID, permission, function (authorized) {
						callback(null, authorized);
					});
				})
				.on("connection", addCallbacks);
		}
	};

	options.get('/projector', "showProjector", function (req, res) {
		res.render('showProjector', {});
	});

	options.get('/admin', "admin", function (req, res) {
		res.render('admin', {});
	});

	this.projectors	= new ProjectorsModule	(options);
	this.agenda	= new AgendaModule	(options);
	this.timers	= new TimersModule	(options);
	this.motions	= new MotionsModule	(options);
	this.pollsites	= new PollsitesModule	(options);
	this.elections	= new ElectionsModule	(options);
	this.ballots	= new BallotsModule	(options);
}
