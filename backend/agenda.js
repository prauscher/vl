exports.add = function(slideid, slide, callbackSuccess) {
	db.zcard('slides:' + slide.parentid + ':children', function (err, slidecount) {
		db.publish('slide-add', JSON.stringify({ slideid : slideid, slide : slide }));
		db.zadd('slides:' + slide.parentid + ":children", slidecount + 1, slideid, function (err) {});

		exports.save(slideid, slide, callbackSuccess);
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
