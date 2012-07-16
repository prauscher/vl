// vim:noet:sw=8:

APIClient.prototype.elections = {};

APIClient.prototype.getElection = function (electionid, callback) {
	callback(this.elections[electionid]);
}

APIClient.prototype.eachElection = function (callback) {
	for (var electionid in this.elections) {
		callback(electionid, this.elections[electionid]);
	}
}

APIClient.prototype.registerElectionBallots = function (electionid) {
	var self = this;
	this.listen("/elections", 'election-addballot:' + electionid, function (data) {
		self.registerBallot(data.ballotid);
		self.callCallback("initElectionBallot", [ electionid, data.ballotid ]);
	});
	this.emit("/elections", 'registerelectionballots', { electionid: electionid });
}

APIClient.prototype.unregisterElectionBallots = function (electionid) {
	this.unlisten("/elections", 'election-addballot:' + electionid);
}

APIClient.prototype.registerElections = function () {
	var self = this;
	this.listen("/elections", 'election-add', function (data) {
		self.elections[data.electionid] = null;

		self.registerElection(data.electionid);
		self.callCallback("initElection", [ data.electionid ]);
	});
	this.emit("/elections", 'registerelections', {});
}

APIClient.prototype.registerElection = function (electionid) {
	var self = this;
	this.listen("/elections", 'err:election-not-found:' + electionid, function (data) {
		console.log("[APIClient] Election not found: " + electionid);
		self.callCallback("error:electionNotFound", [ electionid ]);
	});
	this.listen("/elections", 'election-change:' + electionid, function (updateData) {
		self.elections[electionid] = updateData.election;

		self.callCallback("updateElection", [ electionid, updateData.election ] );
	});
	this.listen("/elections", 'election-delete:' + electionid, function (data) {
		self.unregisterElection(electionid);
		self.callCallback("deleteElection", [ electionid ] );
	});
	this.emit("/elections", 'registerelection', { electionid : electionid });
}

APIClient.prototype.unregisterElection = function (electionid) {
	this.unlisten("/elections", 'err:election-not-found:' + electionid);
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

APIClient.prototype.electionAddBallot = function (electionid, ballotid, ballot, callbackSuccess) {
	$.ajax({
		type: 'PUT',
		url: '/elections/' + electionid + '/addBallot',
		data: { ballotid: ballotid, ballot: ballot },
		success: callbackSuccess
	});
}

APIClient.prototype.electionDeleteBallot = function (electionid, ballotid, callbackSuccess) {
	$.ajax({
		type: 'POST',
		url: '/elections/' + electionid + '/deleteBallot',
		data: { ballotid: ballotid },
		success: callbackSuccess
	});
}
