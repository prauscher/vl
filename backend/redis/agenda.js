function getSlideChildrenKey(id) {
	if (typeof id == 'undefined' || ! id) {
		return "slides";
	} else {
		return "slides:" + id + ":children";
	}
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
	db.lrange(getSlideChildrenKey(slideid), 0, -1, function (err, subslideids) {
		callback(subslideids);
	});
}

exports.addChildren = function(parentid, slideid, callback) {
	db.rpush(getSlideChildrenKey(parentid), slideid, function (err, pos) {
		callback(pos - 1);
	});
}

exports.save = function(slideid, slide, callbackSuccess) {
	db.hmset('slides:' + slideid, slide, function (err) {
		callbackSuccess();
	});
}

exports.move = function(slideid, oldparentid, parentid, position, callbackSuccess) {
	db._lmove(slideid, getSlideChildrenKey(oldparentid), getSlideChildrenKey(parentid), position, function () {
		callbackSuccess();
	});
}

exports.delete = function(slideid, callbackSuccess) {
	db.hget('slides:' + slideid, 'parentid', function (err, parentid) {
		db.lrem(getSlideChildrenKey(parentid), 0, slideid, function (err) {
			db.del('slides:' + slideid, function (err) {
				db.del(getSlideChildrenKey(slideid));

				callbackSuccess();
			});
		});
	});
}
