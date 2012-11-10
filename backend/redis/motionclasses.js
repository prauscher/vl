// vim:noet:sw=8:

function getMotionClassKey(motionclassid) {
	if (typeof motionclassid == 'undefined' || ! motionclassid) {
		return "motionclasses";
	} else {
		return "motionclasses:" + motionclassid + ":children";
	}
}

exports.exists = function (motionclassid, callback) {
	db.exists('motionclasses:' + motionclassid, function (err, exists) {
		callback(exists);
	});
}

exports.get = function(motionclassid, callback) {
	db.hgetall('motionclasses:' + motionclassid, function (err, motionclass) {
		callback(motionclass);
	});
}

exports.getChildren = function (motionclassid, callback) {
	db.lrange(getMotionClassKey(motionclassid), 0, -1, function (err, motionsubclassids) {
		callback(motionsubclassids);
	})
}

exports.getNextMotionID = function (motionclassid, callback) {
	db.incr("motionclasses:" + motionclassid + ":nextMotionID", function (err, nextMotionID) {
		callback(nextMotionID);
	});
}

exports.getMotions = function (motionclassid, callback) {
	db.lrange("motionclasses:" + motionclassid + ":motions", 0, -1, function (err, motionids) {
		callback(motionids);
	})
}

exports.addChildren = function(parentid, motionclassid, callbackSuccess) {
	db.rpush(getMotionClassKey(parentid), motionclassid, function(err, pos) {
		callbackSuccess(pos - 1);
	});
}

exports.addMotion = function(parentid, motionid, callbackSuccess) {
	db.rpush('motionclasses:' + parentid + ':motions', motionid, function(err, pos) {
		callbackSuccess(pos - 1);
	});
}

exports.save = function(motionclassid, motionclass, callbackSuccess) {
	// Need to delete first, so old keys wont get remembered (think of parentid etc)
	db.del('motionclasses:' + motionclassid, function (err) {
		db.hmset('motionclasses:' + motionclassid, motionclass, function (err) {
			callbackSuccess();
		});
	});
}

exports.move = function(motionclassid, oldparentid, parentid, position, callbackSuccess) {
	db._lmove(motionclassid, getMotionClassKey(oldparentid), getMotionClassKey(parentid), position, function () {
		callbackSuccess();
	});
}

exports.delete = function(motionclassid, callbackSuccess) {
	db.hget('motionclasses:' + motionclassid, 'parentid', function (err, parentid) {
		db.lrem(getMotionClassKey(parentid), 0, motionclassid, function (err) {
			db.del('motionclasses:' + motionclassid, function (err) {
				db.del('motionclasses:' + motionclassid + ':children');
				db.del('motionclasses:' + motionclassid + ':motions');
				db.del('motionclasses:' + motionclassid + ':ballots');

				callbackSuccess();
			});
		});
	});
}
