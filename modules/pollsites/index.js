// vim:noet:sw=8:

var backendRouter = require('../backendRouter.js');

module.exports = function (options) {
	options.put('/pollsites/:pollsiteid/save', "pollsites:save", backendRouter.generateSave(backend.pollsites, "pollsiteid", "pollsite") );
	options.post('/pollsites/:pollsiteid/delete', "pollsites:delete", backendRouter.generateDelete(backend.pollsites, "pollsiteid") );

	global.pollsiteSocket = options.addSocket("/pollsites", "pollsites", require("./socket.js"));
}
