function sanitize(item) {
	return item;
}
var db = core.motions;

exports.exists = function (id, callback) {
	db.exists(id, function (exists) {
		if (callback) {
			callback(exists);
		}
	});
}

exports.get = function (id, callback) {
	db.get(id, function (item) {
		if (callback) {
			callback(sanitize(item));
		}
	});
}

exports.add = function (id, item, callbackSuccess) {
	db.save(id, item, function () {
		core.motionclasses.addMotion(item.classid, id, function (pos) {
			motionSocket.emit('motion-add:' + item.classid, { motionid : id, position: pos });

			if (callbackSuccess) {
				callbackSuccess();
			}
		});
	});
}

exports.save = function (id, item, callbackSuccess) {
	db.save(id, item, function () {
		motionSocket.emit('motion-change:' + id, { motion : sanitize(item) });

		if (callbackSuccess) {
			callbackSuccess();
		}
	});
}

exports.delete = function (id, callbackSuccess) {
	db.delete(id, function () {
		motionSocket.emit('motion-delete:' + id, {});

		if (callbackSuccess) {
			callbackSuccess();
		}
	});
}

exports.move = function (id, newclassid, position, callbackSuccess) {
	exports.get(id, function (item) {
		db.move(id, item.classid, newclassid, position, function () {
			item.classid = newclassid;
			exports.save(id, item, function () {
				motionSocket.emit('motion-delete:' + id, {});
				motionSocket.emit('motion-add:' + item.classid, { motionid: id, position: position });

				if (callbackSuccess) {
					callbackSuccess();
				}
			});
		});
	});
}

exports.addBallot = function (motionid, ballotid, ballot, callbackSuccess) {
	core.ballots.save(ballotid, ballot, function () {
		core.motions.addBallot(motionid, ballotid, function () {
			motionSocket.emit('motion-addballot:' + motionid, { ballotid: ballotid });

			if (callbackSuccess) {
				callbackSuccess();
			}
		});
	});
}

exports.deleteBallot = function (motionid, ballotid, callbackSuccess) {
	core.motions.deleteBallot(motionid, ballotid, function () {
		backend.ballots.delete(ballotid, callbackSuccess);
	});
}

exports.eachBallot = function (motionid, callback) {
	core.motions.getBallots(motionid, function (ballotids) {
		ballotids.forEach(function (ballotid, n) {
			backend.ballots.get(ballotid, function (ballot) {
				callback(ballotid, ballot);
			});
		});
	});
}
