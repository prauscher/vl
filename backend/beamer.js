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
		db.publish('beamer-add', JSON.stringify({ beamerid : beamerid, beamer : beamer }));

		if (callbackSuccess) {
			callbackSuccess();
		}
	});
}

exports.save = function(beamerid, beamer, callbackSuccess) {
	db.hmset('beamer:' + beamerid, beamer, function(err) {
		db.hgetall('slides:' + beamer.currentslideid, function (err, currentslide) {
			db.publish('beamer-change:' + beamerid, JSON.stringify({ beamer : beamer, currentslide : currentslide }));
			if (callbackSuccess) {
				callbackSuccess();
			}
		});
	});
}

exports.delete = function(beamerid, callbackSuccess) {
	
}

exports.flash = function(beamerid, flash, callbackSuccess) {
	db.publish('beamer-flash:' + beamerid, JSON.stringify({ flash : flash }));
	if (callbackSuccess) {
		callbackSuccess();
	}
}

exports.showtimer = function(beamerid, timerid, timer, callbackSuccess) {
	console.log("Show " + timerid + " on " + beamerid);
	db.sadd('beamer:' + beamerid + ':timers', timerid, function() {
		db.publish('beamer-showtimer:' + beamerid, JSON.stringify({ timerid : timerid, timer : timer }));
		if (callbackSuccess) {
			callbackSuccess();
		}
	});
}

exports.hidetimer = function(beamerid, timerid, timer, callbackSuccess) {
	db.srem('beamer:' + beamerid + ':timers', timerid, function() {
		db.publish('beamer-hidetimer:' + beamerid, JSON.stringify({ timerid : timerid, timer : timer }));
		if (callbackSuccess) {
			callbackSuccess();
		}
	});
}

exports.identify = function(timeout, callbackSuccess) {
	db.publish('beamer-identify', JSON.stringify({ timeout : timeout }));
	if (callbackSuccess) {
		callbackSuccess();
	}
}
