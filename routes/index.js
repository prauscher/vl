// vim:noet:sw=8:

module.exports = function (options) {
	options.get('/projector', "showProjector", function (req, res) {
		res.render('showProjector', {});
	});

	options.get('/admin', "admin", function (req, res) {
		res.render('admin', {});
	});

	require('./projectors.js')	(options);
	require('./agenda.js')		(options);
	require('./timers.js')		(options);
	require('./motionclasses.js')	(options);
	require('./motions.js')		(options);
	require('./pollsites.js')	(options);
	require('./elections.js')	(options);
	require('./ballots.js')		(options);
	require('./options.js')		(options);
}
