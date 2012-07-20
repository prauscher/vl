// vim:noet:sw=8:

var backendRouter = require('../backendRouter.js');

module.exports = function (options) {
	var self = this;
	this.socket = options.addSocket("/elections", "elections", require("./socket.js").apply(this));
	this.backend = require("./backend.js").apply(this);

	options.put('/elections/:electionid/save', "elections:save", backendRouter.generateSave(this.backend, "electionid", "election") );
	options.post('/elections/:electionid/delete', "elections:delete", backendRouter.generateDelete(this.backend, "electionid") );

	options.put('/elections/:electionid/addBallot', "elections:ballots", function (req, res) {
		self.backend.addBallot(req.params.electionid, req.body.ballotid, req.body.ballot, function() {
			res.send(200);
		});
	});

	options.post('/elections/:electionid/deleteBallot', "elections:ballots", function (req, res) {
		self.backend.deleteBallot(req.params.electionid, req.body.ballotid, function () {
			res.send(200);
		});
	});
}
