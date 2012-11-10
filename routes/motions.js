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
			}
		});
	}
});

exports.saveEmpty = function (req, res) {
	backend.motionclasses.get(req.body["motion"].classid, function (motionclass) {
		backend.motionclasses.getNextMotionID(req.body["motion"].classid, function (nextMotionID) {
			req.params["motionid"] = motionclass.idPrefix + nextMotionID;
			exports.save(req, res);
		});
	});
}

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
