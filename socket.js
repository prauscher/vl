// vim:noet:sw=8:

var socketio = require('socket.io');

module.exports = function () {
	var self = this;
	var io = socketio.listen(this.app);

	io.configure(function() {
		io.set('store', self.backend.socketIoStore);
	});

	return io;
}
