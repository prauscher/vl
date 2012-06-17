var socketio = require('socket.io');

exports.listen = function (redis, app) {
	var io = socketio.listen(app);

	io.configure(function() {
		io.set('store', new socketio.RedisStore());
	});

	io.sockets.on('connection', function(socket) {
		console.log('NEW CONNECTION!!!');

		// Forward redis-messages (which are hopefully json-content) to the client
		var socketDb = redis.createClient();
		socketDb.on('message', function (channel, message) {
			socket.emit(channel, JSON.parse(message));
		});

		socket.on('registeridentifybeamer', function (data) {
			socketDb.subscribe('beamer-identify');
		});

		socket.on('registerbeamers', function (data) {
			socketDb.subscribe('beamer-add');
			socketDb.subscribe('beamer-delete');

			backend.beamer.getAll(function (beamerid, beamer) {
				socket.emit('beamer-add', {beamerid: beamerid, beamer: beamer});
			});
		});

		socket.on('registerbeamer', function (data) {
			socketDb.subscribe('beamer-change:' + data.beamerid);
			socketDb.subscribe('beamer-flash:' + data.beamerid);
			socketDb.subscribe('beamer-showtimer:' + data.beamerid);
			socketDb.subscribe('beamer-hidetimer:' + data.beamerid);

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
			socketDb.subscribe('timer-add');
			socketDb.subscribe('timer-delete');

			backend.timers.getAll(function (timerid, timer) {
				socket.emit('timer-add', {timerid: timerid, timer: timer});
			});
		});

		socket.on('registeragenda', function (data) {
			socketDb.subscribe('slide-add');
			socketDb.subscribe('slide-delete');
			socketDb.subscribe('slide-move');

			// Inform about our beamerviews
			backend.beamer.getAll(function (beamerid, beamer) {
				socket.emit('beamer-add', {beamerid: beamerid, beamer: beamer});
			});

			// Send _ALL_ the slides for initialization
			backend.agenda.getAll(function (slideid, slide) {
				socket.emit('slide-add', {slideid: slideid, slide: slide});
			});
		});

		socket.on('registerslide', function(data) {
			socketDb.subscribe('slide-change:' + data.slideid);
		});

		socket.on('unregisterslide', function(data) {
			socketDb.unsubscribe('slide-change:' + data.slideid);
		});

		socket.on('registertimer', function (data) {
			socketDb.subscribe('timer-change:' + data.timerid);
		});

		socket.on('unregistertimer', function (data) {
			socketDb.unsubscribe('timer-change:' + data.timerid);
		});
	});
	return io;
}
