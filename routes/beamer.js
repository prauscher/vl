var backendRouter = require('./backend.js');

exports.save = backendRouter.generateSave(backend.beamer, "beamerid", "beamer");
exports.delete = backendRouter.generateDelete(backend.beamer, "beamerid");

exports.showBeamer = function(req,res) {
	res.render('showBeamer', { beamerid : req.params.beamerid });
}

exports.setDefault = function(req, res) {
	backend.beamer.setDefault(req.body.beamerid, function (err) {
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
		backend.beamer.showTimer(req.params.beamerid, req.body.timerid, timer, function() {
			res.send(200);
		});
	});
}

exports.hideTimer = function (req, res) {
	backend.timers.get(req.body.timerid, function (timer) {
		backend.beamer.hideTimer(req.params.beamerid, req.body.timerid, timer, function() {
			res.send(200);
		});
	});
}

exports.identify = function (req, res) {
	backend.beamer.identify(req.body.timeout, function () {
		res.send(200);
	});
}
