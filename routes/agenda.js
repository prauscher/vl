exports.save = function (req, res) {
	var slide = req.body.slide;

	backend.agenda.exists(req.params.slideid, function (exists) {
		if (! exists) {
			backend.agenda.getRootSlideID(function (rootslideid) {
				backend.agenda.exists(rootslideid, function (parentexists) {
					if (parentexists) {
						slide.parentid = rootslideid;
					} else {
						delete slide.parentid;
						backend.agenda.setRootSlideID(req.params.slideid);
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
