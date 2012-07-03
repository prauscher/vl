/**
 * Module dependencies.
 */

var config = require('./config.js'),
    routes = require('./routes'),
    webserver = require('./webserver.js');

var app = webserver.createServer(config);

// Routes

app.get('/', function (req, res) {
	res.redirect('/admin/');
});

app.addAdminRoutes(function (req, res, route) {
	route(req, res);
});

app.listen(config.port, config.host, function() {
	if (process.getuid() == 0) {
		process.setgid(config.setgid);
		process.setuid(config.setuid);
	}
});

console.log("Express server listening on http://localhost:%d/ in mode %s", config.port, app.settings.env);
