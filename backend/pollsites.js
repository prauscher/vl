exports.exists = function(pollsiteid, callback) {
	core.pollsites.exists(pollsiteid, function (exists) {
		if (callback) {
			callback(exists);
		}
	});
}

exports.get = function(pollsiteid, callback) {
	core.pollsites.get(pollsiteid, function (pollsite) {
		if (callback) {
			callback(exists);
		}
	});
}

exports.getAll = function(callback) {
	core.pollsites.getAll(function (pollsiteids) {
		pollsiteids.forEach(function (pollsiteid, n) {
			core.pollsites.get(pollsiteid, function (pollsite) {
				callback(pollsiteid, pollsite);
			});
		});
	});
}

exports.add = function(pollsiteid, pollsite, callbackSuccess) {
	core.pollsites.save(pollsiteid, pollsite, function () {
		core.pollsites.add(pollsiteid, function() {
			pollsiteSocket.emit('pollsite-add', { pollsiteid : pollsiteid, pollsite: pollsite });

			if (callbackSuccess) {
				callbackSuccess();
			}
		});
	});
}

exports.save = function(pollsiteid, pollsite, callbackSuccess) {
	core.pollsites.save(pollsiteid, pollsite, function () {
		pollsiteSocket.emit('pollsite-change:' + pollsiteid, { pollsite : pollsite });

		if (callbackSuccess) {
			callbackSuccess();
		}
	});
}

exports.delete = function(pollsiteid, callbackSuccess) {
	core.pollsites.delete(pollsiteid, function () {
		pollsiteSocket.emit('pollsite-delete:' + pollsiteid, {});

		if (callbackSuccess) {
			callbackSuccess();
		}
	});
}
