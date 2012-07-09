var backendRouter = require('./backend.js');

exports.showElection = function (req, res) {
	res.render('showProjector', { electionid : req.params.electionid });
}

exports.save = backendRouter.generateSave(backend.elections, "electionid", "election");
exports.delete = backendRouter.generateDelete(backend.elections, "electionid");
