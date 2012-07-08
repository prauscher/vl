var backendRouter = require('./backend.js');

exports.save = backendRouter.generateSave(backend.motionclasses, "motionclassid", "motionclass");
exports.move = backendRouter.generateMove(backend.motionclasses, "motionclassid", "parentid", "position");
exports.delete = backendRouter.generateDelete(backend.motionclasses, "motionclassid");
