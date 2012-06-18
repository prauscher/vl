function APIClient() {
	this.callbacks = {};
}

APIClient.prototype.connect = function (callback) {
	var self = this;

	this.socketIo = io.connect();
	this.socketIo.on('connect', function () {
		callback.apply(self, []);
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
