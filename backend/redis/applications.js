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

exports.add = function(applicationid, application, callbackSuccess) {
	exports.save(applicationid, application, function () {
		console.log('appcategorys:' + application.categoryid + ':applications' + " / " + applicationcount + " / " + applicationid);
		db.rpush('appcategorys:' + application.categoryid + ':applications', applicationid, function(err, pos) {
			io.sockets.emit('application-add:' + application.categoryid, { applicationid : applicationid, position: pos-1 });

			if (callbackSuccess) {
				callbackSuccess();
			}
		});
	});
}

exports.save = function(applicationid, application, callbackSuccess) {
	db.hmset('applications:' + applicationid, application, function (err) {
		io.sockets.emit('application-change:' + applicationid, { application : application });

		if (callbackSuccess) {
			callbackSuccess();
		}
	});
}

exports.move = function(applicationid, categoryid, position, callbackSuccess) {
	exports.get(applicationid, function (application) {
		db._lmove(applicationid, 'appcategorys:' + application.categoryid + ':applications', 'appcategorys:' + categoryid + ':applications', position, function () {
			application.categoryid = categoryid;
			exports.save(applicationid, application, function () {
				io.sockets.emit('application-delete:' + applicationid, {});
				io.sockets.emit('application-add:' + application.categoryid, {applicationid: applicationid, position: position});

				if (callbackSuccess) {
					callbackSuccess();
				}
			});
		});
	});
}

exports.delete = function(applicationid, callbackSuccess) {
	db.hget('application:' + applicationid, 'categoryid', function (err, categoryid) {
		db.lrem('appcategorys:' + categoryid + ':applications', 0, applicationid, function (err) {
			db.del('applications:' + applicationid, function (err) {
				db.del('applications:' + applicationid + ':ballots');
				io.sockets.emit('application-delete:' + applicationid, {});

				if (callbackSuccess) {
					callbackSuccess();
				}
			});
		});
	});
}
