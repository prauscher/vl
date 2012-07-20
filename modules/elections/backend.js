// vim:noet:sw=8:

var FlatStructure = require('../backendStructureFlat.js');

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

module.exports.addBallot = function (electionid, ballotid, ballot, callbackSuccess) {
	core.ballots.save(ballotid, ballot, function () {
		core.elections.addBallot(electionid, ballotid, function () {
			electionSocket.emit('election-addballot:' + electionid, { ballotid: ballotid });

			if (callbackSuccess) {
				callbackSuccess();
			}
		});
	});
}

module.exports.deleteBallot = function (electionid, ballotid, callbackSuccess) {
	core.elections.deleteBallot(electionid, ballotid, function () {
		backend.ballots.delete(ballotid, callbackSuccess);
	});
}

module.exports.eachBallot = function (electionid, callback) {
	core.elections.getBallots(electionid, function (ballotids) {
		ballotids.forEach(function (ballotid, n) {
			backend.ballots.get(ballotid, function (ballot) {
				callback(ballotid, ballot);
			});
		});
	});
}
