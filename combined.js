// vim:noet:sw=8:

var config = require('./config.js'),
    Webserver = require('./webserver.js');

var app = new Webserver({
	start: '/projector',
	isAllowed: function (perm, req) {
		if (["showProjector", "projectors", "timers", "agenda", "motions", "elections", "ballots"].indexOf(perm) >= 0) {
			return true;
		}
		if (req.session.password == config.password) {
			return true;
		}
		return false;
	},
	forbidden: function (req, res) {
		res.render("login");
	}
});

app.post("/login", function (req, res) {
	req.session.password = req.body.password;
	res.send({ success: req.session.password == config.password });
});

app.listen(config);
