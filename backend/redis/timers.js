// vim:noet:sw=8:

var FlatStructure = require('./structure/flat.js');

module.exports = new FlatStructure({
	dbprefix : 'timers',
	hooks : {
		delete : function (id) {
			backend.projectors.getAll(function (projectorid) {
				db.sismember('projectors:' + projectorid + ':timers', id, function (err, ismember) {
					if (ismember) {
						db.srem('projectors:' + projectorid + ':timers', id);
					}
				});
			});
		}
	}
});
