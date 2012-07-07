exports.exists = function (pollsiteid, callback) {
	db.exists('pollsites:' + pollsiteid, function (err, exists) {
		callback(exists);
	});
}

exports.get = function(pollsiteid, callback) {
	db.hgetall('pollsites:' + pollsiteid, function(err, pollsite) {
		callback(pollsite);
	});
}

exports.getAll = function(callback) {
	db.smembers('pollsites', function (err, pollsiteids) {
		callback(pollsiteids);
	});
}

exports.add = function(pollsiteid, callbackSuccess) {
	db.sadd('pollsites', pollsiteid, function () {
		callbackSuccess();
	});
}

exports.save = function(pollsiteid, pollsite, callbackSuccess) {
	db.hmset('pollsites:' + pollsiteid, pollsite, function (err) {
		callbackSuccess();
	});
}

exports.delete = function(pollsiteid, callbackSuccess) {
	db.srem('pollsites', pollsiteid, function (err) {
		db.del('pollsites:' + pollsiteid, function (err) {
			callbackSuccess();
		});
	});
}
