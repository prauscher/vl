/**
 * WARNING: This piece of code is temporary offline.
 **/

var webserver = require('./webserver.js');

var app = webserver.createServer();
app.setStart('/beamer');

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

app.addViewer();
app.addAdmin(function (req, res, route) {
	if (req.session.password == config.password) {
		route(req, res);
	} else {
		res.redirect('/login');
	}
});
app.start();
