/**
 * Module dependencies.
 */

var config = require('./config.js'),
    routes = require('./routes'),
    webserver = require('./webserver.js');

var app = webserver.createServer(config);

// Routes

app.get('/', function (req, res) {
	res.render('clientOverview');
});

app.get('/login', function (req, res) {
	res.render('login');
});

app.post('/login', function (req, res) {
	if (req.body.password == config.password) {
		req.session.password = req.body.password;
		res.send({ success: true });
	} else {
		res.send({ success: false });
	}
});

function checkPermissions(req, res, route) {
	if (req.session.password == config.password) {
		route(req, res);
	} else {
		res.redirect('/login');
	}
}
app.addAdminRoutes(checkPermissions);

console.dir(config);

app.listen(config.port, config.host, function() {
	if (process.getuid() == 0) {
		process.setgid(config.setgid);
		process.setuid(config.setuid);
	}
});

console.log("Express server listening on http://localhost:%d/ in mode %s", config.port, app.settings.env);
