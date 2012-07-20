// vim:noet:sw=8:

var backendRouter = require('../backendRouter.js');

module.exports = function (options) {
	this.socket = options.addSocket("/pollsites", "pollsites", require("./socket.js").apply(this));
	this.backend = require("./backend.js").apply(this);

	options.put('/pollsites/:pollsiteid/save', "pollsites:save", backendRouter.generateSave(this.backend, "pollsiteid", "pollsite") );
	options.post('/pollsites/:pollsiteid/delete', "pollsites:delete", backendRouter.generateDelete(this.backend, "pollsiteid") );
}
