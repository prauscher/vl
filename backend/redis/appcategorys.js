function getAppCategoryKey(appcategoryid) {
	if (typeof appcategoryid == 'undefined' || ! appcategoryid) {
		return "appcategorys";
	} else {
		return "appcategorys:" + appcategoryid + ":children";
	}
}

exports.exists = function (appcategoryid, callback) {
	db.exists('appcategorys:' + appcategoryid, function (err, exists) {
		callback(exists);
	});
}

exports.get = function(appcategoryid, callback) {
	db.hgetall('appcategorys:' + appcategoryid, function (err, appcategory) {
		callback(appcategory);
	});
}

exports.getChildren = function (appcategoryid, callback) {
	db.lrange(getAppCategoryKey(appcategoryid), 0, -1, function (err, subappcategoryids) {
		callback(subappcategoryids);
	})
}

exports.getApplications = function (appcategoryid, callback) {
	db.lrange("appcategorys:" + appcategoryid + ":applications", 0, -1, function (err, applicationids) {
		callback(applicationids);
	})
}

exports.addChildren = function(parentid, appcategoryid, callbackSuccess) {
	db.rpush(getAppCategoryKey(parentid), appcategoryid, function(err, pos) {
		callbackSuccess(pos - 1);
	});
}

exports.addApplication = function(parentid, applicationid, callbackSuccess) {
	db.rpush('appcategorys:' + parentid + ':applications', applicationid, function(err, pos) {
		callbackSuccess(pos - 1);
	});
}

exports.save = function(appcategoryid, appcategory, callbackSuccess) {
	// Need to delete first, so old keys wont get remembered (think of parentid etc)
	db.del('appcategorys:' + appcategoryid, function (err) {
		db.hmset('appcategorys:' + appcategoryid, appcategory, function (err) {
			callbackSuccess();
		});
	});
}

exports.move = function(appcategoryid, oldparentid, parentid, position, callbackSuccess) {
	db._lmove(appcategoryid, getAppCategoryKey(oldparentid), getAppCategoryKey(parentid), position, function () {
		callbackSuccess();
	});
}

exports.delete = function(appcategoryid, callbackSuccess) {
	db.hget('appcategorys:' + appcategoryid, 'parentid', function (err, parentid) {
		db.lrem(getAppCategoryKey(parentid), 0, appcategoryid, function (err) {
			db.del('appcategorys:' + appcategoryid, function (err) {
				db.del('appcategorys:' + appcategoryid + ':children');
				db.del('appcategorys:' + appcategoryid + ':applications');
				db.del('appcategorys:' + appcategoryid + ':ballots');

				callbackSuccess();
			});
		});
	});
}
