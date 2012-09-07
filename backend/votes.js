// vim:noet:sw=8

module.exports.setVotes = function(ballotid, optionid, pollsiteid, votes) {
	core.votes.setVotes(ballotid, optionid, pollsiteid, votes);
	socket.emit('votes-set:' + ballotid + ':' + optionid + ':' + pollsiteid, {votes: votes});
}

module.exports.getVotes = function(ballotid, optionid, pollsiteid, cb) {
	core.votes.getVotes(ballotid, optionid, pollsiteid, cb);
}
