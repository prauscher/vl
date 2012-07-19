// vim:noet:sw=8:

var config = require('./config.js'),
    Webserver = require('./webserver.js');

var app = new Webserver({
	start: '/projector'
});

var clients = {};
app.securityManager.addCheck({
	isAllowed: function (sessionID, perm, callback) {
		if (["showProjector", "projectors", "timers", "agenda", "motions", "elections", "ballots"].indexOf(perm) >= 0) {
			callback(true);
		// Vote-Interfaces have their own authentification
		} else if (perm.substring(0,5) == "vote:") {
			callback(true);
		} else if (clients[sessionID] && clients[sessionID].loggedIn) {
			callback(true);
		} else {
			callback(false);
		}
	},
	forbidden: function (req, res) {
		res.render("login");
	}
});
app.post("/login", function (req, res) {
	clients[req.sessionID] = {};
	if (req.body.password == config.password) {
		clients[req.sessionID].loggedIn = true;
	}
	res.send({ success: clients[req.sessionID].loggedIn });
});

app.listen(config);
