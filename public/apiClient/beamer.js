APIClient.prototype.beamers = {};
APIClient.prototype.beamerTimers = {};

APIClient.prototype.getBeamer = function (beamerid, callback) {
	callback(this.beamers[beamerid]);
}

APIClient.prototype.eachBeamer = function (callback) {
	for (var beamerid in this.beamers) {
		callback(beamerid, this.beamers[beamerid]);
	}
}

APIClient.prototype.registerIdentifyBeamer = function () {
	var self = this;
	this.socketIo.on('beamer-identify', function (data) {
		self.callCallback("identifyBeamer", [ data.timeout ] );
	});
}

APIClient.prototype.registerBeamers = function () {
	var self = this;
	this.socketIo.on('beamer-add', function (data) {
		self.beamers[data.beamerid] = data.beamer;

		self.registerBeamer(data.beamerid);
		self.callCallback("initBeamer", [ data.beamerid, data.beamer ] );
	});
	this.socketIo.emit('registerbeamers', {});
}

APIClient.prototype.registerBeamer = function (beamerid) {
	var self = this;
	self.beamerTimers[beamerid] = [];
	this.socketIo.on('err:beamer-not-found:' + beamerid, function (data) {
		console.debug("[APIClient] Beamer not found: " + beamerid);
		self.callCallback("error:beamerNotFound", [ beamerid ]);
	});
	this.socketIo.on('beamer-change:' + beamerid, function (data) {
		self.beamers[beamerid] = data.beamer;

		self.callCallback("updateBeamer", [ beamerid, data.beamer ] );
	});
	this.socketIo.on('beamer-flash:' + beamerid, function (data) {
		self.callCallback("flashBeamer", [ beamerid, data.flash ]);
	});
	this.socketIo.on('beamer-showtimer:' + beamerid, function (data) {
		self.callCallback("showTimerBeamer", [ beamerid, data.timerid, data.timer ]);
		self.beamerTimers[beamerid].push(data.timerid);
	});
	this.socketIo.on('beamer-hidetimer:' + beamerid, function (data) {
		self.callCallback("hideTimerBeamer", [ beamerid, data.timerid, data.timer ]);
		self.beamerTimers[beamerid].splice(self.beamerTimers[beamerid].indexOf(data.timerid), 1);
	});
	this.socketIo.on('beamer-delete:' + beamerid, function (data) {
		self.unregisterBeamer(beamerid);
		self.callCallback("deleteBeamer", [ beamerid ]);
	});
	this.socketIo.emit('registerbeamer', { beamerid : beamerid });
}

APIClient.prototype.unregisterBeamer = function(beamerid) {
	this.socketIo.removeAllListeners('err:beamer-not-found:' + beamerid);
	this.socketIo.removeAllListeners('beamer-change:' + beamerid);
	this.socketIo.removeAllListeners('beamer-flash:' + beamerid);
	this.socketIo.removeAllListeners('beamer-showtimer:' + beamerid);
	this.socketIo.removeAllListeners('beamer-hidetimer:' + beamerid);
	this.socketIo.removeAllListeners('beamer-delete:' + beamerid);
}

APIClient.prototype.eachBeamerTimer = function(beamerid, callback) {
	var self = this;
	this.beamerTimers[beamerid].forEach(function (timerid) {
		self.getTimer(timerid, function (timer) {
			callback(timerid, timer);
		});
	});
}

APIClient.prototype.beamerHasTimer = function(beamerid, timerid, callback) {
	callback(this.beamerTimers[beamerid].indexOf(timerid) != -1);
}

APIClient.prototype.setDefaultBeamer = function (beamerid, callbackSuccess) {
	$.ajax({
		type: 'PUT',
		url: '/beamer',
		data: { beamerid: beamerid },
		success: callbackSuccess
	});
}

APIClient.prototype.saveBeamer = function(beamerid, beamer, callbackSuccess) {
	$.ajax({
		type: 'PUT',
		url: '/beamer/' + beamerid + "/save",
		data: { beamer : beamer },
		success: callbackSuccess
	});
}

APIClient.prototype.deleteBeamer = function (beamerid, callbackSuccess) {
	$.ajax({
		type: 'POST',
		url: '/beamer/' + beamerid + '/delete',
		success: callbackSuccess
	});
}

APIClient.prototype.flashBeamer = function (beamerid, flash, callbackSuccess) {
	$.ajax({
		type: 'POST',
		url: '/beamer/' + beamerid + '/flash',
		data: { flash: flash },
		success: callbackSuccess
	});
}

APIClient.prototype.showTimerBeamer = function (beamerid, timerid, callbackSuccess) {
	$.ajax({
		type: 'POST',
		url: '/beamer/' + beamerid + '/showtimer',
		data: { timerid: timerid },
		success: callbackSuccess
	});
}

APIClient.prototype.hideTimerBeamer = function (beamerid, timerid, callbackSuccess) {
	$.ajax({
		type: 'POST',
		url: '/beamer/' + beamerid + '/hidetimer',
		data: { timerid: timerid },
		success: callbackSuccess
	});
}
