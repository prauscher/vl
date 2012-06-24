/**
 * Module dependencies.
 */

var config = require('./config.js'),
    routes = require('./routes'),
    webserver = require('./webserver.js');

var app = webserver.createServer(config);

// Routes

app.get('/', function (req, res) {
	res.render('admin');
});

app.addAdminRoutes(function (req, res, route) {
	route(req, res);
});

console.dir(config);

app.listen(config.port, config.host, function() {
        if (process.getuid() == 0) {
		process.setgid(config.setgid);
		process.setuid(config.setuid);
	}
	console.log("Express server listening on http://localhost:%d/ in mode %s", app.address().port, app.settings.env);
});
