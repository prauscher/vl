// vim:noet:sw=8:

var backendRouter = require('./backend.js');

exports.save = backendRouter.generateSave(backend.timers, "timerid", "timer");
exports.delete = backendRouter.generateDelete(backend.timers, "timerid");

exports.start = function (req, res) {
	update(req.body.timer);

	req.body.timer.running = "true";
	backend.timers.save(req.params.timerid, req.body.timer, function () {
		res.send(200);
	});
}

exports.pause = function (req, res) {
	update(req.body.timer);
	
	req.body.timer.running = "false";
	backend.timers.save(req.params.timerid, req.body.timer, function () {
		res.send(200);
	});
}

exports.stop = function (req, res) {
	update(req.body.timer);
	
	req.body.timer.running = "false";
	req.body.timer.startedValue = req.body.timer.value;
	backend.timers.save(req.params.timerid, req.body.timer, function () {
		res.send(200);
	});
}

// Set started-value to current Date, eventually setting value
function update(timer) {
	var now = new Date();
	if (timer.running == "true") {
		timer.startedValue = Math.max(0, timer.startedValue - (now.getTime() - new Date(timer.started).getTime()) / 1000);
	}
	timer.started = now;
}
