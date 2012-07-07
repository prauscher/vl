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

APIClient.prototype.registerDefaultBeamer = function () {
	var self = this;
	this.listen("/beamers", 'beamer-set-default', function (data) {
		self.callCallback("setDefaultBeamer", [ data.beamerid ] );
	});
	this.emit("/beamers", 'registerdefaultbeamer', {});
}

APIClient.prototype.registerIdentifyBeamer = function () {
	var self = this;
	this.listen("/beamers", 'beamer-identify', function (data) {
		self.callCallback("identifyBeamer", [ data.timeout ] );
	});
}

APIClient.prototype.registerBeamers = function () {
	var self = this;
	this.listen("/beamers", 'beamer-add', function (data) {
		self.beamers[data.beamerid] = data.beamer;

		self.registerBeamer(data.beamerid);
		self.callCallback("initBeamer", [ data.beamerid, data.beamer ] );
	});
	this.emit("/beamers", 'registerbeamers', {});
}

APIClient.prototype.registerBeamer = function (beamerid) {
	var self = this;
	self.beamerTimers[beamerid] = [];
	this.listen("/beamers", 'err:beamer-not-found:' + beamerid, function (data) {
		console.debug("[APIClient] Beamer not found: " + beamerid);
		self.callCallback("error:beamerNotFound", [ beamerid ]);
	});
	this.listen("/beamers", 'beamer-change:' + beamerid, function (data) {
		self.beamers[beamerid] = data.beamer;

		self.callCallback("updateBeamer", [ beamerid, data.beamer ] );
	});
	this.listen("/beamers", 'beamer-flash:' + beamerid, function (data) {
		self.callCallback("flashBeamer", [ beamerid, data.flash ]);
	});
	this.listen("/beamers", 'beamer-showtimer:' + beamerid, function (data) {
		self.callCallback("showTimerBeamer", [ beamerid, data.timerid, data.timer ]);
		self.beamerTimers[beamerid].push(data.timerid);
	});
	this.listen("/beamers", 'beamer-hidetimer:' + beamerid, function (data) {
		self.callCallback("hideTimerBeamer", [ beamerid, data.timerid, data.timer ]);
		self.beamerTimers[beamerid].splice(self.beamerTimers[beamerid].indexOf(data.timerid), 1);
	});
	this.listen("/beamers", 'beamer-delete:' + beamerid, function (data) {
		self.unregisterBeamer(beamerid);
		self.callCallback("deleteBeamer", [ beamerid ]);
	});
	this.emit("/beamers", 'registerbeamer', { beamerid : beamerid });
}

APIClient.prototype.unregisterBeamer = function(beamerid) {
	this.unlisten("/beamers", 'err:beamer-not-found:' + beamerid);
	this.unlisten("/beamers", 'beamer-change:' + beamerid);
	this.unlisten("/beamers", 'beamer-flash:' + beamerid);
	this.unlisten("/beamers", 'beamer-showtimer:' + beamerid);
	this.unlisten("/beamers", 'beamer-hidetimer:' + beamerid);
	this.unlisten("/beamers", 'beamer-delete:' + beamerid);
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
