// vim:noet:sw=8:

var backendRouter = require('../backendRouter.js');

module.exports = function (options) {
	this.backend = require("./backend.js");

	options.put('/pollsites/:pollsiteid/save', "pollsites:save", backendRouter.generateSave(this.backend, "pollsiteid", "pollsite") );
	options.post('/pollsites/:pollsiteid/delete', "pollsites:delete", backendRouter.generateDelete(this.backend, "pollsiteid") );

	global.pollsiteSocket = options.addSocket("/pollsites", "pollsites", require("./socket.js").apply(this));
}
