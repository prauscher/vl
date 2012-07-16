// vim:noet:sw=8:

var backendRouter = require('./backend.js');

exports.save = backendRouter.generateSave(backend.pollsites, "pollsiteid", "pollsite");
exports.delete = backendRouter.generateDelete(backend.pollsites, "pollsiteid");
