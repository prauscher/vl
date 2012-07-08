APIClient.prototype.motions = {};

APIClient.prototype.eachMotion = function (callback) {
	for (var motionid in this.motions) {
		callback(motionid, this.motions[motionid]);
	}
}

APIClient.prototype.getMotion = function (motionid, callback) {
	callback(this.motions[motionid]);
}

APIClient.prototype.registerMotion = function (motionid) {
	var self = this;
	this.listen("/motions", 'err:motion-not-found:' + motionid, function (data) {
		console.log("[APIClient] Motion not found: " + motionid);
		self.callCallback("error:motionNotFound", [ motionid ]);
	});
	this.listen("/motions", 'motion-change:' + motionid, function (data) {
		self.motions[motionid] = data.motion;

		self.callCallback("updateMotion", [ motionid, data.motion ] );
	});
	this.listen("/motions", 'motion-delete:' + motionid, function (data) {
		delete self.motions[motionid];
		self.unregisterMotion(motionid);
		self.callCallback("deleteMotion", [ motionid ] );
	});

	this.emit("/motions", 'registermotion', { motionid: motionid });
}

APIClient.prototype.unregisterMotion = function (motionid) {
	this.unlisten("/motions", 'err:motion-not-found:' + motionid);
	this.unlisten("/motions", 'motion-change:' + motionid);
	this.unlisten("/motions", 'motion-delete:' + motionid);
}

APIClient.prototype.saveMotion = function(motionid, motion, callbackSuccess) {
	$.ajax({
		type: 'PUT',
		url: '/motions/' + motionid + '/save',
		data: { motion : motion },
		success: callbackSuccess
	});
}

APIClient.prototype.moveMotion = function (motionid, classid, position, callbackSuccess) {
	$.ajax({
		type: 'POST',
		url: '/motions/' + motionid + '/move',
		data: { classid: classid, position: position },
		success: callbackSuccess
	});
}

APIClient.prototype.deleteMotion = function(motionid, callbackSuccess) {
	$.ajax({
		type: 'POST',
		url: '/motions/' + motionid + '/delete',
		success: callbackSuccess
	});
}
