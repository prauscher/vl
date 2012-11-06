// vim:noet:sw=8:

function APIClient() {
	this.callbacks = {};
	this.sockets = {};

	this.socket = io.connect('').socket;

	this.socket.on('reconnect', function() {
		self.callCallback('reconnect', []);
	});

	var self = this;

	this.socket.on('reconnecting', function(nextDelay, count) {
		console.log('reconnecting...');
		console.log(count);
		if (count == 2)
			self.callCallback('lostConnection', []);
	});
}

APIClient.prototype.getSocket = function (path, callback) {
	callback(this.socket.of(path));
}

APIClient.prototype.listen = function (path, event, callback) {
	this.getSocket(path, function (socket) {
		socket.removeAllListeners(event);
		socket.on(event, function (data) {
			callback(data);
		});
	});
}

APIClient.prototype.unlisten = function (path, event) {
	this.getSocket(path, function (socket) {
		socket.removeAllListeners(event);
	});
}

APIClient.prototype.emit = function (path, event, data) {
	this.getSocket(path, function (socket) {
		socket.emit(event, data);
	});
}

APIClient.prototype.on = function (event, callback) {
	if (! this.callbacks[event]) {
		this.callbacks[event] = [];
	}
	this.callbacks[event][this.callbacks[event].length] = callback;
}

APIClient.prototype.callCallback = function (event, args) {
	if (this.callbacks[event]) {
		for (var index in this.callbacks[event]) {
			this.callbacks[event][index].apply(this, args);
		}
	}
}
