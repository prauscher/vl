// vim:noet:sw=8

module.exports.setVotes = function(ballotid, optionid, pollsiteid, votes) {
	db.set("votes:" + ballotid + ":" + optionid + ":" + pollsiteid, votes);
}

module.exports.getVotes = function(ballotid, optionid, pollsiteid, cb) {
	db.get("votes:" + ballotid + ":" + optionid + ":" + pollsiteid, function(err, val) {
		cb(val);
	});
}
