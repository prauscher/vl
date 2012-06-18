APIClient.prototype.beamers = {};

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
		self.callCallback("updateBeamer", [ data.beamerid, data.beamer, data.currentslide ] );
	});
	this.socketIo.emit('registerbeamers', {});
}

APIClient.prototype.registerBeamer = function (beamerid) {
	var self = this;
	this.socketIo.on('beamer-change:' + beamerid, function (data) {
		self.beamers[beamerid] = data.beamer;

		self.callCallback("updateBeamer", [ beamerid, data.beamer, data.currentslide ] );
	});
	this.socketIo.on('beamer-flash:' + beamerid, function (data) {
		self.callCallback("flashBeamer", [ beamerid, data.flash ]);
	});
	this.socketIo.on('beamer-showtimer:' + beamerid, function (data) {
		self.callCallback("showTimerBeamer", [ beamerid, data.timerid, data.timer ]);
	});
	this.socketIo.on('beamer-hidetimer:' + beamerid, function (data) {
		self.callCallback("hideTimerBeamer", [ beamerid, data.timerid, data.timer ]);
	});
	this.socketIo.on('beamer-delete:' + beamerid, function (data) {
		self.callCallback("deleteBeamer", [ beamerid ]);
	});
	this.socketIo.emit('registerbeamer', { beamerid : beamerid });
}

APIClient.prototype.saveBeamer = function(beamerid, beamer, callbackSuccess) {
	$.ajax({
		type: 'PUT',
		url: '/beamer/' + beamerid + "/save",
		data: { beamer : beamer },
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
