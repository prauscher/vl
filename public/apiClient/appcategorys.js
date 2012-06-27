APIClient.prototype.appCategorys = {};
APIClient.prototype.appCategoryChildren = {};
APIClient.prototype.appCategoryApplications = {};

APIClient.prototype.eachAppCategory = function (callback) {
	for (var appCategoryid in this.appCategorys) {
		callback(appCategoryid, this.appCategorys[appCategoryid]);
	}
}

APIClient.prototype.getAppCategory = function (appCategoryid, callback) {
	callback(this.appCategorys[appCategoryid]);
}

APIClient.prototype.registerAppCategorys = function () {
	var self = this;
	this.socketIo.on('appcategory-add', function (data) {
		self.appCategorys[data.appcategoryid] = null;

		self.registerAppCategory(data.appcategoryid);
		self.callCallback("initAppCategory", [ data.appCategoryid, null ] );
	});
	this.socketIo.emit('registerappcategorys', {});
}

APIClient.prototype.registerAppCategory = function (appcategoryid) {
	var self = this;
	self.appCategoryChildren[appcategoryid] = [];
	self.appCategoryApplications[appcategoryid] = [];
	this.socketIo.on('err:appcategory-not-found:' + appcategoryid, function (data) {
		console.log("[APIClient] AppCategory not found: " + appcategoryid);
		self.callCallback("error:appCategoryNotFound", [ appcategoryid ]);
	});
	this.socketIo.on('appcategory-add:' + appcategoryid, function (data) {
		self.appCategorys[data.appcategoryid] = null;
		self.appCategoryChildren[appcategoryid].push(data.appcategoryid);

		self.registerAppCategory(data.appcategoryid);
		self.callCallback("initAppCategory", [ data.appcategoryid, appcategoryid, data.position ] );
	});
	this.socketIo.on('application-add:' + appcategoryid, function (data) {
		self.applications[data.applicationid] = null;
		self.appCategoryApplications[appcategoryid].push(data.applicationid);

		self.registerApplication(data.applicationid);
		self.callCallback("initApplication", [ data.application, appcategoryid, data.position ] );
	});
	this.socketIo.on('appcategory-change:' + appcategoryid, function (data) {
		self.appCategorys[appcategoryid] = data.appcategory;

		self.callCallback("updateAppCategory", [ appcategoryid, data.appcategory ] );
	});
	this.socketIo.on('appcategory-delete:' + appcategoryid, function (data) {
		var parentid = self.appCategorys[appcategoryid].parentid;
		delete self.appCategorys[parentid];
		self.appCategoryChildren[parentid].slice(self.appCategoryChildren[parentid].indexOf(appcategoryid), 1);

		self.unregisterAppCategory(appcategoryid);
		self.callCallback("deleteAppCategory", [ appcategoryid ] );
	});

	this.socketIo.emit('registerappcategory', { appcategoryid: appcategoryid });
}

APIClient.prototype.unregisterAppCategory = function (appcategoryid) {
	this.socketIo.removeAllListeners('err:appcategory-not-found:' + appcategoryid);
	this.socketIo.removeAllListeners('appcategory-add:' + appcategoryid);
	this.socketIo.removeAllListeners('application-add:' + appcategoryid);
	this.socketIo.removeAllListeners('appcategory-change:' + appcategoryid);
	this.socketIo.removeAllListeners('appcategory-delete:' + appcategoryid);

	for (var i in this.appCategoryChildren[appcategoryid]) {
		this.unregisterAppCategory(this.appCategoryChildren[appcategoryid][i]);
	}
	for (var i in this.appCategoryApplications[appcategoryid]) {
		this.unregisterApplication(this.appCategoryApplications[appcategoryid][i]);
	}
}

APIClient.prototype.saveAppCategory = function(appcategoryid, appcategory, callbackSuccess) {
	$.ajax({
		type: 'PUT',
		url: '/appcategorys/' + appcategoryid + '/save',
		data: { appcategory : appcategory },
		success: callbackSuccess
	});
}

APIClient.prototype.moveAppCategory = function (appcategoryid, parentid, position, callbackSuccess) {
	$.ajax({
		type: 'POST',
		url: '/appcategorys/' + appcategoryid + '/move',
		data: { parentid: parentid, position: position },
		success: callbackSuccess
	});
}

APIClient.prototype.deleteAppCategory = function(appcategoryid, callbackSuccess) {
	$.ajax({
		type: 'POST',
		url: '/appcategorys/' + appcategoryid + '/delete',
		success: callbackSuccess
	});
}
