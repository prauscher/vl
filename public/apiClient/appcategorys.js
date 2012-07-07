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
	this.listen("/applications", 'appcategory-add', function (data) {
		self.appCategorys[data.appcategoryid] = null;

		self.registerAppCategory(data.appcategoryid);
		self.callCallback("initAppCategory", [ data.appcategoryid, null, data.position ] );
	});
	this.emit("/applications", 'registerappcategorys', {});
}

APIClient.prototype.registerAppCategory = function (appcategoryid) {
	var self = this;
	self.appCategoryChildren[appcategoryid] = [];
	self.appCategoryApplications[appcategoryid] = [];
	this.listen("/applications", 'err:appcategory-not-found:' + appcategoryid, function (data) {
		console.log("[APIClient] AppCategory not found: " + appcategoryid);
		self.callCallback("error:appCategoryNotFound", [ appcategoryid ]);
	});
	this.listen("/applications", 'appcategory-add:' + appcategoryid, function (data) {
		self.appCategorys[data.appcategoryid] = null;
		self.appCategoryChildren[appcategoryid].push(data.appcategoryid);

		self.registerAppCategory(data.appcategoryid);
		self.callCallback("initAppCategory", [ data.appcategoryid, appcategoryid, data.position ] );
	});
	this.listen("/applications", 'application-add:' + appcategoryid, function (data) {
		self.applications[data.applicationid] = null;
		self.appCategoryApplications[appcategoryid].push(data.applicationid);

		self.registerApplication(data.applicationid);
		self.callCallback("initApplication", [ data.applicationid, appcategoryid, data.position ] );
	});
	this.listen("/applications", 'appcategory-change:' + appcategoryid, function (data) {
		self.appCategorys[appcategoryid] = data.appcategory;

		self.callCallback("updateAppCategory", [ appcategoryid, data.appcategory ] );
	});
	this.listen("/applications", 'appcategory-delete:' + appcategoryid, function (data) {
		var parentid = self.appCategorys[appcategoryid].parentid;
		if (parentid) {
			delete self.appCategorys[parentid];
			self.appCategoryChildren[parentid].slice(self.appCategoryChildren[parentid].indexOf(appcategoryid), 1);
		}

		self.unregisterAppCategory(appcategoryid);
		self.callCallback("deleteAppCategory", [ appcategoryid ] );
	});

	this.emit("/applications", 'registerappcategory', { appcategoryid: appcategoryid });
}

APIClient.prototype.unregisterAppCategory = function (appcategoryid) {
	this.unlisten("/applications", 'err:appcategory-not-found:' + appcategoryid);
	this.unlisten("/applications", 'appcategory-add:' + appcategoryid);
	this.unlisten("/applications", 'application-add:' + appcategoryid);
	this.unlisten("/applications", 'appcategory-change:' + appcategoryid);
	this.unlisten("/applications", 'appcategory-delete:' + appcategoryid);

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
