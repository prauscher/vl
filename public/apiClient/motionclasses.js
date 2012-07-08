APIClient.prototype.appCategorys = {};
APIClient.prototype.appCategoryChildren = {};
APIClient.prototype.appCategoryMotions = {};

APIClient.prototype.eachMotionClass = function (callback) {
	for (var appCategoryid in this.appCategorys) {
		callback(appCategoryid, this.appCategorys[appCategoryid]);
	}
}

APIClient.prototype.getMotionClass = function (appCategoryid, callback) {
	callback(this.appCategorys[appCategoryid]);
}

APIClient.prototype.registerMotionClasses = function () {
	var self = this;
	this.listen("/motions", 'motionclass-add', function (data) {
		self.appCategorys[data.motionclassid] = null;

		self.registerMotionClass(data.motionclassid);
		self.callCallback("initMotionClass", [ data.motionclassid, null, data.position ] );
	});
	this.emit("/motions", 'registermotionclasses', {});
}

APIClient.prototype.registerMotionClass = function (motionclassid) {
	var self = this;
	self.appCategoryChildren[motionclassid] = [];
	self.appCategoryMotions[motionclassid] = [];
	this.listen("/motions", 'err:motionclass-not-found:' + motionclassid, function (data) {
		console.log("[APIClient] MotionClass not found: " + motionclassid);
		self.callCallback("error:appCategoryNotFound", [ motionclassid ]);
	});
	this.listen("/motions", 'motionclass-add:' + motionclassid, function (data) {
		self.appCategorys[data.motionclassid] = null;
		self.appCategoryChildren[motionclassid].push(data.motionclassid);

		self.registerMotionClass(data.motionclassid);
		self.callCallback("initMotionClass", [ data.motionclassid, motionclassid, data.position ] );
	});
	this.listen("/motions", 'motion-add:' + motionclassid, function (data) {
		self.motions[data.motionid] = null;
		self.appCategoryMotions[motionclassid].push(data.motionid);

		self.registerMotion(data.motionid);
		self.callCallback("initMotion", [ data.motionid, motionclassid, data.position ] );
	});
	this.listen("/motions", 'motionclass-change:' + motionclassid, function (data) {
		self.appCategorys[motionclassid] = data.motionclass;

		self.callCallback("updateMotionClass", [ motionclassid, data.motionclass ] );
	});
	this.listen("/motions", 'motionclass-delete:' + motionclassid, function (data) {
		var parentid = self.appCategorys[motionclassid].parentid;
		if (parentid) {
			delete self.appCategorys[parentid];
			self.appCategoryChildren[parentid].slice(self.appCategoryChildren[parentid].indexOf(motionclassid), 1);
		}

		self.unregisterMotionClass(motionclassid);
		self.callCallback("deleteMotionClass", [ motionclassid ] );
	});

	this.emit("/motions", 'registermotionclass', { motionclassid: motionclassid });
}

APIClient.prototype.unregisterMotionClass = function (motionclassid) {
	this.unlisten("/motions", 'err:motionclass-not-found:' + motionclassid);
	this.unlisten("/motions", 'motionclass-add:' + motionclassid);
	this.unlisten("/motions", 'motion-add:' + motionclassid);
	this.unlisten("/motions", 'motionclass-change:' + motionclassid);
	this.unlisten("/motions", 'motionclass-delete:' + motionclassid);

	for (var i in this.appCategoryChildren[motionclassid]) {
		this.unregisterMotionClass(this.appCategoryChildren[motionclassid][i]);
	}
	for (var i in this.appCategoryMotions[motionclassid]) {
		this.unregisterMotion(this.appCategoryMotions[motionclassid][i]);
	}
}

APIClient.prototype.saveMotionClass = function(motionclassid, motionclass, callbackSuccess) {
	$.ajax({
		type: 'PUT',
		url: '/motionclasses/' + motionclassid + '/save',
		data: { motionclass : motionclass },
		success: callbackSuccess
	});
}

APIClient.prototype.moveMotionClass = function (motionclassid, parentid, position, callbackSuccess) {
	$.ajax({
		type: 'POST',
		url: '/motionclasses/' + motionclassid + '/move',
		data: { parentid: parentid, position: position },
		success: callbackSuccess
	});
}

APIClient.prototype.deleteMotionClass = function(motionclassid, callbackSuccess) {
	$.ajax({
		type: 'POST',
		url: '/motionclasses/' + motionclassid + '/delete',
		success: callbackSuccess
	});
}
