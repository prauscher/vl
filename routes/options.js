// vim:noet:sw=8:

var backendRouter = require('./backend.js');

exports.save = backendRouter.generateSave(backend.options, "optionid", "option");

