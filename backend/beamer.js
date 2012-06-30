exports.exists = function(beamerid, callback) {
	core.beamer.exists(beamerid, function (exists) {
		if (callback) {
			callback(exists);
		}
	});
}

exports.get = function(beamerid, callback) {
	core.beamer.get(beamerid, function (beamer) {
		if (callback) {
			callback(beamer);
		}
	});
}

exports.getAll = function(callback) {
	core.beamer.getAll(function (beamerids) {
		beamerids.forEach(function (beamerid, n) {
			exports.get(beamerid, function (beamer) {
				callback(beamerid, beamer);
			});
		});
	});
}

exports.getTimers = function(beamerid, callback) {
	core.beamer.getTimers(beamerid, function (timerids) {
		timerids.forEach(function (timerid, n) {
			backend.timers.get(timerid, function (timer) {
				callback(timerid, timer);
			});
		});
	});
}

exports.add = function(beamerid, beamer, callbackSuccess) {
	exports.save(beamerid, beamer, function () {
		core.beamer.add(beamerid, function () {
			io.sockets.emit('beamer-add', { beamerid : beamerid, beamer : beamer });

			if (callbackSuccess) {
				callbackSuccess();
			}
		});
	});
}

exports.save = function(beamerid, beamer, callbackSuccess) {
	core.beamer.save(beamerid, beamer, function () {
		backend.agenda.get(beamer.currentslideid, function (currentslide) {
			io.sockets.emit('beamer-change:' + beamerid, { beamer : beamer, currentslide : currentslide });

			if (callbackSuccess) {
				callbackSuccess();
			}
		});
	});
}

exports.delete = function(beamerid, callbackSuccess) {
	core.beamer.delete(beamerid, function () {
		io.sockets.emit('beamer-delete:' + beamerid, {});

		if (callbackSuccess) {
			callbackSuccess();
		}
	});
}

exports.flash = function(beamerid, flash, callbackSuccess) {
	io.sockets.emit('beamer-flash:' + beamerid, { flash : flash });

	if (callbackSuccess) {
		callbackSuccess();
	}
}

exports.identify = function(timeout, callbackSuccess) {
	io.sockets.emit('beamer-identify', { timeout : timeout });
	if (callbackSuccess) {
		callbackSuccess();
	}
}

exports.showtimer = function(beamerid, timerid, timer, callbackSuccess) {
	core.beamer.showTimer(beamerid, timerid, function () {
		io.sockets.emit('beamer-showtimer:' + beamerid, { timerid : timerid, timer : timer });

		if (callbackSuccess) {
			callbackSuccess();
		}
	});
}

exports.hidetimer = function(beamerid, timerid, timer, callbackSuccess) {
	core.beamer.hideTimer(beamerid, timerid, function () {
		io.sockets.emit('beamer-hidetimer:' + beamerid, { timerid : timerid, timer : timer });
		if (callbackSuccess) {
			callbackSuccess();
		}
	});
}
