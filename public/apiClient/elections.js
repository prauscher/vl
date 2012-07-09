APIClient.prototype.elections = {};

APIClient.prototype.getElection = function (electionid, callback) {
	callback(this.elections[electionid]);
}

APIClient.prototype.eachElection = function (callback) {
	for (var electionid in this.elections) {
		callback(electionid, this.elections[electionid]);
	}
}

APIClient.prototype.registerElections = function () {
	var self = this;
	this.listen("/elections", 'election-add', function (data) {
		self.elections[data.electionid] = data.election;

		self.registerElection(data.electionid);
		self.callCallback("initElection", [ data.electionid, data.election ]);
		self.callCallback("updateElection", [ data.electionid, data.election ]);
	});
	this.emit("/elections", 'registerelections', {});
}

APIClient.prototype.registerElection = function (electionid) {
	var self = this;
	this.listen("/elections", 'election-change:' + electionid, function (updateData) {
		self.elections[electionid] = updateData.election;

		self.callCallback("updateElection", [ electionid, updateData.election ] );
	});
	this.listen("/elections", 'election-delete:' + electionid, function (data) {
		self.unregisterElection(electionid);
		self.callCallback("deleteElection", [ electionid ] );
	});
}

APIClient.prototype.unregisterElection = function (electionid) {
	this.unlisten("/elections", 'election-change:' + electionid);
	this.unlisten("/elections", 'election-delete:' + electionid);
}

APIClient.prototype.saveElection = function(electionid, election, callbackSuccess) {
	$.ajax({
		type: 'PUT',
		url: '/elections/' + electionid + '/save',
		data: { election : election },
		success: callbackSuccess
	});
}

APIClient.prototype.deleteElection = function(electionid, callbackSuccess) {
	$.ajax({
		type: 'POST',
		url: '/elections/' + electionid + '/delete',
		success: callbackSuccess
	});
}
