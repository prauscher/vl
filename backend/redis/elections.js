var FlatStructure = require('./structure/flat.js');

module.exports = new FlatStructure({
	dbprefix : 'elections'
});

module.exports.addBallot = function (electionid, ballotid, callback) {
	db.sadd('elections:' + electionid + ':ballots', ballotid, function (err) {
		callback();
	});
}

module.exports.deleteBallot = function (electionid, ballotid, callback) {
	db.srem('elections:' + electionid + ':ballots', ballotid, function (err) {
		callback();
	});
}

module.exports.getBallots = function (electionid, callback) {
	db.smembers('elections:' + electionid + ':ballots', function (err, ballotids) {
		callback(ballotids);
	});
}
