var socketio = require('socket.io');

exports.listen = function (app) {
	var io = socketio.listen(app);

	io.configure(function() {
		io.set('store', backend.socketIoStore);
	});

	io.sockets.on('connection', function(socket) {
		console.log('NEW CONNECTION!!!');

		socket.on('registerbeamers', function (data) {
			backend.beamer.getAll(function (beamerid, beamer) {
				socket.emit('beamer-add', {beamerid: beamerid, beamer: beamer});
			});
		});

		socket.on('registerbeamer', function (data) {
			// Initialize Beamerstate
			backend.beamer.get(data.beamerid, function (beamer) {
				backend.agenda.get(beamer.currentslideid, function (currentslide) {
					socket.emit('beamer-change:' + data.beamerid, {beamer : beamer, currentslide: currentslide});
				});
			});

			backend.beamer.getTimers(data.beamerid, function (timerid, timer) {
				socket.emit('beamer-showtimer:' + data.beamerid, { timerid : timerid, timer : timer });
			});
		});

		socket.on('registertimers', function (data) {
			backend.timers.getAll(function (timerid, timer) {
				socket.emit('timer-add', {timerid: timerid, timer: timer});
			});
		});

		socket.on('registeragenda', function (data) {
			// Send rootslide. client may ask for children
			backend.agenda.getRootSlideID(function (rootslideid) {
				socket.emit('slide-add', {slideid: rootslideid});
			});
		});

		socket.on('registerslide', function (data) {
			backend.agenda.get(data.slideid, function (slide) {
				socket.emit('slide-change:' + data.slideid, { slide: slide });
			});
			
			// Send children
			var position = 0;
			backend.agenda.eachChildren(data.slideid, function(subslideid, subslide) {
				socket.emit('slide-add:' + data.slideid, {slideid: subslideid, position: position++});
			});
		});
	});
	return io;
}
