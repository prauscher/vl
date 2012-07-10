APIClient.prototype.projectors = {};
APIClient.prototype.projectorTimers = {};

APIClient.prototype.getProjector = function (projectorid, callback) {
	callback(this.projectors[projectorid]);
}

APIClient.prototype.eachProjector = function (callback) {
	for (var projectorid in this.projectors) {
		callback(projectorid, this.projectors[projectorid]);
	}
}

APIClient.prototype.registerDefaultProjector = function () {
	var self = this;
	this.listen("/projectors", 'projector-set-default', function (data) {
		self.callCallback("setDefaultProjector", [ data.projectorid ] );
	});
	this.emit("/projectors", 'registerdefaultprojector', {});
}

APIClient.prototype.unregisterDefaultProjector = function () {
	this.unlisten("/projectors", 'projector-set-default');
}

APIClient.prototype.registerIdentifyProjector = function () {
	var self = this;
	this.listen("/projectors", 'projector-identify', function (data) {
		self.callCallback("identifyProjector", [ data.timeout ] );
	});
}

APIClient.prototype.unregisterIdentifyProjector = function () {
	this.unlisten("/projectors", 'projector-identify');
}

APIClient.prototype.registerProjectors = function () {
	var self = this;
	this.listen("/projectors", 'projector-add', function (data) {
		self.projectors[data.projectorid] = data.projector;

		self.registerProjector(data.projectorid);
		self.callCallback("initProjector", [ data.projectorid, data.projector ] );
	});
	this.emit("/projectors", 'registerprojectors', {});
}

APIClient.prototype.registerProjector = function (projectorid) {
	var self = this;
	self.projectorTimers[projectorid] = [];
	this.listen("/projectors", 'err:projector-not-found:' + projectorid, function (data) {
		console.debug("[APIClient] Projector not found: " + projectorid);
		self.callCallback("error:projectorNotFound", [ projectorid ]);
	});
	this.listen("/projectors", 'projector-change:' + projectorid, function (data) {
		self.projectors[projectorid] = data.projector;

		self.callCallback("updateProjector", [ projectorid, data.projector ] );
	});
	this.listen("/projectors", 'projector-flash:' + projectorid, function (data) {
		self.callCallback("flashProjector", [ projectorid, data.flash ]);
	});
	this.listen("/projectors", 'projector-showtimer:' + projectorid, function (data) {
		self.callCallback("showTimerProjector", [ projectorid, data.timerid, data.timer ]);
		self.projectorTimers[projectorid].push(data.timerid);
	});
	this.listen("/projectors", 'projector-hidetimer:' + projectorid, function (data) {
		self.callCallback("hideTimerProjector", [ projectorid, data.timerid, data.timer ]);
		self.projectorTimers[projectorid].splice(self.projectorTimers[projectorid].indexOf(data.timerid), 1);
	});
	this.listen("/projectors", 'projector-delete:' + projectorid, function (data) {
		self.unregisterProjector(projectorid);
		self.callCallback("deleteProjector", [ projectorid ]);
	});
	this.emit("/projectors", 'registerprojector', { projectorid : projectorid });
}

APIClient.prototype.unregisterProjector = function(projectorid) {
	this.unlisten("/projectors", 'err:projector-not-found:' + projectorid);
	this.unlisten("/projectors", 'projector-change:' + projectorid);
	this.unlisten("/projectors", 'projector-flash:' + projectorid);
	this.unlisten("/projectors", 'projector-showtimer:' + projectorid);
	this.unlisten("/projectors", 'projector-hidetimer:' + projectorid);
	this.unlisten("/projectors", 'projector-delete:' + projectorid);
}

APIClient.prototype.eachProjectorTimer = function(projectorid, callback) {
	var self = this;
	this.projectorTimers[projectorid].forEach(function (timerid) {
		self.getTimer(timerid, function (timer) {
			callback(timerid, timer);
		});
	});
}

APIClient.prototype.projectorHasTimer = function(projectorid, timerid, callback) {
	callback(this.projectorTimers[projectorid].indexOf(timerid) != -1);
}

APIClient.prototype.setDefaultProjector = function (projectorid, callbackSuccess) {
	$.ajax({
		type: 'PUT',
		url: '/projectors',
		data: { projectorid: projectorid },
		success: callbackSuccess
	});
}

APIClient.prototype.saveProjector = function(projectorid, projector, callbackSuccess) {
	$.ajax({
		type: 'PUT',
		url: '/projectors/' + projectorid + "/save",
		data: { projector : projector },
		success: callbackSuccess
	});
}

APIClient.prototype.deleteProjector = function (projectorid, callbackSuccess) {
	$.ajax({
		type: 'POST',
		url: '/projectors/' + projectorid + '/delete',
		success: callbackSuccess
	});
}

APIClient.prototype.flashProjector = function (projectorid, flash, callbackSuccess) {
	$.ajax({
		type: 'POST',
		url: '/projectors/' + projectorid + '/flash',
		data: { flash: flash },
		success: callbackSuccess
	});
}

APIClient.prototype.showTimerProjector = function (projectorid, timerid, callbackSuccess) {
	$.ajax({
		type: 'POST',
		url: '/projectors/' + projectorid + '/showtimer',
		data: { timerid: timerid },
		success: callbackSuccess
	});
}

APIClient.prototype.hideTimerProjector = function (projectorid, timerid, callbackSuccess) {
	$.ajax({
		type: 'POST',
		url: '/projectors/' + projectorid + '/hidetimer',
		data: { timerid: timerid },
		success: callbackSuccess
	});
}
