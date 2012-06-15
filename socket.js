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

		socket.on('registerbeamer', function (data) {
			socketDb.subscribe('beamer-goto:' + data.beamerid);
			socketDb.subscribe('beamer-flash');

			// Initialize Beamerstate
			db.hget('beamer:' + data.beamerid, 'currentslideid', function (err, currentslideid) {
				db.hgetall('slides:' + currentslideid, function (err, currentslide) {
					socket.emit('beamer-goto:' + data.beamerid, {slideid : currentslideid, slide: currentslide});
				});
			});
		});

		socket.on('registertimers', function (data) {
			socketDb.subscribe('timer-init');
			socketDb.subscribe('timer-start');
			socketDb.subscribe('timer-stop');
		});

		socket.on('registeragenda', function (data) {
			socketDb.subscribe('slide-add');
			socketDb.subscribe('slide-delete');
			socketDb.subscribe('slide-move');

			// Inform about our beamerviews
			db.smembers('beamer', function (err, beamerids) {
				beamerids.forEach(function(beamerid, n) {
					db.hgetall('beamer:' + beamerid, function (err, beamer) {
						socket.emit('beamer-add', {beamerid: beamerid, beamer: beamer});
					});
				});
			});

			// Send _ALL_ the slides for initialization (recursive)
			function sendSlide(slideid) {
				db.hgetall('slides:' + slideid, function (err, slide) {
					if (slide != null) {
						socketDb.subscribe('slide-change:' + slideid);
						socket.emit('slide-add', {slideid: slideid, slide: slide});
						sendSubSlides(slideid);
					}
				});
			}
			function sendSubSlides(slideid) {
				db.zrange('slides:' + slideid + ":children", 0, -1, function (err, slideids) {
					slideids.forEach(function(slideid, n) {
						sendSlide(slideid);
					});
				});
			}
			db.get('rootslideid', function (err, rootslideid) {
				sendSlide(rootslideid);
			});
		});

		socket.on('slide-open', function(data) {
			socketDb.subscribe('slide-change:' + data.slideid);
		});

		socket.on('slide-close', function(data) {
			socketDb.unsubscribe('slide-change:' + data.slideid);
		});
	});
	return io;
}
