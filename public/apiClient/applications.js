APIClient.prototype.applications = {};

APIClient.prototype.eachApplication = function (callback) {
	for (var applicationid in this.applications) {
		callback(applicationid, this.applications[applicationid]);
	}
}

APIClient.prototype.getApplication = function (applicationid, callback) {
	callback(this.applications[applicationid]);
}

APIClient.prototype.registerApplication = function (applicationid) {
	var self = this;
	this.socketIo.on('err:application-not-found:' + applicationid, function (data) {
		console.log("[APIClient] Application not found: " + applicationid);
		self.callCallback("error:applicationNotFound", [ applicationid ]);
	});
	this.socketIo.on('application-change:' + applicationid, function (data) {
		self.applications[applicationid] = data.application;

		self.callCallback("updateApplication", [ applicationid, data.application ] );
	});
	this.socketIo.on('application-delete:' + applicationid, function (data) {
		delete self.applications[applicationid];
		self.unregisterApplication(applicationid);
		self.callCallback("deleteApplication", [ applicationid ] );
	});

	this.socketIo.emit('registerapplication', { applicationid: applicationid });
}

APIClient.prototype.unregisterApplication = function (applicationid) {
	this.socketIo.removeAllListeners('err:application-not-found:' + applicationid);
	this.socketIo.removeAllListeners('application-change:' + applicationid);
	this.socketIo.removeAllListeners('application-delete:' + applicationid);
}

APIClient.prototype.saveApplication = function(applicationid, application, callbackSuccess) {
	$.ajax({
		type: 'PUT',
		url: '/applications/' + applicationid + '/save',
		data: { application : application },
		success: callbackSuccess
	});
}

APIClient.prototype.moveApplication = function (applicationid, categoryid, position, callbackSuccess) {
	$.ajax({
		type: 'POST',
		url: '/applications/' + applicationid + '/move',
		data: { categoryid: categoryid, position: position },
		success: callbackSuccess
	});
}

APIClient.prototype.deleteApplication = function(applicationid, callbackSuccess) {
	$.ajax({
		type: 'POST',
		url: '/applications/' + applicationid + '/delete',
		success: callbackSuccess
	});
}
