var FlatStructure = require('./structure/flat.js');

module.exports = new FlatStructure({
	dbprefix : 'elections'
});

module.exports.getBallots = function (electionid, callback) {
	db.smembers('elections:' + electionid + ':ballots', function (err, ballotids) {
		callback(ballotids);
	});
}
