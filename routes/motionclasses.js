// vim:noet:sw=8:

var backendRouter = require('./backend.js');

module.exports = function (options) {
	options.put('/motionclasses/:motionclassid/save', "motionclasses:save", backendRouter.generateSave(backend.motionclasses, "motionclassid", "motionclass") );
	options.post('/motionclasses/:motionclassid/move', "motionclasses:move", backendRouter.generateMove(backend.motionclasses, "motionclassid", "parentid", "position") );
	options.post('/motionclasses/:motionclassid/delete', "motionclasses:delete", backendRouter.generateDelete(backend.motionclasses, "motionclassid") );
}
