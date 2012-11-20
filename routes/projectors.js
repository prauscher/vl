// vim:noet:sw=8:

var backendRouter = require('./backend.js');

exports.save = backendRouter.generateSave(backend.projectors, "projectorid", "projector");
exports.delete = backendRouter.generateDelete(backend.projectors, "projectorid");

exports.showProjector = function(req,res) {
	res.render('showProjector', { projectorid : req.params.projectorid });
}

exports.setDefault = function(req, res) {
	backend.projectors.setDefault(req.body.projectorid, function (err) {
		res.send(200);
	});
}

exports.flash = function (req, res) {
	backend.projectors.flash(req.params.projectorid, req.body.flash, function () {
		res.send(200);
	});
};

exports.clearFlash = function (req, res) {
	backend.projectors.clearFlash(req.params.projectorid, function () {
		res.send(200);
	});
}

exports.showTimer = function (req, res) {
	backend.timers.get(req.body.timerid, function (timer) {
		backend.projectors.showTimer(req.params.projectorid, req.body.timerid, timer, function() {
			res.send(200);
		});
	});
}

exports.hideTimer = function (req, res) {
	backend.timers.get(req.body.timerid, function (timer) {
		backend.projectors.hideTimer(req.params.projectorid, req.body.timerid, timer, function() {
			res.send(200);
		});
	});
}

exports.identify = function (req, res) {
	backend.projectors.identify(req.body.timeout, function () {
		res.send(200);
	});
}
