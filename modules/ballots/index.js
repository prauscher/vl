// vim:noet:sw=8:

var backendRouter = require('../backendRouter.js'),
    OptionsModule = require('./options.js');

module.exports = function (options) {
	var self = this;
	this.socket = options.addSocket("/ballots", "ballots", require("./socket.js").apply(this));
	this.backend = require("./backend.js").apply(this);

	options.put('/ballots/:ballotid/save', "ballots:save", backendRouter.generateSave(this.backend, "ballotid", "ballot") );

	options.put('/ballots/:ballotid/addOption', "ballots:options", function (req, res) {
		self.backend.addOption(req.params.ballotid, req.body.optionid, req.body.option, function () {
			res.send(200);
		});
	});

	options.post('/ballots/:ballotid/moveOption', "ballots:options", function (req, res) {
		self.backend.moveOption(req.params.ballotid, req.body.optionid, req.body.position, function () {
			res.send(200);
		});
	});

	options.post('/ballots/:ballotid/deleteOption', "ballots:options", function (req, res) {
		self.backend.deleteOption(req.params.ballotid, req.body.optionid, function () {
			res.send(200);
		});
	});

	this.options = new OptionsModule(options);
}
