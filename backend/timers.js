exports.get = function(timerid, callback) {
	db.hgetall('timers:' + timerid, function(err, timer) {
		callback(sanitizeTimer(timer));
	});
}

exports.add = function(timerid, timer, callbackSuccess) {
	exports.save(timerid, timer, function() {
		db.sadd('timers', timerid);
		db.publish('timer-add', JSON.stringify({ timerid : timerid, timer : sanitizeTimer(timer) }));

		if (callbackSuccess) {
			callbackSuccess();
		}
	});
}

exports.save = function(timerid, timer, callbackSuccess) {
	db.hmset('timers:' + timerid, timer, function (err) {
		db.publish('timer-change:' + timerid, JSON.stringify({ timer : sanitizeTimer(timer) }));

		if (callbackSuccess) {
			callbackSuccess();
		}
	});
}

exports.delete = function(timerid, callbackSuccess) {
	db.del('timers:' + timerid, function (err) {
		if (callbackSuccess) {
			callbackSuccess();
		}
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
