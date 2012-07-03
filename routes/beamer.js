exports.showBeamer = function(req,res) {
	res.render('showBeamer', { beamerid : req.params.beamerid });
}

exports.setDefault = function(req, res) {
	backend.beamer.setDefault(req.body.beamerid, function (err) {
		res.send(200);
	});
}

exports.save = function(req, res) {
	backend.beamer.exists(req.params.beamerid, function (exists) {
		if (! exists) {
			backend.beamer.add(req.params.beamerid, req.body.beamer, function () {
				res.send(200);
			});
		} else {
			backend.beamer.save(req.params.beamerid, req.body.beamer, function () {
				res.send(200);
			});
		}
	});
};

exports.delete = function(req, res) {
	backend.beamer.delete(req.params.beamerid, function (err) {
		res.send(200);
	});
}

exports.flash = function (req, res) {
	backend.beamer.flash(req.params.beamerid, req.body.flash, function () {
		res.send(200);
	});
};

exports.showTimer = function (req, res) {
	backend.timers.get(req.body.timerid, function (timer) {
		backend.beamer.showtimer(req.params.beamerid, req.body.timerid, timer, function() {
			res.send(200);
		});
	});
}

exports.hideTimer = function (req, res) {
	backend.timers.get(req.body.timerid, function (timer) {
		backend.beamer.hidetimer(req.params.beamerid, req.body.timerid, timer, function() {
			res.send(200);
		});
	});
}

exports.identify = function (req, res) {
	backend.beamer.identify(req.body.timeout, function () {
		res.send(200);
	});
}
