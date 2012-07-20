// vim:noet:sw=8:

var backendRouter = require('../backendRouter.js');

module.exports = function (options) {
	this.socket = options.addSocket("/agenda", "agenda", require("./socket.js").apply(this));
	this.backend = require('./backend.js').apply(this);

	options.put('/agenda/:slideid/save', "agenda:save", backendRouter.generateSave(this.backend, "slideid", "slide") );
	options.post('/agenda/:slideid/move', "agenda:move", backendRouter.generateMove(this.backend, "slideid", "parentid", "position") );
	options.post('/agenda/:slideid/delete', "agenda:delete", backendRouter.generateDelete(this.backend, "slideid") );
}
