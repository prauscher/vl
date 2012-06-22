exports.showSlide = function (req, res) {
	res.render('showBeamer', { slideid : req.params.slideid });
}

exports.save = function (req, res) {
	var slide = req.body.slide;

	backend.agenda.exists(req.params.slideid, function (exists) {
		if (! exists) {
			backend.agenda.add(req.params.slideid, slide, function() {
				res.send(200);
			});
		} else {
			backend.agenda.save(req.params.slideid, slide, function() {
				res.send(200);
			});
		}
	});
}

exports.move = function (req, res) {
	backend.agenda.move(req.params.slideid, req.body.parentid, req.body.position, function () {
		res.send(200);
	});
}

exports.delete = function (req, res) {
	backend.agenda.delete(req.params.slideid, function () {
		res.send(200);
	});
}
