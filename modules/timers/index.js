// vim:noet:sw=8:

var backendRouter = require('../backendRouter.js');

module.exports = function (options) {
	var self = this;
	this.socket = options.addSocket("/timers", "timers", require("./socket.js").apply(this));
	this.backend = require("./backend.js").apply(this);

	// Set started-value to current Date, eventually setting value
	function update(timer) {
		var now = new Date();
		if (timer.running == "true") {
			timer.startedValue = Math.max(0, timer.startedValue - (now.getTime() - new Date(timer.started).getTime()) / 1000);
		}
		timer.started = now;
	}

	options.put('/timers/:timerid/save', "timers:save", backendRouter.generateSave(this.backend, "timerid", "timer") );
	options.post('/timers/:timerid/delete', "timers:delete", backendRouter.generateDelete(this.backend, "timerid") );

	options.post('/timers/:timerid/start', "timers:run", function (req, res) {
		update(req.body.timer);

		req.body.timer.running = "true";
		self.backend.save(req.params.timerid, req.body.timer, function () {
			res.send(200);
		});
	});

	options.post('/timers/:timerid/pause', "timers:run", function (req, res) {
		update(req.body.timer);

		req.body.timer.running = "false";
		self.backend.save(req.params.timerid, req.body.timer, function () {
			res.send(200);
		});
	});

	options.post('/timers/:timerid/start', "timers:run", function (req, res) {
		update(req.body.timer);

		req.body.timer.running = "false";
		req.body.timer.startedValue = req.body.timer.value;
		self.backend.save(req.params.timerid, req.body.timer, function () {
			res.send(200);
		});
	});
}
