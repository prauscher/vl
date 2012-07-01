function getAppCategoryAddPublish(appcategoryid) {
	if (typeof appcategoryid == 'undefined' || ! appcategoryid) {
		return "appcategory-add";
	} else {
		return "appcategory-add:" + appcategoryid;
	}
}

exports.exists = function (appcategoryid, callback) {
	core.appcategorys.exists(appcategoryid, function (exists) {
		if (callback) {
			callback(exists);
		}
	});
}

exports.get = function(appcategoryid, callback) {
	core.appcategorys.get(appcategoryid, function (appcategory) {
		if (callback) {
			callback(appcategory);
		}
	});
}

exports.eachChildren = function (appcategoryid, callback) {
	core.appcategorys.getChildren(appcategoryid, function (subappcategoryids) {
		subappcategoryids.forEach(function (subappcategoryid) {
			exports.get(subappcategoryid, function (subappcategory) {
				callback(subappcategoryid, subappcategory);
			});
		});
	})
}

exports.eachApplication = function (appcategoryid, callback) {
	core.appcategorys.getApplications(appcategoryid, function (applicationids) {
		applicationids.forEach(function (applicationid) {
			exports.get(applicationid, function (application) {
				callback(applicationid, application);
			});
		});
	})
}

exports.add = function(appcategoryid, appcategory, callbackSuccess) {
	core.appcategorys.save(appcategoryid, appcategory, function () {
		core.appcategorys.addChildren(appcategory.parentid, appcategoryid, function (pos) {
			io.sockets.emit(getAppCategoryAddPublish(appcategory.parentid), { appcategoryid: appcategoryid, position: pos });
			if (callbackSuccess) {
				callbackSuccess();
			}
		});
	});
}

exports.save = function(appcategoryid, appcategory, callbackSuccess) {
	core.appcategorys.save(appcategoryid, appcategory, function () {
		io.sockets.emit('appcategory-change:' + appcategoryid, { appcategory: appcategory });

		if (callbackSuccess) {
			callbackSuccess();
		}
	});
}

exports.move = function(appcategoryid, parentid, position, callbackSuccess) {
	exports.get(appcategoryid, function (appcategory) {
		core.appcategorys.move(appcategoryid, appcategory.parentid, parentid, position, function () {
			if (parentid) {
				appcategory.parentid = parentid;
			} else {
				delete appcategory.parentid;
			}
			core.appcategorys.save(appcategoryid, appcategory, function () {
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
	core.appcategorys.delete(appcategoryid, function() {
		io.sockets.emit('appcategory-delete:' + appcategoryid, {});

		if (callbackSuccess) {
			callbackSuccess();
		}
	});
}
