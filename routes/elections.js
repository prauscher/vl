var backendRouter = require('./backend.js');

exports.save = backendRouter.generateSave(backend.elections, "electionid", "election");
exports.delete = backendRouter.generateDelete(backend.elections, "electionid");

exports.addBallot = function (req, res) {
	backend.elections.addBallot(req.params.electionid, req.body.ballotid, req.body.ballot, function() {
		res.send(200);
	});
}

exports.deleteBallot = function (req, res) {
	backend.elections.deleteBallot(req.params.electionid, req.body.ballotid, function () {
		res.send(200);
	});
}
