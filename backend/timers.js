exports.exists = function (timerid, callback) {
	db.exists('timers:' + timerid, function (err, exists) {
		callback(exists);
	});
}

exports.get = function(timerid, callback) {
	db.hgetall('timers:' + timerid, function(err, timer) {
		callback(sanitizeTimer(timer));
	});
}

exports.getAll = function(callback) {
	db.smembers('timers', function (err, timerids) {
		timerids.forEach(function (timerid, n) {
			exports.get(timerid, function (timer) {
				callback(timerid, timer);
			});
		});
	});
}

exports.add = function(timerid, timer, callbackSuccess) {
	exports.save(timerid, timer, function() {
		db.sadd('timers', timerid);
		io.sockets.emit('timer-add', { timerid : timerid, timer : sanitizeTimer(timer) });

		if (callbackSuccess) {
			callbackSuccess();
		}
	});
}

exports.save = function(timerid, timer, callbackSuccess) {
	db.hmset('timers:' + timerid, timer, function (err) {
		io.sockets.emit('timer-change:' + timerid, { timer : sanitizeTimer(timer) });

		if (callbackSuccess) {
			callbackSuccess();
		}
	});
}

exports.delete = function(timerid, callbackSuccess) {
	db.srem('timers', timerid, function (err) {
		db.del('timers:' + timerid, function (err) {
			backend.beamer.getAll(function (beamerid, beamer) {
				db.sismember('beamer:' + beamerid + ':timers', timerid, function (ismember) {
					if (ismember) {
						db.srem('beamer:' + beamerid + ':timers', timerid);
					}
				});
			});
			io.sockets.emit('timer-delete:' + timerid, {});

			if (callbackSuccess) {
				callbackSuccess();
			}
		});
	});
}

function sanitizeTimer(timer) {
	var now = new Date();
	if (timer.running == "true") {
		timer.current = Math.max(0, timer.startedValue - (now.getTime() - new Date(timer.started).getTime()) / 1000);
	} else {
		timer.current = timer.startedValue;
	}
	return timer;
}
