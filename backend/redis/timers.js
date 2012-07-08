var FlatStructure = require('./structure/flat.js');

module.exports = new FlatStructure({
	dbprefix : 'timers',
	hooks : {
		delete : function (id) {
			this.getAll(function (projectorids) {
				projectorids.forEach(function (projectorid) {
					db.sismember('projector:' + projectorid + ':timers', id, function (err, ismember) {
						if (ismember) {
							db.srem('projector:' + projectorid + ':timers', id);
						}
					});
				});
			});
		}
	}
});
