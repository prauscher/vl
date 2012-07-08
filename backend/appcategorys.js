function getAppCategoryAddPublish(id) {
	if (typeof id == 'undefined' || ! id) {
		return "appcategory-add";
	} else {
		return "appcategory-add:" + id;
	}
}

function sanitize(item) {
	return item;
}
var db = core.appcategorys;

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

exports.eachChildren = function (id, callback) {
	db.getChildren(id, function (subids) {
		subids.forEach(function (subid) {
			exports.get(subid, function (subitem) {
				callback(subid, subitem);
			});
		});
	})
}

exports.eachApplication = function (id, callback) {
	db.getApplications(id, function (applicationids) {
		applicationids.forEach(function (applicationid) {
			exports.get(applicationid, function (application) {
				callback(applicationid, application);
			});
		});
	})
}

exports.add = function (id, item, callbackSuccess) {
	db.save(id, item, function () {
		db.addChildren(item.parentid, id, function (pos) {
			applicationSocket.emit(getAppCategoryAddPublish(item.parentid), { appcategoryid: id, position: pos });
			if (callbackSuccess) {
				callbackSuccess();
			}
		});
	});
}

exports.save = function (id, item, callbackSuccess) {
	db.save(id, item, function () {
		applicationSocket.emit('appcategory-change:' + id, { appcategory: sanitize(item) });

		if (callbackSuccess) {
			callbackSuccess();
		}
	});
}

exports.move = function (id, parentid, position, callbackSuccess) {
	exports.get(id, function (item) {
		db.move(id, item.parentid, parentid, position, function () {
			if (parentid) {
				item.parentid = parentid;
			} else {
				delete item.parentid;
			}
			db.save(id, item, function () {
				applicationSocket.emit('appcategory-delete:' + id, {});
				applicationSocket.emit(getAppCategoryAddPublish(item.parentid), {appcategoryid: id, appcategory: sanitize(item), position: position});

				if (callbackSuccess) {
					callbackSuccess();
				}
			});
		});
	});
}

exports.delete = function (id, callbackSuccess) {
	db.delete(id, function () {
		applicationSocket.emit('appcategory-delete:' + id, {});

		if (callbackSuccess) {
			callbackSuccess();
		}
	});
}
