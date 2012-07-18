// vim:noet:sw=8:

var config = require("./config.js"),
    Webserver = require('./webserver.js');

var app = new Webserver({
	start: '/projector'
});

app.securityManager.addCheck({
	isAllowed: function (perm, req) {
		return ["showProjector", "projectors", "timers", "agenda", "motions", "elections", "ballots"].indexOf(perm) >= 0;
	},
	forbidden: function (req, res) {
		res.send(403);
	}
});

app.listen(config);
