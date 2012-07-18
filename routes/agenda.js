// vim:noet:sw=8:

var backendRouter = require('./backend.js');

module.exports = function (options) {
	options.put('/agenda/:slideid/save', "agenda:save", backendRouter.generateSave(backend.agenda, "slideid", "slide") );
	options.post('/agenda/:slideid/move', "agenda:move", backendRouter.generateMove(backend.agenda, "slideid", "parentid", "position") );
	options.post('/agenda/:slideid/delete', "agenda:delete", backendRouter.generateDelete(backend.agenda, "slideid") );
}
