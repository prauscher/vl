// vim:noet:sw=8:

var FlatStructure = require('./structure/flat.js');

module.exports = new FlatStructure({
	dbprefix : 'projectors',
	hooks : {
		delete : function (id) {
			db.del('projectors:' + id + ':timers');
		}
	}
});

module.exports.getDefault = function(callback) {
	db.get('defaultprojector', function(err, defaultprojector) {
		callback(defaultprojector);
	});
}

module.exports.setDefault = function(projectorid, callback) {
	db.set('defaultprojector', projectorid, function(err) {
		callback();
	});
}

module.exports.getTimers = function(projectorid, callback) {
	db.smembers('projectors:' + projectorid + ':timers', function (err, timerids) {
		callback(timerids);
	});
}

module.exports.showTimer = function(projectorid, timerid, callbackSuccess) {
	db.sadd('projectors:' + projectorid + ':timers', timerid, function() {
		callbackSuccess();
	});
}

module.exports.hideTimer = function(projectorid, timerid, callbackSuccess) {
	db.srem('projectors:' + projectorid + ':timers', timerid, function() {
		callbackSuccess();
	});
}
