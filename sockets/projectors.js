// vim:noet:sw=8:

module.exports = function (socket) {
	socket.on('registerdefaultprojector', function (data) {
		backend.projectors.getDefault(function (projectorid) {
			socket.emit('projector-set-default', {projectorid: projectorid});
		});
	});

	socket.on('registerprojectors', function (data) {
		backend.projectors.getAll(function (projectorid, projector) {
			socket.emit('projector-add', {projectorid: projectorid, projector: projector});
		});
	});

	socket.on('registerprojector', function (data) {
		// Initialize Projectorstate
		backend.projectors.get(data.projectorid, function (projector) {
			if (projector == null) {
				socket.emit('err:projector-not-found:' + data.projectorid, {});
			} else {
				socket.emit('projector-change:' + data.projectorid, {projector : projector});
			}
		});

		backend.projectors.getTimers(data.projectorid, function (timerid, timer) {
			socket.emit('projector-showtimer:' + data.projectorid, { timerid : timerid, timer : timer });
		});
	});
}
