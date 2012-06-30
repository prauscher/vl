exports.exists = function (applicationid, callback) {
	db.exists('applications:' + applicationid, function (err, exists) {
		callback(exists);
	});
}

exports.get = function(applicationid, callback) {
	db.hgetall('applications:' + applicationid, function (err, application) {
		callback(application);
	});
}

exports.save = function(applicationid, application, callbackSuccess) {
	db.hmset('applications:' + applicationid, application, function (err) {
		callbackSuccess();
	});
}

exports.move = function(applicationid, oldcategoryid, categoryid, position, callbackSuccess) {
	db._lmove(applicationid, 'appcategorys:' + oldcategoryid + ':applications', 'appcategorys:' + categoryid + ':applications', position, function () {
		callbackSuccess();
	});
}

exports.delete = function(applicationid, callbackSuccess) {
	db.hget('application:' + applicationid, 'categoryid', function (err, categoryid) {
		db.lrem('appcategorys:' + categoryid + ':applications', 0, applicationid, function (err) {
			db.del('applications:' + applicationid, function (err) {
				db.del('applications:' + applicationid + ':ballots');

				callbackSuccess();
			});
		});
	});
}
