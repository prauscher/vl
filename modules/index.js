// vim:noet:sw=8:

module.exports = function (options) {
	options.get('/projector', "showProjector", function (req, res) {
		res.render('showProjector', {});
	});

	options.get('/admin', "admin", function (req, res) {
		res.render('admin', {});
	});

	require('./projectors/index.js')	(options);
	require('./agenda/index.js')		(options);
	require('./timers/index.js')		(options);
	require('./motions/index.js')		(options);
	require('./pollsites/index.js')		(options);
	require('./elections/index.js')		(options);
	require('./ballots/index.js')		(options);
}
