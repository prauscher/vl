exports.exists = function (motionid, callback) {
	db.exists('motions:' + motionid, function (err, exists) {
		callback(exists);
	});
}

exports.get = function(motionid, callback) {
	db.hgetall('motions:' + motionid, function (err, motion) {
		callback(motion);
	});
}

exports.save = function(motionid, motion, callbackSuccess) {
	db.hmset('motions:' + motionid, motion, function (err) {
		callbackSuccess();
	});
}

exports.move = function(motionid, oldclassid, newclassid, position, callbackSuccess) {
	db._lmove(motionid, 'motionclasses:' + oldclassid + ':motions', 'motionclasses:' + newclassid + ':motions', position, function () {
		callbackSuccess();
	});
}

exports.delete = function(motionid, callbackSuccess) {
	db.hget('motions:' + motionid, 'class', function (err, motionclassid) {
		db.lrem('motionclasses:' + motionclassid + ':motions', 0, motionid, function (err) {
			db.del('motions:' + motionid, function (err) {
				db.del('motions:' + motionid + ':ballots');

				callbackSuccess();
			});
		});
	});
}
