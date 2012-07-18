// vim:noet:sw=8:

var backendRouter = require('./backend.js');

module.exports = function (options) {
	options.put('/elections/:electionid/save', "elections:save", backendRouter.generateSave(backend.elections, "electionid", "election") );
	options.post('/elections/:electionid/delete', "elections:delete", backendRouter.generateDelete(backend.elections, "electionid") );

	options.put('/elections/:electionid/addBallot', "elections:ballots", function (req, res) {
		backend.elections.addBallot(req.params.electionid, req.body.ballotid, req.body.ballot, function() {
			res.send(200);
		});
	});

	options.post('/elections/:electionid/deleteBallot', "elections:ballots", function (req, res) {
		backend.elections.deleteBallot(req.params.electionid, req.body.ballotid, function () {
			res.send(200);
		});
	});
}
