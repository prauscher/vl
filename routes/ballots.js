// vim:noet:sw=8:

var backendRouter = require('./backend.js');

module.exports = function (options) {
	options.put('/ballots/:ballotid/save', "ballots:save", backendRouter.generateSave(backend.ballots, "ballotid", "ballot") );

	options.put('/ballots/:ballotid/addOption', "ballots:options", function (req, res) {
		backend.ballots.addOption(req.params.ballotid, req.body.optionid, req.body.option, function () {
			res.send(200);
		});
	});

	options.post('/ballots/:ballotid/moveOption', "ballots:options", function (req, res) {
		backend.ballots.moveOption(req.params.ballotid, req.body.optionid, req.body.position, function () {
			res.send(200);
		});
	});

	options.post('/ballots/:ballotid/deleteOption', "ballots:options", function (req, res) {
		backend.ballots.deleteOption(req.params.ballotid, req.body.optionid, function () {
			res.send(200);
		});
	});
}
