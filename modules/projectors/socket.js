// vim:noet:sw=8:

module.exports = function () {
	var self = this;

	return function (socket) {
		socket.on('registerdefaultprojector', function (data) {
			self.backend.getDefault(function (projectorid) {
				socket.emit('projector-set-default', {projectorid: projectorid});
			});
		});

		socket.on('registerprojectors', function (data) {
			self.backend.getAll(function (projectorid, projector) {
				socket.emit('projector-add', {projectorid: projectorid, projector: projector});
			});
		});

		socket.on('registerprojector', function (data) {
			// Initialize Projectorstate
			self.backend.get(data.projectorid, function (projector) {
				if (projector == null) {
					socket.emit('err:projector-not-found:' + data.projectorid, {});
				} else {
					socket.emit('projector-change:' + data.projectorid, {projector : projector});
				}
			});

			self.backend.getTimers(data.projectorid, function (timerid, timer) {
				socket.emit('projector-showtimer:' + data.projectorid, { timerid : timerid, timer : timer });
			});
		});
	}
}
