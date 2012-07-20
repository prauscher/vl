// vim:noet:sw=8:

module.exports = function () {
	var self = this;

	return function (socket) {
		socket.on('registerelections', function (data) {
			self.backend.getAll(function (electionid, election) {
				socket.emit('election-add', {electionid: electionid});
			});
		});

		socket.on('registerelection', function (data) {
			self.backend.get(data.electionid, function (election) {
				if (election == null) {
					socket.emit('err:election-not-found:' + data.electionid, {});
				} else {
					socket.emit('election-change:' + data.electionid, { election : election });
				}
			});
		});

		socket.on('registerelectionballots', function (data) {
			self.backend.eachBallot(data.electionid, function (ballotid) {
				socket.emit('election-addballot:' + data.electionid, { ballotid : ballotid });
			});
		});
	}
}
