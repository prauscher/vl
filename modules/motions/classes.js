// vim:noet:sw=8:

var backendRouter = require('../backendRouter.js');

module.exports = function (options) {
	this.backend = require("./classes-backend.js");

	options.put('/motionclasses/:motionclassid/save', "motionclasses:save", backendRouter.generateSave(this.backend, "motionclassid", "motionclass") );
	options.post('/motionclasses/:motionclassid/move', "motionclasses:move", backendRouter.generateMove(this.backend, "motionclassid", "parentid", "position") );
	options.post('/motionclasses/:motionclassid/delete', "motionclasses:delete", backendRouter.generateDelete(this.backend, "motionclassid") );
}
