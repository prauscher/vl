// vim:noet:sw=8:

var backendRouter = require('../backendRouter.js');

module.exports = function (options) {
	this.backend = require("./options-backend.js");

	options.put('/options/:optionid/save', "ballots:options", backendRouter.generateSave(this.backend, "optionid", "option") );
}
