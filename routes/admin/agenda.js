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
					backend.agenda.add(req.params.slideid, slide, function() {
						res.send(200);
					});
				});
			});
		} else {
			backend.agenda.save(req.params.slideid, slide, function() {
				res.send(200);
			});
		}
	});
}

exports.delete = function (req, res) {
	backend.agenda.delete(req.params.slideid, function () {
		res.send(200);
	});
}
