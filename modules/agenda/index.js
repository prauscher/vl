// vim:noet:sw=8:

var backendRouter = require('../backendRouter.js');

module.exports = function (options) {
	this.backend = require('./backend.js');

	options.put('/agenda/:slideid/save', "agenda:save", backendRouter.generateSave(this.backend, "slideid", "slide") );
	options.post('/agenda/:slideid/move', "agenda:move", backendRouter.generateMove(this.backend, "slideid", "parentid", "position") );
	options.post('/agenda/:slideid/delete', "agenda:delete", backendRouter.generateDelete(this.backend, "slideid") );

	global.agendaSocket = options.addSocket("/agenda", "agenda", require("./socket.js").apply(this));
}
