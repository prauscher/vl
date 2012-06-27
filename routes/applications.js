exports.save = function (req, res) {
	var application = req.body.application;

	backend.applications.exists(req.params.applicationid, function (exists) {
		if (! exists) {
			backend.applications.add(req.params.applicationid, application, function() {
				res.send(200);
			});
		} else {
			backend.applications.save(req.params.applicationid, application, function() {
				res.send(200);
			});
		}
	});
}

exports.move = function (req, res) {
	backend.applications.move(req.params.applicationid, req.body.categoryid, req.body.position, function () {
		res.send(200);
	});
}

exports.delete = function (req, res) {
	backend.applications.delete(req.params.applicationid, function () {
		res.send(200);
	});
}
