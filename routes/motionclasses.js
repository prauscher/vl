exports.save = function (req, res) {
	var motionclass = req.body.motionclass;

	backend.motionclasses.exists(req.params.motionclassid, function (exists) {
		if (! exists) {
			backend.motionclasses.add(req.params.motionclassid, motionclass, function() {
				res.send(200);
			});
		} else {
			backend.motionclasses.save(req.params.motionclassid, motionclass, function() {
				res.send(200);
			});
		}
	});
}

exports.move = function (req, res) {
	backend.motionclasses.move(req.params.motionclassid, req.body.parentid, req.body.position, function () {
		res.send(200);
	});
}

exports.delete = function (req, res) {
	backend.motionclasses.delete(req.params.motionclassid, function () {
		res.send(200);
	});
}
