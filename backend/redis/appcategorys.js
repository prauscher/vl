function getAppCategoryKey(appcategoryid) {
	if (typeof appcategoryid == 'undefined' || ! appcategoryid) {
		return "appcategorys";
	} else {
		return "appcategorys:" + appcategoryid + ":children";
	}
}

function getAppCategoryAddPublish(appcategoryid) {
	if (typeof appcategoryid == 'undefined' || ! appcategoryid) {
		return "appcategory-add";
	} else {
		return "appcategory-add:" + appcategoryid;
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

exports.eachChildren = function (appcategoryid, callback) {
	db.lrange(getAppCategoryKey(appcategoryid), 0, -1, function (err, subappcategoryids) {
		subappcategoryids.forEach(function (subappcategoryid) {
			exports.get(subappcategoryid, function (subappcategory) {
				callback(subappcategoryid, subappcategory);
			});
		});
	})
}

exports.eachApplication = function (appcategoryid, callback) {
	db.lrange("appcategorys:" + appcategoryid + ":applications", 0, -1, function (err, applicationids) {
		applicationids.forEach(function (applicationid) {
			exports.get(applicationid, function (application) {
				callback(applicationid, application);
			});
		});
	})
}

exports.add = function(appcategoryid, appcategory, callbackSuccess) {
	exports.save(appcategoryid, appcategory, function () {
		db.rpush(getAppCategoryKey(appcategory.parentid), appcategoryid, function(err, pos) {
			io.sockets.emit(getAppCategoryAddPublish(appcategory.parentid), { appcategoryid: appcategoryid, position: pos-1 });
			if (callbackSuccess) {
				callbackSuccess();
			}
		});
	});
}

exports.save = function(appcategoryid, appcategory, callbackSuccess) {
	// Need to delete first, so old keys wont get remembered (think of parentid etc)
	db.del('appcategorys:' + appcategoryid, function (err) {
		db.hmset('appcategorys:' + appcategoryid, appcategory, function (err) {
			io.sockets.emit('appcategory-change:' + appcategoryid, { appcategory: appcategory });

			if (callbackSuccess) {
				callbackSuccess();
			}
		});
	});
}

exports.move = function(appcategoryid, parentid, position, callbackSuccess) {
	exports.get(appcategoryid, function (appcategory) {
		console.log(getAppCategoryKey(appcategory.parentid) + " => " + getAppCategoryKey(parentid));
		db._lmove(appcategoryid, getAppCategoryKey(appcategory.parentid), getAppCategoryKey(parentid), position, function () {
			if (parentid) {
				appcategory.parentid = parentid;
			} else {
				delete appcategory.parentid;
			}
			exports.save(appcategoryid, appcategory, function () {
				io.sockets.emit('appcategory-delete:' + appcategoryid, {});
				io.sockets.emit(getAppCategoryAddPublish(appcategory.parentid), {appcategoryid: appcategoryid, appcategory: appcategory, position: position});

				if (callbackSuccess) {
					callbackSuccess();
				}
			});
		});
	});
}

exports.delete = function(appcategoryid, callbackSuccess) {
	db.hget('appcategorys:' + appcategoryid, 'parentid', function (err, parentid) {
		db.lrem(getAppCategoryKey(parentid), 0, appcategoryid, function (err) {
			db.del('appcategorys:' + appcategoryid, function (err) {
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
