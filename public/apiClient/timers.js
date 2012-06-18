APIClient.prototype.timers = {};

APIClient.prototype.getTimer = function (timerid, callback) {
	callback(this.timers[timerid]);
}

APIClient.prototype.eachTimer = function (callback) {
	for (var timerid in this.timers) {
		callback(timerid, this.timers[timerid]);
	}
}

APIClient.prototype.registerTimers = function () {
	var self = this;
	this.socketIo.on('timer-add', function (data) {
		self.timers[data.timerid] = data.timer;

		self.registerTimer(data.timerid);
		self.callCallback("initTimer", [ data.timerid, data.timer ]);
		self.callCallback("updateTimer", [ data.timerid, data.timer ]);
	});
	this.socketIo.emit('registertimers', {});
}

APIClient.prototype.registerTimer = function (timerid) {
	var self = this;
	this.socketIo.on('timer-change:' + timerid, function (updateData) {
		self.timers[timerid] = updateData.timer;

		self.callCallback("updateTimer", [ timerid, updateData.timer ] );
	});
	this.socketIo.on('timer-delete:' + timerid, function (data) {
		self.callCallback("deleteTimer", [ timerid ] );
	});
}

APIClient.prototype.unregisterTimer = function (timerid) {
	this.socketIo.removeAllListeners('timer-change:' + timerid);
}

APIClient.prototype.saveTimer = function(timerid, timer, callbackSuccess) {
	$.ajax({
		type: 'PUT',
		url: '/timers/' + timerid + '/save',
		data: { timer : timer },
		success: callbackSuccess
	});
}

APIClient.prototype.deleteTimer = function(timerid, callbackSuccess) {
	$.ajax({
		type: 'POST',
		url: '/timers/' + timerid + '/delete',
		success: callbackSuccess
	});
}

APIClient.prototype.startTimer = function (timerid, timer) {
	$.ajax({
		type: 'POST',
		url: '/timers/' + timerid + '/start',
		data: { timer : timer }
	});
}

APIClient.prototype.pauseTimer = function (timerid, timer) {
	$.ajax({
		type: 'POST',
		url: '/timers/' + timerid + '/pause',
		data: { timer : timer }
	});
}

APIClient.prototype.stopTimer = function (timerid, timer) {
	$.ajax({
		type: 'POST',
		url: '/timers/' + timerid + '/stop',
		data: { timer : timer }
	});
}
