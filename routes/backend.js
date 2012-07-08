exports.generateSave = function (backend, idfield, itemfield) {
	return function (req, res) {
		var item = req.body[itemfield];

		backend.exists(req.params[idfield], function (exists) {
			if (! exists) {
				backend.add(req.params[idfield], item, function() {
					res.send(200);
				});
			} else {
				backend.save(req.params[idfield], item, function() {
					res.send(200);
				});
			}
		});
	}
}

exports.generateMove = function (backend, idfield, parentfield, positionfield) {
	return function (req, res) {
		backend.move(req.params[idfield], req.body[parentfield], req.body[positionfield], function () {
			res.send(200);
		});
	}
}

exports.generateDelete = function (backend, idfield) {
	return function (req, res) {
		backend.delete(req.params[idfield], function () {
			res.send(200);
		});
	}
}
