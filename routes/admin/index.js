exports.index = function (req, res) {
	res.render('admin/index');
};

exports.agenda = require('./agenda.js');
exports.beamer = require('./beamer.js');
