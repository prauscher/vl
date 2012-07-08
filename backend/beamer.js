var FlatStructure = require('./structure/flat.js');

module.exports = new FlatStructure({
	sanitize : function (item) {
		return item;
	},
	broadcastAdd : function (id, item) {
		beamerSocket.emit('beamer-add', { beamerid : id, beamer : item });
	},
	broadcastChange : function (id, item) {
		beamerSocket.emit('beamer-change:' + id, { beamer : item });
	},
	broadcastDelete : function(id) {
		beamerSocket.emit('beamer-delete:' + id, {});
	},
	backend : core.beamer
});

module.exports.getDefault = function (callback) {
	core.beamer.getDefault(function (defaultbeamer) {
		if (callback) {
			callback(defaultbeamer);
		}
	});
}

module.exports.setDefault = function (beamerid, callback) {
	core.beamer.setDefault(beamerid, function () {
		beamerSocket.emit('beamer-set-default', { beamerid : beamerid });

		if (callback) {
			callback();
		}
	});
}

module.exports.flash = function (beamerid, flash, callbackSuccess) {
	beamerSocket.emit('beamer-flash:' + beamerid, { flash : flash });

	if (callbackSuccess) {
		callbackSuccess();
	}
}

module.exports.identify = function (timeout, callbackSuccess) {
	beamerSocket.emit('beamer-identify', { timeout : timeout });
	if (callbackSuccess) {
		callbackSuccess();
	}
}

module.exports.getTimers = function (id, callback) {
	core.beamer.getTimers(id, function (timerids) {
		timerids.forEach(function (timerid, n) {
			backend.timers.get(timerid, function (timer) {
				callback(timerid, timer);
			});
		});
	});
}

module.exports.showTimer = function (beamerid, timerid, timer, callbackSuccess) {
	core.beamer.showTimer(beamerid, timerid, function () {
		beamerSocket.emit('beamer-showtimer:' + beamerid, { timerid : timerid, timer : timer });

		if (callbackSuccess) {
			callbackSuccess();
		}
	});
}

module.exports.hideTimer = function (beamerid, timerid, timer, callbackSuccess) {
	core.beamer.hideTimer(beamerid, timerid, function () {
		beamerSocket.emit('beamer-hidetimer:' + beamerid, { timerid : timerid, timer : timer });
		if (callbackSuccess) {
			callbackSuccess();
		}
	});
 }
