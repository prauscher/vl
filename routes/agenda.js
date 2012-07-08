var backendRouter = require('./backend.js');

exports.showSlide = function (req, res) {
	res.render('showProjector', { slideid : req.params.slideid });
}

exports.save = backendRouter.generateSave(backend.agenda, "slideid", "slide");
exports.move = backendRouter.generateMove(backend.agenda, "slideid", "parentid", "position");
exports.delete = backendRouter.generateDelete(backend.agenda, "slideid");
