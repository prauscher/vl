// vim:noet:sw=8:

module.exports = function (socket) {
	socket.on('registertimers', function (data) {
		backend.timers.getAll(function (timerid, timer) {
			socket.emit('timer-add', {timerid: timerid, timer: timer});
		});
	});
}
