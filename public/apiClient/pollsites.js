APIClient.prototype.pollsites = {};

APIClient.prototype.getPollsite = function (pollsiteid, callback) {
	callback(this.pollsites[pollsiteid]);
}

APIClient.prototype.eachPollsite = function (callback) {
	for (var pollsiteid in this.pollsites) {
		callback(pollsiteid, this.pollsites[pollsiteid]);
	}
}

APIClient.prototype.registerPollsites = function () {
	var self = this;
	this.socketIo.on('pollsite-add', function (data) {
		self.pollsites[data.pollsiteid] = data.pollsite;

		self.registerPollsite(data.pollsiteid);
		self.callCallback("initPollsite", [ data.pollsiteid, data.pollsite ]);
		self.callCallback("updatePollsite", [ data.pollsiteid, data.pollsite ]);
	});
	this.socketIo.emit('registerpollsites', {});
}

APIClient.prototype.registerPollsite = function (pollsiteid) {
	var self = this;
	this.socketIo.on('pollsite-change:' + pollsiteid, function (updateData) {
		self.pollsites[pollsiteid] = updateData.pollsite;

		self.callCallback("updatePollsite", [ pollsiteid, updateData.pollsite ] );
	});
	this.socketIo.on('pollsite-delete:' + pollsiteid, function (data) {
		self.unregisterPollsite(pollsiteid);
		self.callCallback("deletePollsite", [ pollsiteid ] );
	});
}

APIClient.prototype.unregisterPollsite = function (pollsiteid) {
	this.socketIo.removeAllListeners('pollsite-change:' + pollsiteid);
	this.socketIo.removeAllListeners('pollsite-delete:' + pollsiteid);
}

APIClient.prototype.savePollsite = function(pollsiteid, pollsite, callbackSuccess) {
	$.ajax({
		type: 'PUT',
		url: '/pollsites/' + pollsiteid + '/save',
		data: { pollsite : pollsite },
		success: callbackSuccess
	});
}

APIClient.prototype.deletePollsite = function(pollsiteid, callbackSuccess) {
	$.ajax({
		type: 'POST',
		url: '/pollsites/' + pollsiteid + '/delete',
		success: callbackSuccess
	});
}
