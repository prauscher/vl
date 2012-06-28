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
		beamerids.forEach(function (beamerid, n) {
			exports.get(beamerid, function (beamer) {
				callback(beamerid, beamer);
			});
		});
	});
}

exports.getTimers = function(beamerid, callback) {
	db.smembers('beamer:' + beamerid + ':timers', function (err, timerids) {
		timerids.forEach(function (timerid, n) {
			backend.timers.get(timerid, function (timer) {
				callback(timerid, timer);
			});
		});
	});
}

exports.add = function(beamerid, beamer, callbackSuccess) {
	exports.save(beamerid, beamer, function () {
		db.sadd('beamer', beamerid);
		io.sockets.emit('beamer-add', { beamerid : beamerid, beamer : beamer });

		if (callbackSuccess) {
			callbackSuccess();
		}
	});
}

exports.save = function(beamerid, beamer, callbackSuccess) {
	db.hmset('beamer:' + beamerid, beamer, function(err) {
		db.hgetall('slides:' + beamer.currentslideid, function (err, currentslide) {
			io.sockets.emit('beamer-change:' + beamerid, { beamer : beamer, currentslide : currentslide });

			if (callbackSuccess) {
				callbackSuccess();
			}
		});
	});
}

exports.delete = function(beamerid, callbackSuccess) {
	db.srem('beamer', beamerid, function (err) {
		db.del('beamer:' + beamerid, function(err) {
			db.del('beamer:' + beamerid + ':timers');
			io.sockets.emit('beamer-delete:' + beamerid, {});

			if (callbackSuccess) {
				callbackSuccess();
			}
		});
	});
}

exports.flash = function(beamerid, flash, callbackSuccess) {
	io.sockets.emit('beamer-flash:' + beamerid, { flash : flash });

	if (callbackSuccess) {
		callbackSuccess();
	}
}

exports.showtimer = function(beamerid, timerid, timer, callbackSuccess) {
	db.sadd('beamer:' + beamerid + ':timers', timerid, function() {
		io.sockets.emit('beamer-showtimer:' + beamerid, { timerid : timerid, timer : timer });

		if (callbackSuccess) {
			callbackSuccess();
		}
	});
}

exports.hidetimer = function(beamerid, timerid, timer, callbackSuccess) {
	db.srem('beamer:' + beamerid + ':timers', timerid, function() {
		io.sockets.emit('beamer-hidetimer:' + beamerid, { timerid : timerid, timer : timer });
		if (callbackSuccess) {
			callbackSuccess();
		}
	});
}

exports.identify = function(timeout, callbackSuccess) {
	io.sockets.emit('beamer-identify', { timeout : timeout });
	if (callbackSuccess) {
		callbackSuccess();
	}
}
