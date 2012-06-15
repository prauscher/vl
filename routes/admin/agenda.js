exports.save = function (req, res) {
	var slide = req.body.slide;

	db.exists('slides:' + req.params.slideid, function (err, exists) {
		if (! exists) {
			db.get('rootslideid', function (err, rootslideid) {
				db.exists('slides:' + rootslideid, function (err, parentexists) {
					if (parentexists) {
						slide.parentid = rootslideid;
					} else {
						delete slide.parentid;
						db.set('rootslideid', req.params.slideid);
					}
					addSlide(req.params.slideid, slide, function() {
						res.send(200);
					});
				});
			});
		} else {
			saveSlide(req.params.slideid, slide, function() {
				res.send(200);
			});
		}
	});
}

exports.delete = function (req, res) {
	db.hget('slides:' + req.params.slideid, 'parentid', function (err, parentid) {
		db.del('slides:' + req.params.slideid, function (err) {});
		db.zrem('slides:' + parentid + ':children', req.params.slideid, function (err) {});
		db.publish('slide-delete', JSON.stringify({ slideid : req.params.slideid }));

		res.send(200);
	});
}

exports.isdone = function (req, res) {
	db.hset('slides:' + req.params.slideid, 'isdone', req.body.isdone, function (err) {
		db.hgetall('slides:' + req.params.slideid, function (err, slide) {
			db.publish('slide-change:' + req.params.slideid, JSON.stringify({ slide : slide }));
		});
		res.send(200);
	});	
}

exports.hidden = function (req, res) {
	db.hset('slides:' + req.params.slideid, 'hidden', req.body.hidden, function (err) {
		db.hgetall('slides:' + req.params.slideid, function (err, slide) {
			db.publish('slide-change:' + req.params.slideid, JSON.stringify({ slide : slide }));
		});
		res.send(200);
	});
}

function addSlide(slideid, slide, callbackSuccess) {
	db.zcard('slides:' + slide.parentid + ':children', function (err, slidecount) {
		db.publish('slide-add', JSON.stringify({ slideid : slideid, slide : slide }));
		db.zadd('slides:' + slide.parentid + ":children", slidecount + 1, slideid, function (err) {});

		saveSlide(slideid, slide, callbackSuccess);
	});
}

function saveSlide(slideid, slide, callbackSuccess) {
	db.hmset('slides:' + slideid, slide, function (err) {
		db.publish('slide-change:' + slideid, JSON.stringify({ slide : slide }));
		callbackSuccess();
	});
}
