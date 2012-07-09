APIClient.prototype.ballots = {};

APIClient.prototype.getBallot = function (ballotid, callback) {
	callback(this.ballots[ballotid]);
}

APIClient.prototype.registerBallot = function (ballotid) {
	var self = this;
	this.listen("/ballots", 'err:ballot-not-found:' + ballotid, function (data) {
		console.log("[APIClient] Ballot not found: " + ballotid);
		self.callCallback("error:ballotNotFound", [ ballotid ]);
	});
	this.listen("/ballots", 'ballot-change:' + ballotid, function (updateData) {
		self.ballots[ballotid] = updateData.ballot;

		self.callCallback("updateBallot", [ ballotid, updateData.ballot ] );
	});
	this.listen("/ballots", 'ballot-delete:' + ballotid, function (data) {
		self.unregisterBallot(ballotid);
		self.callCallback("deleteBallot", [ ballotid ] );
	});
	this.emit("/ballots", 'registerballot', { ballotid : ballotid });
}

APIClient.prototype.unregisterBallot = function (ballotid) {
	this.unlisten("/ballots", 'err:ballot-not-found:' + ballotid);
	this.unlisten("/ballots", 'ballot-change:' + ballotid);
	this.unlisten("/ballots", 'ballot-delete:' + ballotid);
}

APIClient.prototype.saveBallot = function(ballotid, ballot, callbackSuccess) {
	$.ajax({
		type: 'PUT',
		url: '/ballots/' + ballotid + '/save',
		data: { ballot : ballot },
		success: callbackSuccess
	});
}

APIClient.prototype.deleteBallot = function(ballotid, callbackSuccess) {
	$.ajax({
		type: 'POST',
		url: '/ballots/' + ballotid + '/delete',
		success: callbackSuccess
	});
}
