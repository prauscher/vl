// vim:noet:sw=8:

var backendRouter = require('./backend.js');

module.exports = function (options) {
	options.put('/motions/:motionid/save', "motions:save", backendRouter.generateSave(backend.motions, "motionid", "motion") );
	options.post('/motions/:motionid/move', "motions:move", backendRouter.generateMove(backend.motions, "motionid", "classid", "position") );
	options.post('/motions/:motionid/delete', "motions:delete", backendRouter.generateDelete(backend.motions, "motionid") );

	options.put('/motions/:motionid/addBallot', "motions:ballots", function (req, res) {
		backend.motions.addBallot(req.params.motionid, req.body.ballotid, req.body.ballot, function() {
			res.send(200);
		});
	});

	options.post('/motions/:motionid/deleteBallot', "motions:ballots", function (req, res) {
		backend.motions.deleteBallot(req.params.motionid, req.body.ballotid, function () {
			res.send(200);
		});
	});
}
