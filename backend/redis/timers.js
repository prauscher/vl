var FlatStructure = require('./structure/flat.js');

module.exports = new FlatStructure({
	dbprefix : 'timers',
	hooks : {
		delete : function (id) {
			this.getAll(function (beamerids) {
				beamerids.forEach(function (beamerid) {
					db.sismember('beamer:' + beamerid + ':timers', id, function (err, ismember) {
						if (ismember) {
							db.srem('beamer:' + beamerid + ':timers', id);
						}
					});
				});
			});
		}
	}
});
