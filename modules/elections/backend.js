// vim:noet:sw=8:

var FlatStructure = require('../backendStructureFlat.js');

module.exports = function () {
	var self = this;

	var backend = new FlatStructure({
		sanitize : function (item) {
			return item;
		},
		broadcastAdd : function (id, item) {
			self.socket.emit('election-add', { electionid : id, election: item });
		},
		broadcastChange : function (id, item) {
			self.socket.emit('election-change:' + id, { election: item });
		},
		broadcastDelete : function (id) {
			self.socket.emit('election-delete:' + id, {});
		},
		backend : core.elections
	});

	backend.addBallot = function (electionid, ballotid, ballot, callbackSuccess) {
		core.ballots.save(ballotid, ballot, function () {
			core.elections.addBallot(electionid, ballotid, function () {
				self.socket.emit('election-addballot:' + electionid, { ballotid: ballotid });

				if (callbackSuccess) {
					callbackSuccess();
				}
			});
		});
	}

	backend.deleteBallot = function (electionid, ballotid, callbackSuccess) {
		core.elections.deleteBallot(electionid, ballotid, function () {
			backend.ballots.delete(ballotid, callbackSuccess);
		});
	}

	backend.eachBallot = function (electionid, callback) {
		core.elections.getBallots(electionid, function (ballotids) {
			ballotids.forEach(function (ballotid, n) {
				backend.ballots.get(ballotid, function (ballot) {
					callback(ballotid, ballot);
				});
			});
		});
	}

	return backend;
}
