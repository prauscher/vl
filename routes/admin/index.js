exports.index = function (req, res) {
	res.render('admin/index');
};

exports.beamer = require('./beamer.js');
exports.agenda = require('./agenda.js');
exports.timers = require('./timers.js');
