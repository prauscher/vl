function getAppCategoryKey(appcategoryid) {
	if (appcategoryid) {
		return "appcategorys:" + appcategoryid + ":children";
	} else {
		return "appcategorys";
	}
}

function getAppCategoryAddPublish(appcategoryid) {
	if (appcategoryid) {
		return "appcategory-add:" + appcategoryid;
	} else {
		return "appcategory-add";
	}
}

exports.exists = function (appcategoryid, callback) {
	db.exists('appcategorys:' + appcategoryid, function (err, exists) {
		callback(exists);
	});
}

exports.get = function(appcategoryid, callback) {
	db.hgetall('appcategorys:' + appcateogryid, function (err, appcategory) {
		callback(appcategory);
	});
}

exports.eachChildren = function (appcategoryid, callback) {
	db.zrange(getAppCategoryKey(appcategoryid), 0, -1, function (err, subappcategoryids) {
		subappcategoryids.forEach(function (appcategoryid) {
			exports.get(appcategoryid, function (appcategory) {
				callback(appcategoryid, appcategory);
			});
		});
	})
}

exports.eachApplication = function (appcategoryid, callback) {
	db.zrange("appcategorys:" + appcategoryid + ":applications", 0, -1, function (err, applicationids) {
		applicationids.forEach(function (applicationid) {
			exports.get(applicationid, function (application) {
				callback(applicationid, application);
			});
		});
	})
}

exports.add = function(appcategoryid, appcategory, callbackSuccess) {
	exports.save(applicationid, application, function () {
		db.zcard(getAppCategoryKey(appcategory.parentid), function (err, appcategorycount) {
			io.sockets.emit(getAppCategoryAddPublish(appcategory.parentid), { appcategoryid: appcategoryid, position: appcategorycount });
			db.zadd(getAppCategoryKey(appcategory.parentid), appcategoryid, appcategorycount);
		});

		if (callbackSuccess) {
			callbackSuccess();
		}
	});
}

exports.save = function(appcategoryid, appcategory, callbackSuccess) {
	db.hmset('appcategorys:' + appcategoryid, appcategory, function (err) {
		io.sockets.emit('appcategory-change:' + appcategoryid, { appcategory: appcategory });

		if (callbackSuccess) {
			callbackSuccess();
		}
	});
}

exports.move = function(appcategoryid, parentid, position, callbackSuccess) {
	exports.get(appcategoryid, function (appcategory) {
		db._zmove(appcategoryid, getAppCategoryKey(appcategory.parentid), getAppCategoryKey(appcategory.parentid), position, function () {
			appcategory.parentid = parentid;
			exports.save(applicationid, application, function () {
				io.sockets.emit('appcategory-delete:' + appcategoryid, {});
				io.sockets.emit(getAppCategoryAddPublish(appcategory.parentid), {appcategoryid: appcategory, position: position});

				if (callbackSuccess) {
					callbackSuccess();
				}
			});
		});
	});
}

exports.delete = function(appcategoryid, callbackSuccess) {
	db.hget('appcategory:' + appcategoryid, 'parentid', function (err, parentid) {
		db.zrem(getAppCategoryKey(parentid), appcategoryid, function (err) {
			db.del('appcategory:' + appcategoryid, function (err) {
				db.del('appcategorys:' + appcategoryid + ':children');
				db.del('appcategorys:' + appcategoryid + ':applications');
				db.del('appcategorys:' + appcategoryid + ':ballots');
				io.sockets.emit('appcategory-delete:' + appcategoryid, {});

				if (callbackSuccess) {
					callbackSuccess();
				}
			});
		});
	});
}
