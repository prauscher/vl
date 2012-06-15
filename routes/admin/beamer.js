exports.save = function(req, res) {
	db.exists('beamer:' + req.params.beamerid, function (err, exists) {
		if (! exists) {
			backend.beamer.add(req.params.beamerid, req.body.beamer);
		} else {
			backend.beamer.save(req.params.beamerid, req.body.beamer);
		}
	});
};

exports.flash = function (req, res) {
	backend.beamer.flash(req.params.beamerid, req.body.flash, function () {
		res.send(200);
	});
};
