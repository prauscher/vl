function sanitizeTimer(timer) {
	var now = new Date();
	if (timer.running == "true") {
		timer.current = Math.max(0, timer.startedValue - (now.getTime() - new Date(timer.started).getTime()) / 1000);
	} else {
		timer.current = timer.startedValue;
	}
	return timer;
}

exports.exists = function (timerid, callback) {
	core.timers.exists(timerid, function (exists) {
		if (callback) {
			callback(exists);
		}
	});
}

exports.get = function(timerid, callback) {
	core.timers.get(timerid, function (timer) {
		if (callback) {
			callback(sanitizeTimer(timer));
		}
	});
}

exports.getAll = function(callback) {
	core.timers.getAll(function (timerids) {
		timerids.forEach(function (timerid, n) {
			exports.get(timerid, function (timer) {
				callback(timerid, timer);
			});
		});
	});
}

exports.add = function(timerid, timer, callbackSuccess) {
	exports.save(timerid, timer, function() {
		core.timers.add(timerid, function () {
			io.sockets.emit('timer-add', { timerid : timerid, timer : sanitizeTimer(timer) });

			if (callbackSuccess) {
				callbackSuccess();
			}
		});
	});
}

exports.save = function(timerid, timer, callbackSuccess) {
	core.timers.save(timerid, timer, function () {
		io.sockets.emit('timer-change:' + timerid, { timer : sanitizeTimer(timer) });

		if (callbackSuccess) {
			callbackSuccess();
		}
	});
}

exports.delete = function(timerid, callbackSuccess) {
	core.timers.delete(timerid, function () {
		io.sockets.emit('timer-delete:' + timerid, {});

		if (callbackSuccess) {
			callbackSuccess();
		}
	});
}
