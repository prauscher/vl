// vim:noet:sw=8:

var socketio = require('socket.io');

exports.listen = function (app) {
	var io = socketio.listen(app);

	io.configure(function() {
		io.set('store', backend.socketIoStore);
	});

	return io;
}

exports.projectors = require('./sockets/projectors.js');
exports.timers = require('./sockets/timers.js');
exports.agenda = require('./sockets/agenda.js');
exports.motions = require('./sockets/motions.js');
exports.elections = require('./sockets/elections.js');
exports.ballots = require('./sockets/ballots.js');
exports.pollsites = require('./sockets/pollsites.js');
