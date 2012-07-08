var backendRouter = require('./backend.js');

exports.showMotion = function (req, res) {
	res.render('showProjector', { motionid : req.params.motionid });
}

exports.save = backendRouter.generateSave(backend.motions, "motionid", "motion");
exports.move = backendRouter.generateMove(backend.motions, "motionid", "classid", "position");
exports.delete = backendRouter.generateDelete(backend.motions, "motionid");
