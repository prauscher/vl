exports.getDefault = function(callback) {
	db.get('defaultbeamer', function(err, defaultbeamer) {
		callback(defaultbeamer);
	});
}

exports.setDefault = function(beamerid, callback) {
	db.set('defaultbeamer', beamerid, function(err) {
		callback();
	});
}

exports.exists = function(beamerid, callback) {
	db.exists('beamer:' + beamerid, function (err, exists) {
		callback(exists);
	});
}

exports.get = function(beamerid, callbackSuccess) {
	db.hgetall('beamer:' + beamerid, function(err, beamer) {
		callbackSuccess(beamer);
	});
}

exports.getAll = function(callback) {
	db.smembers('beamer', function(err, beamerids) {
		callback(beamerids);
	});
}

exports.getTimers = function(beamerid, callback) {
	db.smembers('beamer:' + beamerid + ':timers', function (err, timerids) {
		callback(timerids);
	});
}

exports.add = function(beamerid, callbackSuccess) {
	db.sadd('beamer', beamerid, function () {
		callbackSuccess();
	});
}

exports.save = function(beamerid, beamer, callbackSuccess) {
	db.hmset('beamer:' + beamerid, beamer, function(err) {
		callbackSuccess();
	});
}

exports.delete = function(beamerid, callbackSuccess) {
	db.srem('beamer', beamerid, function (err) {
		db.del('beamer:' + beamerid, function(err) {
			db.del('beamer:' + beamerid + ':timers');

			callbackSuccess();
		});
	});
}

exports.showTimer = function(beamerid, timerid, callbackSuccess) {
	db.sadd('beamer:' + beamerid + ':timers', timerid, function() {
		callbackSuccess();
	});
}

exports.hideTimer = function(beamerid, timerid, callbackSuccess) {
	db.srem('beamer:' + beamerid + ':timers', timerid, function() {
		callbackSuccess();
	});
}
