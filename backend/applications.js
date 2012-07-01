exports.exists = function (applicationid, callback) {
	core.applications.exists(applicationid, function (exists) {
		if (callback) {
			callback(exists);
		}
	});
}

exports.get = function(applicationid, callback) {
	core.applications.get(applicationid, function (application) {
		if (callback) {
			callback(application);
		}
	});
}

exports.add = function(applicationid, application, callbackSuccess) {
	core.applications.save(applicationid, application, function () {
		core.appcategorys.addApplication(application.categoryid, applicationid, function (pos) {
			io.sockets.emit('application-add:' + application.categoryid, { applicationid : applicationid, position: pos });

			if (callbackSuccess) {
				callbackSuccess();
			}
		});
	});
}

exports.save = function(applicationid, application, callbackSuccess) {
	core.applications.save(applicationid, application, function () {
		io.sockets.emit('application-change:' + applicationid, { application : application });

		if (callbackSuccess) {
			callbackSuccess();
		}
	});
}

exports.move = function(applicationid, categoryid, position, callbackSuccess) {
	exports.get(applicationid, function (application) {
		core.applications.move(applicationid, application.categoryid, categoryid, position, function () {
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
	core.appcategorys.delete(appcategoryid, function () {
		io.sockets.emit('application-delete:' + applicationid, {});

		if (callbackSuccess) {
			callbackSuccess();
		}
	});
}
