function sanitize(item) {
	return item;
}
var db = core.applications;

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

exports.add = function (id, item, callbackSuccess) {
	db.save(id, item, function () {
		core.appcategorys.addApplication(item.categoryid, id, function (pos) {
			applicationSocket.emit('application-add:' + item.categoryid, { applicationid : id, position: pos });

			if (callbackSuccess) {
				callbackSuccess();
			}
		});
	});
}

exports.save = function (id, item, callbackSuccess) {
	db.save(id, item, function () {
		applicationSocket.emit('application-change:' + id, { application : sanitize(item) });

		if (callbackSuccess) {
			callbackSuccess();
		}
	});
}

exports.delete = function (id, callbackSuccess) {
	db.delete(id, function () {
		applicationSocket.emit('application-delete:' + id, {});

		if (callbackSuccess) {
			callbackSuccess();
		}
	});
}

exports.move = function (id, categoryid, position, callbackSuccess) {
	exports.get(id, function (item) {
		db.move(id, item.categoryid, categoryid, position, function () {
			item.categoryid = categoryid;
			exports.save(id, item, function () {
				applicationSocket.emit('application-delete:' + id, {});
				applicationSocket.emit('application-add:' + item.categoryid, {applicationid: id, position: position});

				if (callbackSuccess) {
					callbackSuccess();
				}
			});
		});
	});
}
