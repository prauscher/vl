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

exports.showtimer = function (req, res) {
	backend.timers.get(req.body.timerid, function (timer) {
		backend.beamer.showtimer(req.params.beamerid, req.body.timerid, timer, function() {
			res.send(200);
		});
	});
}

exports.hidetimer = function (req, res) {
	backend.timers.get(req.body.timerid, function (timer) {
		backend.beamer.hidetimer(req.params.beamerid, req.body.timerid, timer, function() {
			res.send(200);
		});
	});
}

exports.identify = function (req, res) {
	db.publish('beamer-identify', JSON.stringify({ timeout : req.body.timeout }));
	res.send(200);
}
