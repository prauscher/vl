exports.exists = function (timerid, callback) {
	db.exists('timers:' + timerid, function (err, exists) {
		callback(exists);
	});
}

exports.get = function(timerid, callback) {
	db.hgetall('timers:' + timerid, function(err, timer) {
		callback(timer);
	});
}

exports.getAll = function(callback) {
	db.smembers('timers', function (err, timerids) {
		callback(timerids);
	});
}

exports.add = function(timerid, callbackSuccess) {
	db.sadd('timers', timerid, function () {
		callbackSuccess();
	});
}

exports.save = function(timerid, timer, callbackSuccess) {
	db.hmset('timers:' + timerid, timer, function (err) {
		callbackSuccess();
	});
}

exports.delete = function(timerid, callbackSuccess) {
	db.srem('timers', timerid, function (err) {
		db.del('timers:' + timerid, function (err) {
			exports.getAll(function (beamerids) {
				beamerids.forEach(function (beamerid) {
					db.sismember('beamer:' + beamerid + ':timers', timerid, function (err, ismember) {
						if (ismember) {
							db.srem('beamer:' + beamerid + ':timers', timerid);
						}
					});
				});
			});

			callbackSuccess();
		});
	});
}
