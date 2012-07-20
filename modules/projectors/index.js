// vim:noet:sw=8:

var backendRouter = require('../backendRouter.js');

module.exports = function (options) {
	this.backend = require("./backend.js");

	options.put('/projectors/:projectorid/save', "projectors:save", backendRouter.generateSave(this.backend, "projectorid", "projector") );
	options.post('/projectors/:projectorid/delete', "projectors:delete", backendRouter.generateDelete(this.backend, "projectorid") );

	options.post('/projectors/:projectorid/showTimer', "projectors:timers", function (req, res) {
		modules.timers.backend.get(req.body.timerid, function (timer) {
			self.backend.projectors.showTimer(req.params.projectorid, req.body.timerid, timer, function() {
				res.send(200);
			});
		});
	});

	options.post('/projectors/:projectorid/hideTimer', "projectors:timers", function (req, res) {
		modules.timers.backend.get(req.body.timerid, function (timer) {
			self.backend.hideTimer(req.params.projectorid, req.body.timerid, timer, function() {
				res.send(200);
			});
		});
	});

	options.put('/projectors', "projectors:setDefault", function(req, res) {
		self.backend.setDefault(req.body.projectorid, function (err) {
			res.send(200);
		});
	});

	options.post('/identify-projectors', "projectors:identify", function (req, res) {
		self.backend.identify(req.body.timeout, function () {
			res.send(200);
		});
	});

	options.post('/projectors/:projectorid/flash', "projectors:flash", function (req, res) {
		self.backend.flash(req.params.projectorid, req.body.flash, function () {
			res.send(200);
		});
	});

	global.projectorSocket = options.addSocket("/projectors", "projectors", require("./socket.js").apply(this));
}
