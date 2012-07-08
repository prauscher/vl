exports.showMotion = function (req, res) {
	res.render('showProjector', { motionid : req.params.motionid });
}

exports.save = function (req, res) {
	var motion = req.body.motion;

	backend.motions.exists(req.params.motionid, function (exists) {
		if (! exists) {
			backend.motions.add(req.params.motionid, motion, function() {
				res.send(200);
			});
		} else {
			backend.motions.save(req.params.motionid, motion, function() {
				res.send(200);
			});
		}
	});
}

exports.move = function (req, res) {
	backend.motions.move(req.params.motionid, req.body.classid, req.body.position, function () {
		res.send(200);
	});
}

exports.delete = function (req, res) {
	backend.motions.delete(req.params.motionid, function () {
		res.send(200);
	});
}
