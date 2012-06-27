exports.save = function (req, res) {
	var appcategory = req.body.appcategory;

	backend.appcategorys.exists(req.params.appcategoryid, function (exists) {
		if (! exists) {
			backend.appcategorys.add(req.params.appcategoryid, appcategory, function() {
				res.send(200);
			});
		} else {
			backend.appcategorys.save(req.params.appcategoryid, appcategory, function() {
				res.send(200);
			});
		}
	});
}

exports.move = function (req, res) {
	backend.appcategorys.move(req.params.appcategoryid, req.body.parentid, req.body.position, function () {
		res.send(200);
	});
}

exports.delete = function (req, res) {
	backend.appcategorys.delete(req.params.appcategoryid, function () {
		res.send(200);
	});
}
