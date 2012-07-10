var backendRouter = require('./backend.js');

exports.showBallot = function (req, res) {
	res.render('showProjector', { ballotid : req.params.ballotid });
}

exports.save = backendRouter.generateSave(backend.ballots, "ballotid", "ballot");

exports.addOption = function (req, res) {
	backend.ballots.addOption(req.params.ballotid, req.body.optionid, req.body.option, function () {
		res.send(200);
	});
}

exports.moveOption = function (req, res) {
	backend.ballots.moveOption(req.params.ballotid, req.body.optionid, req.body.position, function () {
		res.send(200);
	});
}

exports.deleteOption = function (req, res) {
	backend.ballots.deleteOption(req.params.ballotid, req.body.optionid, function () {
		res.send(200);
	});
}
