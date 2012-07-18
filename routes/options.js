// vim:noet:sw=8:

var backendRouter = require('./backend.js');

module.exports = function (options) {
	options.put('/options/:optionid/save', "ballots:options", backendRouter.generateSave(backend.options, "optionid", "option") );
}

