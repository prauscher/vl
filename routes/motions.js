// vim:noet:sw=8:

var backendRouter = require('./backend.js');

exports.save = backendRouter.generateSave(backend.motions, "motionid", "motion", function (motionid, motion, created) {
	if (created) {
		backend.motionclasses.get(motion.classid, function (motionclass) {
			if (motionclass.slideid && motionclass.slideid != "") {
				backend.agenda.add("motion-" + motionid, {
					parentid: motionclass.slideid,
					type: "motion",
					hidden: false,
					isdone: false,
					motionid: motionid,
					title: motionid + ": " + motion.title
				});
				console.log("TODO: create slide for " + motionid + " below " + motionclass.slideid);
			}
		});
	}
});
exports.move = backendRouter.generateMove(backend.motions, "motionid", "classid", "position");
exports.delete = backendRouter.generateDelete(backend.motions, "motionid");

exports.addBallot = function (req, res) {
	backend.motions.addBallot(req.params.motionid, req.body.ballotid, req.body.ballot, function() {
		res.send(200);
	});
}

exports.deleteBallot = function (req, res) {
	backend.motions.deleteBallot(req.params.motionid, req.body.ballotid, function () {
		res.send(200);
	});
}
