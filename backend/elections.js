var FlatStructure = require('./structure/flat.js');

module.exports = new FlatStructure({
	sanitize : function (item) {
		return item;
	},
	broadcastAdd : function (id, item) {
		electionSocket.emit('election-add', { electionid : id, election: item });
	},
	broadcastChange : function (id, item) {
		electionSocket.emit('election-change:' + id, { election: item });
	},
	broadcastDelete : function (id) {
		electionSocket.emit('election-delete:' + id, {});
	},
	backend : core.elections
});

module.exports.eachBallot = function (electionid, callback) {
	core.elections.getBallots(electionid, function (ballotids) {
		ballotids.forEach(function (ballotid, n) {
			backend.ballots.get(ballotid, function (ballot) {
				callback(ballotid, ballot);
			});
		});
	});
}
