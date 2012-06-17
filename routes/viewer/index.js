exports.index = function(req,res) {
	res.render('viewer/index');
};

exports.beamer = function(req,res) {
	res.render('viewer/beamer', { beamerid : req.params.beamerid });
};

exports.beamer_default = function(req,res) {
	backend.beamer.getDefaultBeamerID(function (beamerid) {
		res.render('viewer/beamer', { beamerid : beamerid });
	});
};
