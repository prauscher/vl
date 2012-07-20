// vim:noet:sw=8:

var FlatStructure = require("../backendStructureFlat.js");

module.exports = function () {
	var self = this;

	var backend = new FlatStructure({
		sanitize : function (item) {
			return item;
		},
		broadcastAdd : function (id, item) {
			self.socket.emit('projector-add', { projectorid : id, projector : item });
		},
		broadcastChange : function (id, item) {
			self.socket.emit('projector-change:' + id, { projector : item });
		},
		broadcastDelete : function(id) {
			self.socket.emit('projector-delete:' + id, {});
		},
		backend : core.projectors
	});

	backend.getDefault = function (callback) {
		core.projectors.getDefault(function (defaultprojector) {
			if (callback) {
				callback(defaultprojector);
			}
		});
	}

	backend.setDefault = function (projectorid, callback) {
		core.projectors.setDefault(projectorid, function () {
			self.socket.emit('projector-set-default', { projectorid : projectorid });

			if (callback) {
				callback();
			}
		});
	}

	backend.flash = function (projectorid, flash, callbackSuccess) {
		self.socket.emit('projector-flash:' + projectorid, { flash : flash });

		if (callbackSuccess) {
			callbackSuccess();
		}
	}

	backend.identify = function (timeout, callbackSuccess) {
		self.socket.emit('projector-identify', { timeout : timeout });
		if (callbackSuccess) {
			callbackSuccess();
		}
	}

	backend.getTimers = function (id, callback) {
		core.projectors.getTimers(id, function (timerids) {
			timerids.forEach(function (timerid, n) {
				modules.timers.backend.get(timerid, function (timer) {
					callback(timerid, timer);
				});
			});
		});
	}

	backend.showTimer = function (projectorid, timerid, timer, callbackSuccess) {
		core.projectors.showTimer(projectorid, timerid, function () {
			self.socket.emit('projector-showtimer:' + projectorid, { timerid : timerid, timer : timer });

			if (callbackSuccess) {
				callbackSuccess();
			}
		});
	}

	backend.hideTimer = function (projectorid, timerid, timer, callbackSuccess) {
		core.projectors.hideTimer(projectorid, timerid, function () {
			self.socket.emit('projector-hidetimer:' + projectorid, { timerid : timerid, timer : timer });
			if (callbackSuccess) {
				callbackSuccess();
			}
		});
	}

	return backend;
}
