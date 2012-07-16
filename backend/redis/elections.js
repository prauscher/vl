// vim:noet:sw=8:

var FlatStructure = require('./structure/flat.js');

module.exports = new FlatStructure({
	dbprefix : 'elections'
});

module.exports.addBallot = function (electionid, ballotid, callback) {
	db.rpush('elections:' + electionid + ':ballots', ballotid, function (err) {
		callback();
	});
}

module.exports.deleteBallot = function (electionid, ballotid, callback) {
	db.lrem('elections:' + electionid + ':ballots', 0, ballotid, function (err) {
		callback();
	});
}

module.exports.getBallots = function (electionid, callback) {
	db.lrange('elections:' + electionid + ':ballots', 0, -1, function (err, ballotids) {
		callback(ballotids);
	});
}
