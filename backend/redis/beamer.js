var FlatStructure = require('./structure/flat.js');

module.exports = new FlatStructure({
	dbprefix : 'beamer',
	hooks : {
		delete : function (id) {
			db.del('beamer:' + id + ':timers');
		}
	}
});

module.exports.getDefault = function(callback) {
	db.get('defaultbeamer', function(err, defaultbeamer) {
		callback(defaultbeamer);
	});
}

module.exports.setDefault = function(beamerid, callback) {
	db.set('defaultbeamer', beamerid, function(err) {
		callback();
	});
}

module.exports.getTimers = function(beamerid, callback) {
	db.smembers('beamer:' + beamerid + ':timers', function (err, timerids) {
		callback(timerids);
	});
}

module.exports.showTimer = function(beamerid, timerid, callbackSuccess) {
	db.sadd('beamer:' + beamerid + ':timers', timerid, function() {
		callbackSuccess();
	});
}

module.exports.hideTimer = function(beamerid, timerid, callbackSuccess) {
	db.srem('beamer:' + beamerid + ':timers', timerid, function() {
		callbackSuccess();
	});
}
