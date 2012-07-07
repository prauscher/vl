exports.save = function (req, res) {
	backend.pollsites.exists(req.params.pollsiteid, function (exists) {
		if (! exists) {
			backend.pollsites.add(req.params.pollsiteid, req.body.pollsite, function () {
				res.send(200);
			});
		} else {
			backend.pollsites.save(req.params.pollsiteid, req.body.pollsite, function () {
				res.send(200);
			});
		}
	});
}

exports.delete = function (req, res) {
	backend.pollsites.delete(req.params.pollsiteid, function() {
		res.send(200);
	});
}
