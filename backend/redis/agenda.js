exports.getRootSlideID = function (callback) {
	db.get('rootslideid', function (err, rootslideid) {
		callback(rootslideid);
	});
}

exports.setRootSlideID = function (rootslideid, callbackSuccess) {
	db.set('rootslideid', rootslideid, function () {
		callbackSuccess();
	});
}

exports.exists = function (slideid, callback) {
	db.exists('slides:' + slideid, function (err, exists) {
		callback(exists);
	});
}

exports.get = function(slideid, callback) {
	db.hgetall('slides:' + slideid, function (err, slide) {
		callback(slide);
	});
}

exports.getChildren = function(slideid, callback) {
	db.lrange('slides:' + slideid + ':children', 0, -1, function (err, subslideids) {
		callback(subslideids);
	});
}

exports.addChildren = function(parentid, slideid, callback) {
	db.rpush('slides:' + parentid + ":children", slideid, function (err, pos) {
		callback(pos - 1);
	});
}

exports.save = function(slideid, slide, callbackSuccess) {
	db.hmset('slides:' + slideid, slide, function (err) {
		callbackSuccess();
	});
}

exports.move = function(slideid, oldparentid, parentid, position, callbackSuccess) {
	db._lmove(slideid, 'slides:' + oldparentid + ':children', 'slides:' + parentid + ':children', position, function () {
		callbackSuccess();
	});
}

exports.delete = function(slideid, callbackSuccess) {
	db.hget('slides:' + slideid, 'parentid', function (err, parentid) {
		db.lrem('slides:' + parentid + ':children', 0, slideid, function (err) {
			db.del('slides:' + slideid, function (err) {
				db.del('slides:' + slideid + ':children');

				callbackSuccess();
			});
		});
	});
}
