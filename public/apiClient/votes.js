// vim:noet:sw=8:

APIClient.prototype.registerVotes = function(ballotid) {
	var self = this;
	this.listen("/votes", 'votes-set:' + ballotid, function(data) {
		self.callCallback('votesSet', [ ballotid, data.optionid, data.pollsiteid, data.votes ]);
	});
	this.emit('/votes', 'registervotes', {ballotid: ballotid});
}

APIClient.prototype.unregisterVotes = function(ballotid) {
	this.unlisten('/votes', 'votes-set:' + ballotid);
}
