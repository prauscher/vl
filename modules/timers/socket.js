// vim:noet:sw=8:

module.exports = function () {
	var self = this;

	return function (socket) {
		socket.on('registertimers', function (data) {
			self.backend.getAll(function (timerid, timer) {
				socket.emit('timer-add', {timerid: timerid, timer: timer});
			});
		});
	}
}
