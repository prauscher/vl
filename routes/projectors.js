// vim:noet:sw=8:

var backendRouter = require('./backend.js');

module.exports = function (options) {
	options.put('/projectors/:projectorid/save', "projectors:save", backendRouter.generateSave(backend.projectors, "projectorid", "projector") );

	options.post('/projectors/:projectorid/delete', "projectors:delete", backendRouter.generateDelete(backend.projectors, "projectorid") );

	options.post('/projectors/:projectorid/showTimer', "projectors:timers", function (req, res) {
		backend.timers.get(req.body.timerid, function (timer) {
			backend.projectors.showTimer(req.params.projectorid, req.body.timerid, timer, function() {
				res.send(200);
			});
		});
	});

	options.post('/projectors/:projectorid/hideTimer', "projectors:timers", function (req, res) {
		backend.timers.get(req.body.timerid, function (timer) {
			backend.projectors.hideTimer(req.params.projectorid, req.body.timerid, timer, function() {
				res.send(200);
			});
		});
	});

	options.put('/projectors', "projectors:setDefault", function(req, res) {
		backend.projectors.setDefault(req.body.projectorid, function (err) {
			res.send(200);
		});
	});

	options.post('/identify-projectors', "projectors:identify", function (req, res) {
		backend.projectors.identify(req.body.timeout, function () {
			res.send(200);
		});
	});

	options.post('/projectors/:projectorid/flash', "projectors:flash", function (req, res) {
		backend.projectors.flash(req.params.projectorid, req.body.flash, function () {
			res.send(200);
		});
	});
}
