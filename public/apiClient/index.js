// vim:noet:sw=8:

function APIClient() {
	this.callbacks = {};
	this.sockets = {};

	this.socket = io.connect().socket;
}

APIClient.prototype.getSocket = function (path, callback) {
	var self = this;

	if (this.sockets[path]) {
		callback(this.sockets[path]);
	} else {
		console.log("[APIClient] connecting to " + path);
		this.sockets[path] = this.socket.of(path)
			.on("connect", function () {
				console.log("[APIClient] connected to " + path);
				callback(this);
			});
	}
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
