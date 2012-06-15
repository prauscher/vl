exports.current_slide = function(req, res) {
	db.hgetall('slides:' + req.body.slideid, function (err, slide) {
		db.hset('beamer:' + req.params.beamerid, 'currentslideid', req.body.slideid, function (err) {
			db.publish('beamer-goto:' + req.params.beamerid, JSON.stringify({ slideid : req.body.slideid, slide: slide }));
			res.send(200);
		});
	});
};

exports.flash = function (req, res) {
	db.publish('beamer-flash:' + req.params.beamerid, JSON.stringify({ flash : req.body.flash }));	
	res.send(200);
};
