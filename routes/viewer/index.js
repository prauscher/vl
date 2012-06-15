exports.index = function(req,res) {
	res.render('viewer/index');
};

exports.beamer = function(req,res) {
	res.render('viewer/beamer', { beamerid : req.params.beamerid });
};

exports.beamer_default = function(req,res) {
	db.get('defaultbeamerid', function(err,beamerid) {
		res.render('viewer/beamer', { beamerid : beamerid });
	});
};
