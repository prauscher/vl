exports.getRootSlideID = function (callback) {
	db.get('rootslideid', function (err, rootslideid) {
		callback(rootslideid);
	});
}

exports.setRootSlideID = function (rootslideid, callbackSuccess) {
	db.set('rootslideid', rootslideid, function () {
		if (callbackSuccess) {
			callbackSuccess();
		}
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

exports.getAll = function(callback) {
	function handleSlide(slideid) {
		exports.get(slideid, function (slide) {
			callback(slideid, slide);
			db.zrange('slides:' + slideid + ':children', 0, -1, function (err, subslideids) {
				subslideids.forEach(function (subslideid) {
					handleSlide(subslideid);
				});
			});
		});
	}
	db.get('rootslideid', function (err, rootslideid) {
		handleSlide(rootslideid);
	});
}

exports.add = function(slideid, slide, callbackSuccess) {
	db.zcard('slides:' + slide.parentid + ':children', function (err, slidecount) {
		exports.save(slideid, slide, function() {
			io.sockets.emit('slide-add', { slideid : slideid, slide : slide });
			//db.publish('slide-add', JSON.stringify({ slideid : slideid, slide : slide }));
			db.zadd('slides:' + slide.parentid + ":children", slidecount + 1, slideid, function (err) {});

			if (callbackSuccess) {
				callbackSuccess();
			}
		});
	});
}

exports.save = function(slideid, slide, callbackSuccess) {
	db.hmset('slides:' + slideid, slide, function (err) {
		db.publish('slide-change:' + slideid, JSON.stringify({ slide : slide }));

		if (callbackSuccess) {
			callbackSuccess();
		}
	});
}

exports.delete = function(slideid, callbackSuccess) {
	db.hget('slides:' + slideid, 'parentid', function (err, parentid) {
		db.del('slides:' + slideid, function (err) {});
		db.zrem('slides:' + parentid + ':children', slideid, function (err) {});
		db.publish('slide-delete', JSON.stringify({ slideid : slideid }));

		if (callbackSuccess) {
			callbackSuccess();
		}
	});
}
