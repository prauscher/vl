// vim:noet:sw=8:

var FlatStructure = require('./structure/flat.js');

module.exports = new FlatStructure({
	sanitize : function (item) {
		return item;
	},
	broadcastAdd : function (id, item) {
		projectorSocket.emit('projector-add', { projectorid : id, projector : item });
	},
	broadcastChange : function (id, item) {
		projectorSocket.emit('projector-change:' + id, { projector : item });
	},
	broadcastDelete : function(id) {
		projectorSocket.emit('projector-delete:' + id, {});
	},
	backend : core.projectors
});

module.exports.getDefault = function (callback) {
	core.projectors.getDefault(function (defaultprojector) {
		if (callback) {
			callback(defaultprojector);
		}
	});
}

module.exports.setDefault = function (projectorid, callback) {
	core.projectors.setDefault(projectorid, function () {
		projectorSocket.emit('projector-set-default', { projectorid : projectorid });

		if (callback) {
			callback();
		}
	});
}

module.exports.flash = function (projectorid, flash, callbackSuccess) {
	projectorSocket.emit('projector-flash:' + projectorid, { flash : flash });

	if (callbackSuccess) {
		callbackSuccess();
	}
}

module.exports.identify = function (timeout, callbackSuccess) {
	projectorSocket.emit('projector-identify', { timeout : timeout });
	if (callbackSuccess) {
		callbackSuccess();
	}
}

module.exports.getTimers = function (id, callback) {
	core.projectors.getTimers(id, function (timerids) {
		timerids.forEach(function (timerid, n) {
			backend.timers.get(timerid, function (timer) {
				callback(timerid, timer);
			});
		});
	});
}

module.exports.showTimer = function (projectorid, timerid, timer, callbackSuccess) {
	core.projectors.showTimer(projectorid, timerid, function () {
		projectorSocket.emit('projector-showtimer:' + projectorid, { timerid : timerid, timer : timer });

		if (callbackSuccess) {
			callbackSuccess();
		}
	});
}

module.exports.hideTimer = function (projectorid, timerid, timer, callbackSuccess) {
	core.projectors.hideTimer(projectorid, timerid, function () {
		projectorSocket.emit('projector-hidetimer:' + projectorid, { timerid : timerid, timer : timer });
		if (callbackSuccess) {
			callbackSuccess();
		}
	});
 }
