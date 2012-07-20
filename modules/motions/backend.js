// vim:noet:sw=8:

module.exports = function () {
	var self = this;

	function sanitize(item) {
		return item;
	}
	var db = core.motions;

	return {
		exists : function (id, callback) {
			db.exists(id, function (exists) {
				if (callback) {
					callback(exists);
				}
			});
		},

		get : function (id, callback) {
			db.get(id, function (item) {
				if (callback) {
					callback(sanitize(item));
				}
			});
		},

		add : function (id, item, callbackSuccess) {
			db.save(id, item, function () {
				core.motionclasses.addMotion(item.classid, id, function (pos) {
					self.socket.emit('motion-add:' + item.classid, { motionid : id, position: pos });

					if (callbackSuccess) {
						callbackSuccess();
					}
				});
			});
		},

		save : function (id, item, callbackSuccess) {
			db.save(id, item, function () {
				self.socket.emit('motion-change:' + id, { motion : sanitize(item) });

				if (callbackSuccess) {
					callbackSuccess();
				}
			});
		},

		delete : function (id, callbackSuccess) {
			db.delete(id, function () {
				self.socket.emit('motion-delete:' + id, {});

				if (callbackSuccess) {
					callbackSuccess();
				}
			});
		},

		move : function (id, newclassid, position, callbackSuccess) {
			exports.get(id, function (item) {
				db.move(id, item.classid, newclassid, position, function () {
					item.classid = newclassid;
					exports.save(id, item, function () {
						self.socket.emit('motion-delete:' + id, {});
						self.socket.emit('motion-add:' + item.classid, { motionid: id, position: position });

						if (callbackSuccess) {
							callbackSuccess();
						}
					});
				});
			});
		},

		addBallot : function (motionid, ballotid, ballot, callbackSuccess) {
			core.ballots.save(ballotid, ballot, function () {
				core.motions.addBallot(motionid, ballotid, function () {
					self.socket.emit('motion-addballot:' + motionid, { ballotid: ballotid });

					if (callbackSuccess) {
						callbackSuccess();
					}
				});
			});
		},

		deleteBallot : function (motionid, ballotid, callbackSuccess) {
			core.motions.deleteBallot(motionid, ballotid, function () {
				backend.ballots.delete(ballotid, callbackSuccess);
			});
		},

		eachBallot : function (motionid, callback) {
			core.motions.getBallots(motionid, function (ballotids) {
				ballotids.forEach(function (ballotid, n) {
					modules.ballots.backend.get(ballotid, function (ballot) {
						callback(ballotid, ballot);
					});
				});
			});
		}
	}
}
